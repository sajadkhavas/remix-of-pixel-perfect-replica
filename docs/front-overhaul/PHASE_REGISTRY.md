# Front 200 Phase Registry

## Project Baseline

- Repository: `sajadkhavas/remix-of-pixel-perfect-replica`
- Original main baseline: `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c`
- Integration branch: `integration/front-200`
- Gate 1 branch baseline: `b0d8e9ba1d0156d18ccb68258a9a650490931d89`
- Gate 2 measured code baseline: `f8e48e839a7ac43a5b7088254dde4441c4232c35`
- Registry owner: Supervisor chat / final integration owner
- Governing reviews:
  - `docs/front-overhaul/GATE_1_REVIEW.md`
  - `docs/front-overhaul/GATE_2_REVIEW.md`

## Phase Status

| Phase                                                 | Branch                              | Baseline                                   | Final phase SHA                            | Review                                     | Evidence / tests                                                                                      | Integration                                                                                            |
| ----------------------------------------------------- | ----------------------------------- | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| F0 — Production Foundation                            | `phase/f0-production-foundation`    | `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c` | `3d910a5501abd77470403bd667b947a709229102` | `APPROVED`                                 | Frozen install, format, lint, typecheck, tests, dev smoke, client/SSR build                           | Initial integration base                                                                               |
| F1 — Brand, Content and Keyword Architecture          | `phase/f1-brand-content-seo-map`    | Original main baseline                     | `b8c3920c8fdddaa3b1d3fa33214e27626c35d3c7` | `APPROVED_WITH_RECONCILIATION`             | Content audit, brand system, page copy, intent/keyword maps, 20 briefs                                | PR #12; `/shop` supersedes `/watches` planning references                                              |
| F2 — Information Architecture and Data Contracts      | `phase/f2-ia-taxonomy-contracts`    | Original main baseline                     | `0c7d711b1550c4613977f10095b7b6303d821ac3` | `APPROVED_AFTER_SUPERVISOR_HARDENING`      | Domain/search/commerce contracts, ADRs, strict persistence tests                                      | PR #13; hardened on integration                                                                        |
| F3A — Visual Direction and Asset Strategy             | `phase/f3a-visual-direction-assets` | Original main baseline                     | `247021a753efbfe0bda92438782f466dc7c2269c` | `APPROVED`                                 | Visual audit, art direction, responsive/motion rules, page briefs, asset manifest                     | PR #14                                                                                                 |
| F3B — Production Design System                        | `phase/f3b-design-system`           | Gate 1 branch baseline                     | `a7d5ac3f9f6a6ae97bc5f37388fe68e514107714` | `APPROVED_AFTER_INTEGRATION_VERIFICATION`  | Semantic tokens, shared primitives, RTL/reduced-motion foundations, six design-system tests           | PR #15 / merge `aa6522e47b0c67d11eb6b746de276bd936ed8831`; formatting and warning locations reconciled |
| F12 — Store Configuration and Integration Contract    | `phase/f12-store-config`            | Gate 1 branch baseline                     | `6d18f9c18a738345be61e687c3a5690a26332c00` | `APPROVED_AFTER_INTEGRATION_VERIFICATION`  | Strict public settings schemas, trust/secret boundaries, repositories, sixteen contract tests         | PR #16 / merge `bef820d48c13ef0fe219716db6b33e0cfb3af601`                                              |
| F13A — Technical SEO Infrastructure                   | `phase/f13a-seo-infrastructure`     | Gate 1 branch baseline                     | `8ed51895d7a765e156bd0a3420d56c2384dada40` | `APPROVED`                                 | URL/canonical policy, metadata, indexability, secure JSON-LD, sitemap/robots, twenty-six tests        | PR #17 / merge `a73a089a58b86aa5a93c2b49f5f4984a4824fc95`                                              |
| F14A — Quality, Accessibility and Performance Harness | `phase/f14a-quality-harness`        | Gate 1 branch baseline                     | `b1ecc60333f61ad32f9f5f782188e74fedf94c8a` | `APPROVED_AFTER_SUPERVISOR_RECONCILIATION` | Playwright/Axe, exact debt registries, scanners, budgets, nineteen unit/quality tests, browser matrix | PR #18 / merge `dbb4ba79ac3a2c9214361f1d4656da53640e153b`; combined scripts and CI upgraded            |

