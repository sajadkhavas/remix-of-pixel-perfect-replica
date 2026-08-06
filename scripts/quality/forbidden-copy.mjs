import { readFileSync } from "node:fs";
import path from "node:path";
import {
  enforceBaseline,
  isCli,
  lineColumn,
  ownerForFile,
  shortHash,
  SOURCE_EXTENSIONS,
  walkFiles,
} from "./common.mjs";

const literalRules = [
  ["demo-version", /نسخه\s*نمایشی/g],
  ["demo-copy", /(^|[^\p{L}])دمو([^\p{L}]|$)/gu],
  ["experimental-copy", /آزمایشی/g],
  ["temporarily-disabled", /فعلاً\s+غیرفعال/g],
  ["future-feature", /در\s+آینده\s+اضافه\s+می[‌-]?شود/g],
  ["no-real-order", /هیچ\s+سفارش\s+واقعی/g],
  ["no-real-payment", /هیچ\s+پرداخت\s+واقعی/g],
  ["generic-placeholder", /\b(?:lorem ipsum|todo|tbd)\b/gi],
  ["placeholder-phone", /(?:۰۲۱|021)[-\s]?۰{7,8}|021[-\s]?0{7,8}/g],
  ["placeholder-email", /hello@kronos\.shop/gi],
  ["placeholder-address", /تهران،?\s*خیابان\s*ولیعصر/g],
  ["unsupported-authenticity-claim", /ضمانت\s+اصالت/g],
  ["unsupported-free-shipping", /ارسال\s+رایگان/g],
  ["hardcoded-review-count", /review_count\s*:\s*\d+/g],
  ["hardcoded-satisfaction-stat", /(?:value\s*:\s*(?:99|1200)|درصد\s+رضایت)/g],
];

export function scanForbiddenText(file, text) {
  const findings = [];
  for (const [rule, expression] of literalRules) {
    expression.lastIndex = 0;
    for (const match of text.matchAll(expression)) {
      const index = match.index ?? 0;
      const position = lineColumn(text, index);
      const excerpt = text.slice(Math.max(0, index - 30), Math.min(text.length, index + match[0].length + 30));
      findings.push({
        file,
        ...position,
        rule,
        excerptHash: shortHash(excerpt),
        excerpt: excerpt.replace(/\s+/g, " ").trim().slice(0, 180),
        owner: ownerForFile(file),
        reason: "Prototype/demo, placeholder, or unsupported production copy is present in rendered source.",
        removalCondition: "Owning phase replaces the copy with evidence-backed, configured production content.",
        expiry: "2026-10-01",
      });
    }
  }
  return findings;
}

export function scanForbiddenRepository(directory = "src") {
  return walkFiles(directory, { extensions: SOURCE_EXTENSIONS }).flatMap((file) =>
    scanForbiddenText(file, readFileSync(path.resolve(file), "utf8")),
  );
}

if (isCli(import.meta.url)) {
  const write = process.argv.includes("--write-baseline");
  enforceBaseline({
    current: scanForbiddenRepository(),
    baselinePath: "quality/forbidden-copy-baseline.json",
    property: "findings",
    write,
    label: "Forbidden production copy",
  });
}
