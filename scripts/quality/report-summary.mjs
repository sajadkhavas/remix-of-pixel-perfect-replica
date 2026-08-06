import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isCli, readJson } from "./common.mjs";

const registries = [
  ["lintWarnings", "quality/lint-warning-baseline.json", "warnings"],
  ["forbiddenCopy", "quality/forbidden-copy-baseline.json", "findings"],
  ["linkIntegrity", "quality/link-integrity-baseline.json", "findings"],
  ["assetViolations", "quality/asset-violation-baseline.json", "violations"],
  ["routeSmoke", "quality/route-smoke-baseline.json", "defects"],
  ["accessibility", "quality/accessibility-baseline.json", "defects"],
  ["reducedMotion", "quality/reduced-motion-baseline.json", "defects"],
  ["keyboard", "quality/keyboard-baseline.json", "defects"],
];

function sortedCounts(entries, field) {
  const counts = new Map();
  for (const entry of entries) {
    const key = String(entry[field] ?? "unassigned");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function buildQualitySummary() {
  const result = {
    schemaVersion: 1,
    baselineSha: "b0d8e9ba1d0156d18ccb68258a9a650490931d89",
    registries: {},
    totalTrackedDebt: 0,
    performance: readJson("quality/performance-current.json"),
  };

  for (const [name, file, property] of registries) {
    const document = readJson(file);
    const entries = document[property] ?? [];
    result.registries[name] = {
      count: entries.length,
      byOwner: sortedCounts(entries, "owner"),
      byRule: sortedCounts(entries, "rule"),
      byImpact: sortedCounts(entries, "impact"),
    };
    result.totalTrackedDebt += entries.length;
  }
  return result;
}

if (isCli(import.meta.url)) {
  const outputPath = path.resolve("quality/quality-summary.json");
  const rendered = `${JSON.stringify(buildQualitySummary(), null, 2)}\n`;
  if (process.argv.includes("--write")) {
    writeFileSync(outputPath, rendered);
    console.log("Quality summary refreshed.");
  } else {
    if (!existsSync(outputPath)) {
      console.error("quality/quality-summary.json is missing. Run with --write.");
      process.exit(1);
    }
    const current = readFileSync(outputPath, "utf8");
    if (current !== rendered) {
      console.error("quality/quality-summary.json is stale. Refresh it with --write.");
      process.exit(1);
    }
    console.log("Quality summary: PASS (registry counts are current). ");
  }
}
