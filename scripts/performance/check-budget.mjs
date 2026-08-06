import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { isCli, readJson, writeJson } from "../quality/common.mjs";

function recursiveFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? recursiveFiles(absolute) : [absolute];
  });
}

function sum(files) {
  return files.reduce((total, file) => total + statSync(file).size, 0);
}

export function collectBuildMetrics(root = process.cwd()) {
  const client = recursiveFiles(path.resolve(root, "dist/client"));
  const server = recursiveFiles(path.resolve(root, "dist/server"));
  if (client.length === 0 || server.length === 0) throw new Error("Production dist output is missing. Run `bun run build` before the budget gate.");
  const byExtension = (entries, extensions) => entries.filter((file) => extensions.includes(path.extname(file).toLowerCase()));
  const clientJs = byExtension(client, [".js", ".mjs"]);
  const css = byExtension(client, [".css"]);
  const images = byExtension(client, [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"]);
  const fonts = byExtension(client, [".woff", ".woff2", ".ttf", ".otf"]);
  const serverJs = byExtension(server, [".js", ".mjs"]);
  return {
    clientJsTotal: sum(clientJs),
    largestClientChunk: Math.max(0, ...clientJs.map((file) => statSync(file).size)),
    cssTotal: sum(css),
    serverJsTotal: sum(serverJs),
    imageBytes: sum(images),
    fontBytes: sum(fonts),
    jsChunkCount: clientJs.length,
    imageCount: images.length,
    largestImage: Math.max(0, ...images.map((file) => statSync(file).size)),
  };
}

export function evaluateBudget(metrics, budget) {
  const violations = [];
  for (const [metric, limit] of Object.entries(budget.hardLimits)) {
    const value = metrics[metric];
    if (typeof value !== "number") violations.push({ metric, value: null, limit, reason: "Metric is missing." });
    else if (value > limit) violations.push({ metric, value, limit, reason: `${metric} exceeds hard limit by ${value - limit} bytes/items.` });
  }
  return violations;
}

if (isCli(import.meta.url)) {
  const metrics = collectBuildMetrics();
  const budget = readJson("quality/performance-budget.json");
  const violations = evaluateBudget(metrics, budget);
  writeJson("quality/performance-current.json", {
    schemaVersion: 1,
    measuredAt: new Date().toISOString(),
    metrics,
    violations,
    fieldDataAvailable: false,
    lighthouseExecuted: false,
  });
  console.table(metrics);
  if (violations.length > 0) {
    for (const item of violations) console.error(`${item.metric}: ${item.value} > ${item.limit}`);
    process.exit(1);
  }
  console.log("Performance budget: PASS. No Lighthouse or field-CWV claim was produced.");
}
