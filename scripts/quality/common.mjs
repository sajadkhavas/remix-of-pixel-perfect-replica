import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const ROOT = process.cwd();
export const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

export function isCli(metaUrl) {
  return Boolean(process.argv[1]) && metaUrl === pathToFileURL(path.resolve(process.argv[1])).href;
}

export function readJson(relativePath) {
  return JSON.parse(readFileSync(path.resolve(ROOT, relativePath), "utf8"));
}

export function writeJson(relativePath, value) {
  writeFileSync(path.resolve(ROOT, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

export function walkFiles(directory, options = {}) {
  const root = path.resolve(ROOT, directory);
  if (!existsSync(root)) return [];
  const ignored = new Set(
    options.ignored ?? [
      ".git",
      "node_modules",
      "dist",
      ".output",
      ".vinxi",
      "coverage",
      "playwright-report",
      "test-results",
      "docs",
      "tests",
      "e2e",
      "quality",
    ],
  );
  const files = [];

  function visit(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(absolute);
        continue;
      }
      if (!entry.isFile()) continue;
      if (options.extensions && !options.extensions.has(path.extname(entry.name))) continue;
      files.push(path.relative(ROOT, absolute).replaceAll(path.sep, "/"));
    }
  }

  visit(root);
  return files.sort();
}

export function lineColumn(text, index) {
  const prefix = text.slice(0, index);
  const lines = prefix.split("\n");
  return { line: lines.length, column: lines.at(-1).length + 1 };
}

export function shortHash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function ownerForFile(file) {
  if (file === "src/routes/__root.tsx" || file.includes("components/layout/")) return "F4";
  if (
    file === "src/routes/index.tsx" ||
    /components\/sections\/(HeroSection|BrandsMarquee|FeaturedProducts|EditorialSection|ServicesSection)/.test(
      file,
    )
  ) {
    return "F5";
  }
  if (file.includes("components/sections/CategoriesSection")) return "F5/F6";
  if (file.includes("ProductCard") || file.includes("components/commerce/")) return "F8";
  if (file.includes("src/lib/catalog") || file.includes("/shop") || file.includes("/search")) {
    return "F6";
  }
  if (file.includes("routes/product") || file.includes("product/$")) return "F7";
  if (
    file.includes("routes/cart") ||
    file.includes("routes/wishlist") ||
    file.includes("routes/compare") ||
    file.includes("recently") ||
    file.includes("store-context")
  ) {
    return "F9";
  }
  if (file.includes("routes/auth") || file.includes("routes/account") || file.includes("checkout")) {
    return "F10";
  }
  if (
    file.includes("components/content/") ||
    /routes\/(about|contact|faq|services|authenticity|warranty|shipping-returns|payment-methods|privacy|terms|purchase-terms)/.test(
      file,
    )
  ) {
    return "F11";
  }
  if (file.includes("components/ui/")) return "F3B";
  if (file.includes("seo/")) return "F13A";
  if (file.includes("config/") || file.includes("store-settings")) return "F12";
  return "UNASSIGNED";
}

export function findingKey(finding) {
  return [finding.file, finding.line, finding.column, finding.rule, finding.excerptHash].join("::");
}

export function makeBaselineEntry(finding, defaults = {}) {
  return {
    ...finding,
    owner: finding.owner ?? defaults.owner ?? ownerForFile(finding.file),
    reason: finding.reason ?? defaults.reason ?? "Existing prototype debt discovered by F14A.",
    removalCondition:
      finding.removalCondition ??
      defaults.removalCondition ??
      "Owning phase replaces the placeholder or invalid implementation.",
    expiry: finding.expiry ?? defaults.expiry ?? "2026-10-01",
  };
}

export function enforceBaseline({ current, baselinePath, property, write = false, label }) {
  const baseline = readJson(baselinePath);
  const entries = baseline[property] ?? [];
  const normalized = current
    .map((item) => makeBaselineEntry(item))
    .sort((a, b) => findingKey(a).localeCompare(findingKey(b)));

  if (write) {
    baseline[property] = normalized;
    baseline.generatedAt = new Date().toISOString();
    writeJson(baselinePath, baseline);
    console.log(`${label}: wrote ${normalized.length} exact baseline entries.`);
    return { current: normalized, added: [], resolved: [] };
  }

  const allowed = new Map(entries.map((item) => [findingKey(item), item]));
  const present = new Map(normalized.map((item) => [findingKey(item), item]));
  const added = normalized.filter((item) => !allowed.has(findingKey(item)));
  const resolved = entries.filter((item) => !present.has(findingKey(item)));
  const expired = entries.filter((item) => item.expiry && Date.parse(item.expiry) < Date.now());

  if (resolved.length > 0) {
    console.log(
      `${label}: ${resolved.length} baseline entries are resolved; remove them in the next owner update.`,
    );
  }
  if (added.length > 0 || expired.length > 0) {
    if (added.length > 0) {
      console.error(`${label}: ${added.length} new finding(s):`);
      for (const item of added)
        console.error(`- ${item.file}:${item.line}:${item.column} ${item.rule}`);
    }
    if (expired.length > 0)
      console.error(`${label}: ${expired.length} baseline entry/entries expired.`);
    process.exitCode = 1;
  } else {
    console.log(`${label}: PASS (${normalized.length} current, ${resolved.length} resolved).`);
  }
  return { current: normalized, added, resolved, expired };
}

export function readSource(file) {
  return readFileSync(path.resolve(ROOT, file), "utf8");
}

export function fileBytes(file) {
  return statSync(path.resolve(ROOT, file)).size;
}