## Gate Decisions

| Decision                                         | Result                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Canonical catalog route family                   | `/shop` only                                                                    |
| `/watches`                                       | Forbidden as a second active route family                                       |
| Approved visual direction                        | Editorial Precision with Cinematic Chapters                                     |
| Shared UI source of truth                        | F3B semantic tokens and shared primitives                                       |
| Frontend domain source of truth                  | F2 contracts and repository boundaries                                          |
| Store identity, contact, trust and policy source | F12 validated public settings                                                   |
| Technical SEO source of truth                    | F13A builders, normalization and indexability policies                          |
| Missing store configuration                      | Hidden; no invented fallback claim or contact detail                            |
| Existing asset production status                 | Blocked until source, identity, license and responsive derivatives are verified |
| Commercial claims                                | Hidden unless F12 evidence/configuration permits them                           |
| Quality baselines                                | Exact temporary debt controls, not production-release waivers                   |
| Gate 2 CSS measurement                           | 119,738 bytes                                                                   |
| Gate 2 CSS hard limit                            | 122,500 bytes                                                                   |
| CSS future target                                | 100,000 bytes                                                                   |
| Direct work on `main`                            | Prohibited                                                                      |
| Manual editing of `src/routeTree.gen.ts`         | Prohibited                                                                      |

## Gate 2 Quality Snapshot

| Registry                  | Exact tracked debt |
| ------------------------- | -----------------: |
| Lint warnings             | 8                  |
| Forbidden production copy | 31                 |
| Link integrity            | 3                  |
| Asset violations          | 83                 |
| Route smoke               | 10                 |
| Accessibility             | 803                |
| Reduced motion            | 59                 |
| Keyboard                  | 1                  |
| **Total**                 | **998**            |

Gate 2 accepts the shared development foundation. It does not approve a production release. Critical accessibility, keyboard, temporary-asset, unsupported-copy, placeholder-link, motion and performance work remains assigned to the owning feature phases.

## Shared File Ownership

| Path                                                                      | Owner phase                   | Notes                                                                           |
| ------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `package.json`                                                            | F0 / F14A / integration owner | Dependency and quality-script changes require lockfile review and the full gate |
| `bun.lock`                                                                | Integration owner             | Update only with the declared Bun version and reviewed dependency intent        |
| `eslint.config.js`                                                        | F14A                          | Exceptions must remain narrow, exact and documented                             |
| `tsconfig*.json`                                                          | F0 / integration owner        | Repository-wide verification required                                           |
| `.github/workflows/*`                                                     | F14A / integration owner      | Gates may be strengthened but never silently weakened                           |
| `scripts/format-changed.mjs`                                              | F0                            | Shared changed-file formatting gate                                             |
| `src/styles.css`                                                          | F3B                           | Feature phases consume semantic tokens and do not invent global token systems   |
| `src/components/ui/ProductCard.tsx`                                       | F8                            | Explicitly excluded from F3B ownership                                          |
| `src/components/ui/*` excluding commerce-specific components              | F3B                           | Shared accessible primitives and variants                                       |
| `src/domain/*`                                                            | F2 / integration owner        | Feature phases consume contracts and request reviewed changes                   |
| `src/data/contracts/*`                                                    | F2 / F12                      | Avoid backend-specific URLs and duplicate interfaces                            |
| `src/config/*`, `src/domain/store-settings/*`, `src/lib/store-settings/*` | F12                           | Validated public configuration; no frontend secrets                             |
| `src/seo/*`                                                               | F13A                          | Metadata, canonical, robots, sitemap and structured-data builders               |
| `tests/*`, `playwright.config.ts`, `quality/*`, `scripts/quality/*`       | F14A                          | Exact debt governance and no-regression gates                                   |
| `src/routes/__root.tsx`                                                   | F4 later                      | F12/F13A provide integration inputs but do not take shell ownership             |
| `src/components/sections/HeroSection.tsx`                                 | F5 later                      | F3B supplies tokens/primitives, not the final Hero experience                   |
| `src/components/sections/CategoriesSection.tsx`                           | F5/F6 later                   | Final data/content migration remains                                            |
| `src/routeTree.gen.ts`                                                    | Router generator              | Never edit manually                                                             |
| `docs/front-overhaul/*`                                                   | Supervisor                    | Final phase status and gate decisions are supervisor-controlled                 |

