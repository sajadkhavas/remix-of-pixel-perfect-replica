import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { classifyInternalPath, scanLinkText } from "../../scripts/quality/link-integrity.mjs";

const routeCoverage = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "quality/route-coverage.json"), "utf8"),
);

describe("link integrity scanner", () => {
  test("accepts implemented internal destination", () => {
    const file = "tests/fixtures/link-integrity/pass/valid.tsx";
    expect(scanLinkText(file, readFileSync(file, "utf8"), routeCoverage)).toHaveLength(0);
    expect(classifyInternalPath("/shop", routeCoverage)).toBe("implemented");
  });

  test("detects placeholder, malformed route, and actionless button", () => {
    const file = "tests/fixtures/link-integrity/fail/invalid.tsx";
    const rules = scanLinkText(file, readFileSync(file, "utf8"), routeCoverage).map((item) => item.rule);
    expect(rules).toContain("placeholder-hash-link");
    expect(rules).toContain("invalid-watches-family");
    expect(rules).toContain("button-without-static-action");
  });

  test("distinguishes planned and unknown routes", () => {
    expect(classifyInternalPath("/checkout", routeCoverage)).toBe("planned");
    expect(classifyInternalPath("/not-in-route-map", routeCoverage)).toBe("unknown");
  });
});
