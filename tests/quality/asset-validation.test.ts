import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { validateManifest } from "../../scripts/quality/asset-validation.mjs";

describe("asset manifest validation", () => {
  test("accepts structurally approved metadata when file IO is not requested", () => {
    const manifest = JSON.parse(readFileSync("tests/fixtures/assets/pass/manifest.json", "utf8"));
    const violations = validateManifest(manifest, {
      manifestText: JSON.stringify(manifest, null, 2),
      root: "tests/fixtures/assets/pass/nonexistent-root",
    });
    expect(violations.map((item) => item.rule)).toContain("missing-file");
    expect(violations.map((item) => item.rule)).not.toContain("missing-source");
    expect(violations.map((item) => item.rule)).not.toContain("unverified-license");
  });

  test("detects invalid manifest fixture", () => {
    const manifest = JSON.parse(readFileSync("tests/fixtures/assets/fail/manifest.json", "utf8"));
    const rules = validateManifest(manifest, {
      manifestText: JSON.stringify(manifest, null, 2),
      root: "tests/fixtures/assets/fail",
      release: true,
    }).map((item) => item.rule);
    expect(rules).toContain("invalid-schema-version");
    expect(rules).toContain("missing-path");
    expect(rules).toContain("unverified-license");
    expect(rules).toContain("release-blocked-asset");
  });
});
