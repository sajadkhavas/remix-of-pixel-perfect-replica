import { readFileSync } from "node:fs";
import path from "node:path";
import {
  enforceBaseline,
  isCli,
  lineColumn,
  ownerForFile,
  readJson,
  shortHash,
  SOURCE_EXTENSIONS,
  walkFiles,
} from "./common.mjs";

function routeRegex(pattern) {
  const source = pattern
    .split("/")
    .map((segment) =>
      segment.startsWith("$") ? "[^/]+" : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("/");
  return new RegExp(`^${source}/?$`);
}

export function classifyInternalPath(value, registry) {
  if (!value.startsWith("/")) return "external-or-relative";
  if (registry.invalid.some((item) => routeRegex(item.pattern).test(value))) return "invalid";
  if (registry.implemented.some((item) => routeRegex(item.pattern).test(value)))
    return "implemented";
  if (
    registry.finalArchitecture.some((item) =>
      routeRegex(typeof item === "string" ? item : item.pattern).test(value),
    )
  )
    return "planned";
  return "unknown";
}

export function scanLinkText(file, text, registry) {
  const findings = [];
  const attribute =
    /\b(href|to)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\})/g;
  for (const match of text.matchAll(attribute)) {
    const value = match.slice(2).find((item) => item !== undefined) ?? "";
    const index = match.index ?? 0;
    const position = lineColumn(text, index);
    const excerpt = text.slice(
      Math.max(0, index - 25),
      Math.min(text.length, index + match[0].length + 25),
    );
    let rule = null;
    if (value === "#") rule = "placeholder-hash-link";
    else if (value.trim() === "") rule = "empty-link-target";
    else if (/^javascript:/i.test(value)) rule = "javascript-url";
    else if (value === "/watches" || value.startsWith("/watches/")) rule = "invalid-watches-family";
    else if (value.startsWith("/")) {
      const status = classifyInternalPath(value, registry);
      if (status === "unknown" || status === "invalid") rule = `internal-route-${status}`;
      if (status === "planned") rule = "planned-route-not-implemented";
    }
    if (!rule) continue;
    findings.push({
      file,
      ...position,
      rule,
      value,
      excerptHash: shortHash(excerpt),
      excerpt: excerpt.replace(/\s+/g, " ").trim().slice(0, 180),
      owner: ownerForFile(file),
      reason: "The target is empty, placeholder, invalid, unknown, or planned but not implemented.",
      removalCondition:
        "Owning phase supplies a valid implemented destination or removes the false affordance.",
      expiry: "2026-10-01",
    });
  }

  const blankExternal =
    /<a\b(?=[^>]*target\s*=\s*["']_blank["'])(?![^>]*rel\s*=\s*["'][^"']*(?:noopener|noreferrer))[^>]*>/g;
  for (const match of text.matchAll(blankExternal)) {
    const index = match.index ?? 0;
    const position = lineColumn(text, index);
    findings.push({
      file,
      ...position,
      rule: "external-blank-missing-rel",
      excerptHash: shortHash(match[0]),
      excerpt: match[0].replace(/\s+/g, " ").slice(0, 180),
      owner: ownerForFile(file),
      reason: "A new browsing context lacks noopener/noreferrer protection.",
      removalCondition: "Add an appropriate rel value or avoid target=_blank.",
      expiry: "2026-10-01",
    });
  }

  const button = /<button\b([^>]*)>/g;
  for (const match of text.matchAll(button)) {
    const attributes = match[1];
    if (/\bonClick\s*=|\btype\s*=\s*["']submit["']|\bform\s*=/.test(attributes)) continue;
    const index = match.index ?? 0;
    const position = lineColumn(text, index);
    findings.push({
      file,
      ...position,
      rule: "button-without-static-action",
      excerptHash: shortHash(match[0]),
      excerpt: match[0].replace(/\s+/g, " ").slice(0, 180),
      owner: ownerForFile(file),
      reason:
        "Static inspection found a button without an action, submit type, or form association.",
      removalCondition: "Add the real action/submit contract or use non-interactive markup.",
      expiry: "2026-10-01",
    });
  }
  return findings;
}

export function scanLinkRepository(
  directory = "src",
  registry = readJson("quality/route-coverage.json"),
) {
  return walkFiles(directory, { extensions: SOURCE_EXTENSIONS }).flatMap((file) =>
    scanLinkText(file, readFileSync(path.resolve(file), "utf8"), registry),
  );
}

if (isCli(import.meta.url)) {
  const write = process.argv.includes("--write-baseline");
  enforceBaseline({
    current: scanLinkRepository(),
    baselinePath: "quality/link-integrity-baseline.json",
    property: "findings",
    write,
    label: "Link integrity",
  });
}