## Integration History

| Date       | Phase / action                              | Commit or PR                                                                                  | Decision                                                    | Reviewer   |
| ---------- | ------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- |
| 2026-08-05 | F0                                          | `3d910a5501abd77470403bd667b947a709229102`                                                    | Approved; initial integration base                          | Supervisor |
| 2026-08-06 | F1                                          | PR #12 / merge `87ff54b7f6bcad4ae2f83dedb77e6a0fbb7e060a`                                     | Integrated with route reconciliation                        | Supervisor |
| 2026-08-06 | F2                                          | PR #13 / merge `d6c509f1ca65d032155c4e49c58e1d7886f3e2bb`                                     | Integrated and hardened                                     | Supervisor |
| 2026-08-06 | F3A                                         | PR #14 / merge `148ebca6dc52e3beb71abd8096f7d125fbb6e1ab`                                     | Integrated                                                  | Supervisor |
| 2026-08-06 | Gate 1 final quality                        | `b0d8e9ba1d0156d18ccb68258a9a650490931d89`                                                    | Frozen Wave 2 baseline                                      | Supervisor |
| 2026-08-06 | F3B                                         | PR #15 / merge `aa6522e47b0c67d11eb6b746de276bd936ed8831`                                     | Integrated; combined verification required                  | Supervisor |
| 2026-08-06 | F12                                         | PR #16 / merge `bef820d48c13ef0fe219716db6b33e0cfb3af601`                                     | Integrated; combined verification required                  | Supervisor |
| 2026-08-06 | F13A                                        | PR #17 / merge `a73a089a58b86aa5a93c2b49f5f4984a4824fc95`                                     | Integrated                                                  | Supervisor |
| 2026-08-06 | F14A                                        | PR #18 / merge `dbb4ba79ac3a2c9214361f1d4656da53640e153b`                                     | Integrated; harness reconciliation required                 | Supervisor |
| 2026-08-06 | Combined test coverage                      | `777582cceb50c56ae79dc46197d396990b3e378c`                                                    | Added F3B, F12 and F13A suites to the shared gate           | Supervisor |
| 2026-08-06 | Wave 2 formatting                           | `dc4bb9ecbe5deed590d251a33e460f893df6b221`                                                    | Normalized all integrated Wave 2 files                      | Supervisor |
| 2026-08-06 | Exact lint reconciliation                   | `95c3171f2d9e4dbeae4eebd0ded1e124900add72`                                                    | Preserved eight exact warnings with new locations           | Supervisor |
| 2026-08-06 | CI runtime upgrade / measured code baseline | `f8e48e839a7ac43a5b7088254dde4441c4232c35`                                                    | Upgraded action runtimes; combined tests and build verified | Supervisor |
| 2026-08-06 | Performance registration                    | `898873661abb3cda79b8563f1b65c741edf32422` through `fc9c52ac483ddf97b4882773bf3866b95eb5c5c0` | Registered measured CSS baseline and refreshed summaries    | Supervisor |
| 2026-08-06 | Gate 2 review                               | `739e9cccabf5b40368008d1eb125cdf3f34c0601`                                                    | Governing Wave 2 review recorded                            | Supervisor |
| 2026-08-06 | Gate 2 registry                             | Commit containing this record                                                                 | Four Wave 2 phases registered                               | Supervisor |

## Registry Rules

- A phase is complete only after supervisor review, integration and a green applicable quality run.
- No phase branch may merge itself.
- New wave branches start from the supervisor-declared final integration SHA, not from `main` or an individual phase branch.
- Shared-file conflicts are resolved only on the integration branch.
- Quality checks rerun after shared-file reconciliation.
- Feature phases may remove exact baseline debt but may not add new unregistered debt.
- A baseline entry requires an exact location, owner, reason, removal condition and expiry where applicable.
- Planning documents cannot silently override accepted route, domain, configuration, SEO or quality contracts.
- Unsupported claims and unverified assets remain blocked even when prototype code still renders them.
