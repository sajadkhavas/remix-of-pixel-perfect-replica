import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { scanForbiddenText } from "../../scripts/quality/forbidden-copy.mjs";

describe("forbidden production copy scanner", () => {
  test("accepts evidence-aware production copy", () => {
    const file = "tests/fixtures/forbidden-copy/pass/clean.tsx";
    expect(scanForbiddenText(file, readFileSync(file, "utf8"))).toHaveLength(0);
  });

  test("detects controlled failing fixture", () => {
    const file = "tests/fixtures/forbidden-copy/fail/demo.tsx";
    const findings = scanForbiddenText(file, readFileSync(file, "utf8"));
    expect(findings.map((item) => item.rule)).toContain("demo-version");
    expect(findings.map((item) => item.rule)).toContain("no-real-order");
  });
});
