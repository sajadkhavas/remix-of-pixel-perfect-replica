import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { evaluateBudget } from "../../scripts/performance/check-budget.mjs";

for (const mode of ["pass", "fail"] as const) {
  test(`performance budget ${mode} fixture`, () => {
    const fixture = JSON.parse(readFileSync(`tests/fixtures/performance/${mode}.json`, "utf8"));
    const violations = evaluateBudget(fixture.metrics, { hardLimits: fixture.hardLimits });
    expect(violations.length === 0).toBe(mode === "pass");
  });
}

test("performance budget reports the exact exceeded metric", () => {
  const violations = evaluateBudget({ clientJsTotal: 101 }, { hardLimits: { clientJsTotal: 100 } });
  expect(violations[0].metric).toBe("clientJsTotal");
  expect(violations[0].value).toBe(101);
});
