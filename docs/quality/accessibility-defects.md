# F14A Accessibility Defect Registry

## Authority

The machine-readable sources are:

- `quality/accessibility-baseline.json` for axe, duplicate-ID, and touch-target findings;
- `quality/keyboard-baseline.json` for keyboard order, naming, focus visibility, and mobile-menu activation;
- `quality/reduced-motion-baseline.json` for long or infinite motion under `prefers-reduced-motion: reduce`;
- `quality/route-smoke-baseline.json` for route response, title, landmark, console/hydration, and recovery-link defects.

Every accepted temporary entry is exact and includes route, browser project, rule, selector, impact, owner, reason, removal condition, and expiry. There is no route-wide, selector-wide, or rule-wide wildcard.

## Automated coverage

- non-empty document title;
- `lang="fa"` and `dir="rtl"`;
- one `main` landmark;
- WCAG 2 A/AA, 2.1 AA, and 2.2 AA rules available to axe;
- accessible names for buttons and links;
- form labels and image alternatives;
- dialog semantics exposed to axe;
- duplicate IDs;
- static touch-target audit at 44 × 44 CSS pixels;
- keyboard focus progression and accessible naming;
- detectable outline or box-shadow focus indicator;
- mobile-menu activation by keyboard;
- reduced-motion long/infinite animation inventory;
- route console/page errors and recovery behavior.

Controlled pass/fail fixtures prove that axe detects missing image alternatives and unnamed buttons. The scanner fixture suite separately proves invalid links, forbidden copy, invalid manifests, oversized assets, and exceeded budgets.

## Current defect themes

1. **Contrast and muted text:** axe records route/selector-specific color-contrast findings. Visual correction belongs to F3B or the owning page phase.
2. **Touch targets:** multiple navigation, icon, chip, and commerce actions are below the 44 × 44 audit threshold. Owners are assigned by route.
3. **Focus visibility:** keyboard navigation reaches controls without a consistently detectable focus treatment. F3B owns the shared focus system.
4. **Mobile navigation activation:** activating the visible mobile menu trigger with Enter does not expose the menu/close control in the captured prototype. F4 owns the navigation behavior.
5. **Reduced motion:** homepage, shop, and product routes retain long or infinite animations under reduced motion. F8, F4, and F5 own the affected compositions.
6. **SSR/runtime recovery:** browser runs expose a homepage server-rendering error involving an invalid element type in the editorial composition. F8 owns the editorial implementation; F14A records it and does not edit the feature.

## Severity and release policy

- A baseline entry is a known defect, not a pass or an accessibility approval.
- New defects fail CI immediately.
- Expired entries fail CI.
- Resolved entries are reported and must be removed by the owning phase.
- Critical accessibility issues must equal zero before release.
- Automated checks do not replace screen-reader, zoom, forced-colors, touch, and manual keyboard review.

## Owner handoff

| Area | Primary owner |
| --- | --- |
| Shared focus, contrast, primitives | F3B |
| Header, navigation, search, shop interaction | F4 |
| Hero/product gallery/product commerce | F5 |
| Cart, wishlist, checkout commerce | F6 |
| Account/authentication | F7 |
| Homepage/editorial/content surfaces | F8 |
| Static content and legal pages | F9 |
| Metadata and route SEO | F13A |

All temporary entries expire on or before 2026-10-01 unless the supervisor approves a new exact expiry with evidence.
