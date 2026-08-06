import { expect, test } from "@playwright/test";
import {
  compareOrUpdateDefects,
  type BrowserDefect,
} from "./helpers/quality-baseline";

const expiry = "2026-10-01";

test("@keyboard focus progression and visibility", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const defects = new Map<string, BrowserDefect>();
  const visited = new Set<string>();

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body) {
        return { selector: "body", labelled: false, visibleIndicator: false };
      }
      const style = getComputedStyle(active);
      const selector = [
        active.tagName.toLowerCase(),
        active.id ? `#${active.id}` : "",
        active.getAttribute("href") ? `[href=\"${active.getAttribute("href")}\"]` : "",
        active.getAttribute("aria-label") ? `[aria-label=\"${active.getAttribute("aria-label")}\"]` : "",
      ].join("");
      const label =
        active.getAttribute("aria-label") ||
        active.getAttribute("title") ||
        active.textContent?.trim();
      const visibleIndicator =
        (style.outlineStyle !== "none" && style.outlineWidth !== "0px") ||
        style.boxShadow !== "none";
      return { selector, labelled: Boolean(label), visibleIndicator };
    });
    visited.add(state.selector);
    if (state.selector === "body") {
      defects.set("keyboard:focus-lost::body", {
        route: "/",
        project: testInfo.project.name,
        rule: "keyboard:focus-lost",
        selector: "body",
        impact: "serious",
        owner: "F3B/F4",
        reason: "Tab navigation returned focus to the document body.",
        removalCondition: "Maintain a logical focus sequence through interactive controls.",
        expiry,
      });
    }
    if (!state.labelled) {
      defects.set(`keyboard:unnamed-focus::${state.selector}`, {
        route: "/",
        project: testInfo.project.name,
        rule: "keyboard:unnamed-focus",
        selector: state.selector,
        impact: "serious",
        owner: "F3B/F4",
        reason: "Keyboard focus reached an unnamed interactive element.",
        removalCondition: "Provide an accessible name for every focusable control.",
        expiry,
      });
    }
    if (!state.visibleIndicator) {
      defects.set(`keyboard:missing-focus-indicator::${state.selector}`, {
        route: "/",
        project: testInfo.project.name,
        rule: "keyboard:missing-focus-indicator",
        selector: state.selector,
        impact: "serious",
        owner: "F3B",
        reason: "Focused control has no detectable outline or box-shadow indicator.",
        removalCondition: "Implement a visible focus-visible treatment with sufficient contrast and area.",
        expiry,
      });
    }
  }

  if (visited.size <= 3) {
    defects.set("keyboard:insufficient-progression::document", {
      route: "/",
      project: testInfo.project.name,
      rule: "keyboard:insufficient-progression",
      selector: "document",
      impact: "critical",
      owner: "F3B/F4",
      reason: `Only ${visited.size} unique focus targets were reached in twelve Tab presses.`,
      removalCondition: "Expose a logical, complete keyboard path through primary navigation and actions.",
      expiry,
    });
  }

  const { newDefects } = compareOrUpdateDefects(
    "quality/keyboard-baseline.json",
    [...defects.values()],
    "/",
    testInfo.project.name,
  );
  expect(newDefects).toEqual([]);
});

test("@keyboard mobile menu trigger has an accessible keyboard contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const trigger = page.getByRole("button", { name: "منو" });
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "بستن" })).toBeVisible();
});
