import { expect, test } from "@playwright/test";
import {
  compareOrUpdateDefects,
  ownerForRoute,
  type BrowserDefect,
} from "./helpers/quality-baseline";

const routes = ["/", "/shop", "/product/1"];
const expiry = "2026-10-01";

for (const route of routes) {
  test(`reduced motion: ${route}`, async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const running = await page.evaluate(() =>
      document.getAnimations({ subtree: true }).flatMap((animation, index) => {
        const timing = animation.effect?.getComputedTiming();
        const target =
          animation.effect && "target" in animation.effect
            ? (animation.effect.target as Element | null)
            : null;
        const iterations = Number(timing?.iterations ?? 1);
        const duration = Number(timing?.duration ?? 0);
        if (animation.playState !== "running" || (iterations !== Infinity && duration <= 1000)) {
          return [];
        }
        const selector = target
          ? `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ""}${
              target.classList.length ? `.${[...target.classList].slice(0, 3).join(".")}` : ""
            }`
          : `animation-${index}`;
        return [{ selector, duration, iterations }];
      }),
    );

    const defects: BrowserDefect[] = running.map((item) => ({
      route,
      project: testInfo.project.name,
      rule: "reduced-motion:running-long-animation",
      selector: item.selector,
      impact: "serious",
      owner: ownerForRoute(route),
      reason: `Animation remains active under reduced motion (duration=${item.duration}, iterations=${item.iterations}).`,
      removalCondition: "Provide a static or short non-spatial reduced-motion composition.",
      expiry,
    }));

    const { newDefects } = compareOrUpdateDefects(
      "quality/reduced-motion-baseline.json",
      defects,
      route,
      testInfo.project.name,
    );
    expect(newDefects, `New reduced-motion defects on ${route}`).toEqual([]);
  });
}
