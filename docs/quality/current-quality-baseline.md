# F14A Current Quality Baseline

**Repository:** `sajadkhavas/remix-of-pixel-perfect-replica`  
**Branch start:** `phase/f14a-quality-harness`  
**Baseline:** `integration/front-200@b0d8e9ba1d0156d18ccb68258a9a650490931d89`  
**Evidence run:** GitHub Actions `Frontend Quality` run `31072592630` on 2026-08-06  
**Policy:** current debt is recorded exactly; no wildcard ignore, blanket disable, `continue-on-error`, or `|| true` is accepted as a release gate.

## Executable baseline

| Area | Result at baseline | Measured evidence | Owner / next action |
| --- | --- | --- | --- |
| Install | PASS | Bun 1.2.22; `bun install --frozen-lockfile`; 550 packages | F14A retains deterministic install |
| Format | PASS | Prettier checked 110 changed files | F14A tooling |
| Lint | PASS WITH DEBT | 0 errors, 8 warnings | Exact warning registry; F3B/F8/F6 owners |
| Typecheck | PASS | `tsc --noEmit` | Shared gate |
| Unit/contract tests | PASS | 8 tests, 19 assertions, 0 failures | Existing F0/F2 coverage retained |
| Development SSR smoke | PASS | Vite server responded on `127.0.0.1:4174` | F14A replaces curl-only smoke with browser coverage |
| Hydration | UNMEASURED | No real browser hydration assertion existed | F14A browser harness |
| Production build | PASS WITH WARNINGS | Client and SSR bundles built | F14A budgets; code splitting belongs to owning feature/integration phases |
| Browser tests | MISSING | No Playwright configuration or browser project | F14A |
| Accessibility automation | MISSING | No axe/browser audit | F14A harness; feature defects assigned to owners |
| Manual QA protocol | MISSING | No signed viewport/browser/state matrix | F14A |

## Lint baseline

- Errors: **0**
- Warnings: **8**
- Tooling/config warnings owned by F14A: **0**
- Exact warning locations and owners are in `docs/quality/lint-warning-registry.md` and `quality/lint-warning-baseline.json`.
- New warnings are prohibited. Existing warnings are temporary debt and must not be converted into broad ESLint disables.

## Existing test baseline

- `tests/commerce-persistence.test.ts`: 7 passing contract tests.
- `tests/server-error-page.smoke.test.ts`: 1 passing server document smoke test.
- Total: **8 passing, 0 failing**.
- Missing layers: scanner fixtures, route browser smoke, accessibility, reduced motion, visual-regression readiness, and performance/asset gates.

## Route baseline

- Final route architecture: **39 planned routes**.
- Generated router currently exposes **13 implemented route patterns** including dynamic patterns.
- Future routes remain coverage-matrix entries only; no fake green route tests are permitted.
- Implemented patterns at baseline: `/`, `/about`, `/auth`, `/blog`, `/brands`, `/cart`, `/contact`, `/faq`, `/services`, `/shop`, `/wishlist`, `/product/$id`, `/shop/$category`.
- Canonical catalog family is `/shop`; `/watches` is invalid unless a later supervisor decision explicitly adds a historical redirect.

## Production build baseline

Values are uncompressed emitted sizes from the successful baseline build log.

| Metric | Baseline |
| --- | ---: |
| Client JavaScript total | 827.60 kB |
| Largest client JavaScript chunk | 576.55 kB (`index-*.js`) |
| Client CSS total | 97.86 kB |
| Client image bytes | 1,680.86 kB |
| Server JavaScript output | 178.91 kB |
| Client JavaScript chunks | 29 |
| Emitted raster images | 11 |
| Emitted font files | 0 observed |
| Oversized client chunks above 500 kB | 1 |
| Largest raster asset | 673.22 kB (`watch-sport-*.png`) |

Build warnings recorded:

1. One minified client chunk exceeds 500 kB.
2. Vite reports `vite-tsconfig-paths` is redundant with native `resolve.tsconfigPaths`; configuration ownership is outside this phase.
3. Lovable context is absent, so its optional Nitro deploy plugin is skipped; this is informational in the current environment.

No Lighthouse score, Core Web Vitals field data, or production RUM exists. F14A does not invent those values.

## Asset baseline

- Manifest entries: **11**.
- `productionApproved: true`: **0**.
- Source/license verified: **0**.
- All 11 entries are temporary development assets.
- Four product-image files are assigned to multiple product identities: `watch-1.jpg`, `watch-4.jpg`, `watch-5.jpg`, and `watch-6.jpg`.
- `watch-7.jpg` is reused across product, category, and editorial roles.
- Three PNG hero/category files need responsive derivatives and modern-format replacement.
- Release remains blocked until identity, source, license, responsive variants, and supervisor approval are complete.

## Known source-quality debt to measure

The executable scanners introduced by F14A must establish exact location-based baselines for:

- forbidden production/demo copy;
- unsupported statistics, reviews, contact placeholders, and trust claims;
- `href="#"`, empty targets, unknown internal paths, `/watches`, and CTA placeholders;
- accessibility defects by route and selector;
- reduced-motion violations;
- manifest/schema/identity/license violations;
- bundle and asset regressions.

The baseline files may contain only concrete findings with file/line/rule or route/selector/rule identifiers, owner phase, reason, removal condition, and expiry. Wildcards are forbidden.

## Ownership rules

- F14A fixes its tests, scripts, configs, budgets, and CI warnings immediately.
- F3B owns reusable UI primitive warnings and later visual/focus implementation.
- F8/content-editorial owners receive editorial component and production-copy defects.
- F4/F5/F6 owners receive navigation, discovery, product, commerce, and motion defects in their surfaces.
- F13A receives route metadata, canonical, robots, sitemap, and SEO-policy implementation defects.
- F12 receives store configuration and unsupported configurable claims.
- F14A does not rewrite feature/UI code to make the harness green.
