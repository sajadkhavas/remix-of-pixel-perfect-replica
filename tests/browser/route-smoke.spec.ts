import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import {
  compareOrUpdateDefects,
  excerptHash,
  ownerForRoute,
  type BrowserDefect,
} from "./helpers/quality-baseline";

const routeCoverage = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "quality/route-coverage.json"), "utf8"),
) as { implemented: Array<{ samplePath: string }> };
const routes = routeCoverage.implemented.map((route) => route.samplePath);
const expiry = "2026-10-01";

for (const route of routes) {
  test(`route smoke: ${route}`, async ({ page }, testInfo) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    const defects: BrowserDefect[] = [];
    const owner = ownerForRoute(route);

    if (!response || response.status() >= 400) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "route:unsuccessful-response",
        selector: "document",
        impact: "critical",
        owner,
        reason: `Expected a successful route response; received ${response?.status() ?? "no response"}.`,
        removalCondition: "Route must return a successful document response.",
        expiry,
      });
    }
    const title = await page.title();
    if (!title.trim()) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "route:missing-title",
        selector: "head > title",
        impact: "serious",
        owner: "F13A",
        reason: "Rendered route has no document title.",
        removalCondition: "Provide route-specific metadata and a non-empty title.",
        expiry,
      });
    }
    if (
      (await page.locator("body").count()) !== 1 ||
      !(await page.locator("body").innerText()).trim()
    ) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "route:empty-body",
        selector: "body",
        impact: "critical",
        owner,
        reason: "Rendered document body is missing or empty.",
        removalCondition: "Route must render recoverable user-visible content.",
        expiry,
      });
    }
    if ((await page.locator("main").count()) !== 1) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "route:main-landmark-count",
        selector: "main",
        impact: "serious",
        owner: "F3B",
        reason: "Each route must expose exactly one main landmark.",
        removalCondition: "Render one and only one main landmark in the application shell.",
        expiry,
      });
    }
    for (const message of [...new Set(consoleErrors)]) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "route:critical-console-error",
        selector: `console:${excerptHash(message)}`,
        impact: "critical",
        owner,
        reason: message.slice(0, 500),
        removalCondition: "Remove the runtime, SSR, hydration, or browser console error.",
        expiry,
      });
    }

    const primaryLink = page.locator('main a[href]:not([href="#"]):visible').first();
    if ((await primaryLink.count()) === 0) {
      defects.push({
        route,
        project: testInfo.project.name,
        rule: "route:no-primary-link",
        selector: "main",
        impact: "moderate",
        owner,
        reason: "No non-placeholder link is available in the main route content.",
        removalCondition:
          "Provide a valid primary or recovery navigation link when the route requires one.",
        expiry,
      });
    } else {
      await primaryLink.click({ trial: true });
    }

    const { newDefects } = compareOrUpdateDefects(
      "quality/route-smoke-baseline.json",
      defects,
      route,
      testInfo.project.name,
    );
    expect(newDefects, `New route defects on ${route}`).toEqual([]);
  });
}

test("unknown route renders a recoverable 404", async ({ page }) => {
  const response = await page.goto("/__quality_unknown_route__", { waitUntil: "domcontentloaded" });
  expect(response).not.toBeNull();
  await expect(page.locator("body")).toContainText(/404|پیدا نشد/);
  await expect(page.getByRole("link", { name: /خانه|بازگشت/ }).first()).toBeVisible();
});
