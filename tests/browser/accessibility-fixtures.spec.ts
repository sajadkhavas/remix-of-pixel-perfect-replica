import { readFileSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const mode of ["pass", "fail"] as const) {
  test(`axe harness ${mode} fixture`, async ({ page }) => {
    const html = readFileSync(
      path.resolve(process.cwd(), `tests/fixtures/accessibility/${mode}.html`),
      "utf8",
    );
    await page.setContent(html);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const rules = results.violations.map((violation) => violation.id);
    if (mode === "pass") {
      expect(results.violations).toEqual([]);
    } else {
      expect(rules).toContain("image-alt");
      expect(rules).toContain("button-name");
    }
  });
}
