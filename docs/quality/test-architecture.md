# F14A Test Architecture

## Tool decision

- **Bun test remains the only unit and contract runner.** A second unit-test framework is not introduced.
- **Playwright is added only for real browser work**: route smoke, hydration/console safety, keyboard, accessibility, reduced motion, and later visual regression.
- **`@axe-core/playwright` supplies automated WCAG checks** inside the same browser runner.
- Scanners are dependency-light Node modules with pure exported scan/evaluation functions. Bun tests prove each scanner with a pass and fail fixture.
- No test depends on an external service, API, payment provider, analytics endpoint, or secret.

## Layers

| Layer | Runner | Location | Contract |
| --- | --- | --- | --- |
| Unit | Bun | `tests/*.test.ts`, `tests/quality/*.test.ts` | Pure functions, error document, scanner internals |
| Contract | Bun | `tests/commerce-persistence.test.ts` | F2 persistence and quantity contracts |
| Component | Playwright-ready | future owner tests | UI primitives after F3B integration; F14A does not rewrite them |
| Integration | Bun/Playwright | tests by feature owner | Repository adapters, local commerce, shell integration |
| Route smoke | Playwright | `tests/browser/route-smoke.spec.ts` | Only currently implemented routes |
| SSR/hydration | Playwright | route smoke + console/pageerror capture | Successful response, non-empty body, main/title, no critical error |
| Accessibility | Playwright + axe | `tests/browser/accessibility.spec.ts` | WCAG automation plus duplicate-ID and touch-target audits |
| Keyboard | Playwright | `tests/browser/keyboard.spec.ts` | Keyboard-only progression and menu activation |
| Reduced motion | Playwright | `tests/browser/reduced-motion.spec.ts` | No new long/infinite animation under `reduce` |
| End-to-end | Playwright | future commerce/account owners | Deterministic local fixtures only |
| Performance | Node + Vite build | `scripts/performance/*` | Emitted bundle/asset no-regression budgets |
| Visual regression | Playwright-ready | future approved snapshots | Added after F3B and page compositions stabilize |

## Browser projects

1. `desktop-chromium`: 1440 × 900, Persian locale, Tehran timezone.
2. `mobile-chromium`: 390 × 844, touch/mobile context.
3. `reduced-motion`: desktop Chromium with `prefers-reduced-motion: reduce`.
4. `keyboard-only`: focused keyboard suite on 1280 × 800.

CI installs only Chromium in F14A to keep cost deterministic. Firefox and WebKit/Safari approximation remain mandatory in the manual protocol and may become automated when runtime cost and stability are approved.

## Baseline governance

- Existing defects are exact entries keyed by route, browser project, rule, and selector.
- Every entry includes owner, reason, removal condition, and expiry.
- New defects fail immediately.
- Resolved defects are reported and removed by the owning phase.
- Empty, wildcard, route-wide, or rule-wide exceptions are prohibited.
- Capture mode (`UPDATE_QUALITY_BASELINES=1`) is a controlled one-time inventory tool, never used in release CI.

## Test data

- Route tests use current local fixture-backed pages only.
- Dynamic route samples are `/product/1` and `/shop/luxury`.
- The 39-route final architecture is tracked separately from the 13 prototype route patterns.
- Planned routes are not represented by fake passing tests.
