import { spawnSync } from "node:child_process";
import path from "node:path";
import { readJson } from "./common.mjs";

const result = spawnSync("bun", ["x", "eslint", ".", "--format", "json"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (!result.stdout.trim()) {
  console.error(result.stderr || "ESLint did not return JSON output.");
  process.exit(result.status ?? 1);
}

const reports = JSON.parse(result.stdout);
const current = reports.flatMap((report) =>
  report.messages
    .filter((message) => message.severity === 1)
    .map((message) => ({
      file: path.relative(process.cwd(), report.filePath).replaceAll(path.sep, "/"),
      line: message.line,
      column: message.column,
      rule: message.ruleId,
      message: message.message,
    })),
);
const errors = reports.flatMap((report) =>
  report.messages.filter((message) => message.severity === 2),
);
if (errors.length > 0) {
  console.error(`ESLint reported ${errors.length} error(s).`);
  process.exit(1);
}

const baseline = readJson("quality/lint-warning-baseline.json");
const newWarnings = current.filter(
  (item) =>
    !baseline.warnings.some(
      (entry) =>
        entry.file === item.file &&
        entry.line === item.line &&
        entry.column === item.column &&
        entry.rule === item.rule &&
        item.message.includes(entry.messageIncludes),
    ),
);
const resolved = baseline.warnings.filter(
  (entry) =>
    !current.some(
      (item) =>
        entry.file === item.file &&
        entry.line === item.line &&
        entry.column === item.column &&
        entry.rule === item.rule &&
        item.message.includes(entry.messageIncludes),
    ),
);
const expired = baseline.warnings.filter((item) => Date.parse(item.expiry) < Date.now());
const toolingWarnings = current.filter((item) =>
  /^(scripts|tests|e2e|playwright\.config\.ts|eslint\.config\.js|quality)\b/.test(item.file),
);

if (resolved.length > 0)
  console.log(
    `${resolved.length} lint baseline warning(s) resolved; remove their registry entries.`,
  );
if (newWarnings.length || expired.length || toolingWarnings.length) {
  for (const warning of newWarnings)
    console.error(
      `New lint warning: ${warning.file}:${warning.line}:${warning.column} ${warning.rule ?? "directive"} ${warning.message}`,
    );
  for (const warning of expired)
    console.error(`Expired lint baseline: ${warning.file}:${warning.line}`);
  for (const warning of toolingWarnings)
    console.error(`F14A tooling warning: ${warning.file}:${warning.line}`);
  process.exit(1);
}
console.log(`Lint governance: PASS (${current.length} exact existing warning(s), 0 new).`);
