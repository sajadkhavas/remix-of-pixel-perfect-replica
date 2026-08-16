import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const files = [
  "docs/front-overhaul/F6_REVIEW.md",
  "docs/front-overhaul/PHASE_REGISTRY.md",
];

const result = spawnSync(
  process.execPath,
  ["node_modules/prettier/bin/prettier.cjs", "--write", "--ignore-unknown", ...files],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);

for (const file of files) {
  const encoded = Buffer.from(readFileSync(file, "utf8"), "utf8").toString("base64");
  console.log(`PRETTIER_BASE64_BEGIN:${file}`);
  console.log(encoded);
  console.log(`PRETTIER_BASE64_END:${file}`);
}
