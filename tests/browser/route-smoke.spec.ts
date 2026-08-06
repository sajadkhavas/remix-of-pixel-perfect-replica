import { expect, test } from "@playwright/test";
import routeCoverage from "../../quality/route-coverage.json";

const routes = routeCoverage.implemented.map((route) => route.samplePath);

for (const route of routes) {
  test(`route smoke: ${route}`, async ({ page }) => {
    const criticalConsoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") criticalConsoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => criticalConsoleErrors.push(error.message));

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response, `No navigation response for ${route}`).not.toBeNull();
    expect(response?.status(), `Unexpected response for ${route}`).toBeLessThan(400);
    await expect(page.locator("body")).not.toBeEmpty();
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page).toHaveTitle(/\S+/);

    const primaryLink = page.locator('main a[href]:not([href="#"]):visible').first();
    if ((await primaryLink.count()) > 0) {
      await primaryLink.click({ trial: true });
    }

    expect(
      criticalConsoleErrors,
      `Critical console or hydration errors on ${route}`,
    ).toEqual([]);
  });
}

test("unknown route renders a recoverable 404", async ({ page }) => {
  const response = await page.goto("/__quality_unknown_route__", { waitUntil: "networkidle" });
  expect(response).not.toBeNull();
  await expect(page.locator("body")).toContainText(/404|پیدا نشد/);
  await expect(page.getByRole("link", { name: /خانه|بازگشت/ }).first()).toBeVisible();
});
