import { expect, test } from "@playwright/test";

test("@keyboard focus advances through interactive controls", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const visited = new Set<string>();

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Tab");
    const signature = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body) return "body";
      return [
        active.tagName,
        active.getAttribute("href"),
        active.getAttribute("aria-label"),
        active.textContent?.trim().slice(0, 40),
      ].join("|");
    });
    visited.add(signature);
  }

  expect(visited.size).toBeGreaterThan(3);
  expect(visited.has("body")).toBe(false);
});

test("@keyboard mobile menu trigger has an accessible name", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "منو" });
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "بستن" })).toBeVisible();
});
