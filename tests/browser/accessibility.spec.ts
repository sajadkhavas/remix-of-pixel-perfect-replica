import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import routeCoverage from "../../quality/route-coverage.json";
import {
  compareOrUpdateDefects,
  ownerForRoute,
  stableSelector,
  type BrowserDefect,
} from "./helpers/quality-baseline";

const routes = routeCoverage.implemented.map((route) => route.samplePath);
const expiry = "2026-10-01";

for (const route of routes) {
  test(`accessibility baseline: ${route}`, async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: "networkidle" });

    await expect(page).toHaveTitle(/\S+/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("main")).toHaveCount(1);

    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    const defects: BrowserDefect[] = axe.violations.flatMap((violation) =>
      violation.nodes.map((node) => ({
        route,
        project: testInfo.project.name,
        rule: `axe:${violation.id}`,
        selector: stableSelector(node.target),
        impact: violation.impact ?? "unknown",
        owner: ownerForRoute(route),
        reason: violation.help,
        removalCondition: violation.helpUrl,
        expiry,
      })),
    );

    const duplicateIds = await page.locator("[id]").evaluateAll((elements) => {
      const seen = new Set<string>();
      const duplicates = new Set<string>();
      for (const element of elements) {
        if (seen.has(element.id)) duplicates.add(element.id);
        seen.add(element.id);
      }
      return [...duplicates];
    });
    for (const id of duplicateIds) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "custom:duplicate-id",
        selector: `#${id}`,
        impact: "serious",
        owner: ownerForRoute(route),
        reason: "DOM IDs must be unique.",
        removalCondition: "Use one unique ID per document.",
        expiry,
      });
    }

    const smallTargets = await page
      .locator('a[href], button, input, select, textarea, [role="button"]')
      .evaluateAll((elements) =>
        elements.flatMap((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const visible =
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== "hidden" &&
            style.display !== "none";
          if (!visible || (rect.width >= 44 && rect.height >= 44)) return [];
          const label =
            element.getAttribute("aria-label") ||
            element.textContent?.trim() ||
            element.tagName.toLowerCase();
          return [`${element.tagName.toLowerCase()}[${label?.slice(0, 60) ?? "unlabelled"}]`];
        }),
      );
    for (const selector of [...new Set(smallTargets)]) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "custom:touch-target",
        selector,
        impact: "moderate",
        owner: ownerForRoute(route),
        reason: "Interactive target is smaller than 44 by 44 CSS pixels.",
        removalCondition: "Increase the interactive hit area without reducing visual clarity.",
        expiry,
      });
    }

    const { newDefects } = compareOrUpdateDefects(
      "quality/accessibility-baseline.json",
      defects,
      route,
      testInfo.project.name,
    );
    expect(newDefects, `New accessibility defects on ${route}`).toEqual([]);
  });
}
