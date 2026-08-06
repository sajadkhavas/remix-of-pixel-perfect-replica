# Front 200 Phase Registry

## Project Baseline

- Repository: `sajadkhavas/remix-of-pixel-perfect-replica`
- Original main baseline: `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c`
- Integration branch: `integration/front-200`
- Gate 1 reviewed integration state before this registry update: `7d471e0b25bf94a2be7f77cc024220521b1107e1`
- Registry owner: Supervisor chat / final integration owner
- Governing review: `docs/front-overhaul/GATE_1_REVIEW.md`

## Phase Status

| Phase                                            | Branch                              | Baseline                                   | Final phase SHA                            | Review                                | Evidence / tests                                                                              | Integration                                                                |
| ------------------------------------------------ | ----------------------------------- | ------------------------------------------ | ------------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| F0 — Production Foundation                       | `phase/f0-production-foundation`    | `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c` | `3d910a5501abd77470403bd667b947a709229102` | `APPROVED`                            | CI passed install, formatting, lint, typecheck, tests, dev smoke, client/SSR build            | Used as initial integration base                                           |
| F1 — Brand, Content and Keyword Architecture     | `phase/f1-brand-content-seo-map`    | `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c` | `b8c3920c8fdddaa3b1d3fa33214e27626c35d3c7` | `APPROVED_WITH_RECONCILIATION`        | 67-item content audit, brand system, page copy, intent/keyword maps, 20 content briefs        | Merged through PR #12; `/shop` overrides planning references to `/watches` |
| F2 — Information Architecture and Data Contracts | `phase/f2-ia-taxonomy-contracts`    | `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c` | `0c7d711b1550c4613977f10095b7b6303d821ac3` | `APPROVED_AFTER_SUPERVISOR_HARDENING` | Domain/search/commerce contracts, URL policy, ADRs; integration adds strict persistence tests | Merged through PR #13; hardened on integration                             |
| F3A — Visual Direction and Asset Strategy        | `phase/f3a-visual-direction-assets` | `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c` | `247021a753efbfe0bda92438782f466dc7c2269c` | `APPROVED`                            | Visual audit, 3 art directions, responsive/motion rules, 18 page briefs, 11-asset manifest    | Merged through PR #14                                                      |
| F3B — Design System                              | `phase/f3b-design-system`           | Gate 1 final SHA                           | Pending                                    | `NOT_STARTED`                         | Pending                                                                                       | Not integrated                                                             |
| F12 — Store Configuration                        | `phase/f12-store-config`            | Gate 1 final SHA                           | Pending                                    | `NOT_STARTED`                         | Pending                                                                                       | Not integrated                                                             |
| F13A — SEO Infrastructure                        | `phase/f13a-seo-infrastructure`     | Gate 1 final SHA                           | Pending                                    | `NOT_STARTED`                         | Pending                                                                                       | Not integrated                                                             |
| F14A — Quality Harness                           | `phase/f14a-quality-harness`        | Gate 1 final SHA                           | Pending                                    | `NOT_STARTED`                         | Pending                                                                                       | Not integrated                                                             |

## Gate Decisions

| Decision                                 | Result                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| Canonical catalog route family           | `/shop`                                                  |
| Working references to `/watches` in F1   | Superseded; do not implement as a second route family    |
| Approved visual direction                | Editorial Precision with Cinematic Chapters              |
| Existing asset production status         | Blocked until source, identity, and license verification |
| Commercial claims                        | Hidden unless evidence/configuration marks them approved |
| Frontend data source of truth            | F2 domain contracts and repository boundaries            |
| Direct work on `main`                    | Prohibited                                               |
| Manual editing of `src/routeTree.gen.ts` | Prohibited                                               |

## Shared File Ownership

| Path                                                         | Owner phase                                                    | Notes                                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `package.json`                                               | F0 / integration owner; F14A for approved testing dependencies | Every dependency change requires lockfile and full quality run                       |
| `bun.lock`                                                   | Integration owner                                              | Update only with declared Bun version and reviewed dependency intent                 |
| `eslint.config.js`                                           | F0 / F14A                                                      | New exceptions must be narrow and documented; zero-warning target belongs to F14A    |
| `tsconfig*.json`                                             | F0 / integration owner                                         | Repository-wide verification required                                                |
| `.github/workflows/*`                                        | F0 / F14A                                                      | Quality gates may be extended but never weakened silently                            |
| `scripts/format-changed.mjs`                                 | F0                                                             | Shared changed-file formatting gate                                                  |
| `src/styles.css`                                             | F3B                                                            | Design tokens and global system; page phases do not invent global tokens             |
| `src/components/ui/ProductCard.tsx`                          | F8                                                             | Explicitly excluded from F3B ownership                                               |
| `src/components/ui/*` excluding commerce-specific components | F3B                                                            | Accessible reusable primitives and variants                                          |
| `src/domain/*`                                               | F2 contracts; integration owner for corrections                | Feature phases consume contracts and submit dependency requests for changes          |
| `src/data/contracts/*`                                       | F2 / F12 extensions                                            | Avoid backend-specific URLs and duplicate interfaces                                 |
| `src/config/*` and store-settings adapters                   | F12                                                            | No admin UI or backend implementation in F12                                         |
| `src/seo/*`                                                  | F13A                                                           | Metadata, canonical, robots, sitemap, and structured-data builders                   |
| `tests/*`, test configs, quality budgets                     | F14A after existing F0 tests                                   | Feature phases may add scoped tests beside their work                                |
| `src/routes/__root.tsx`                                      | F4 later                                                       | F3B/F12/F13A may submit integration hooks but must not take shell ownership          |
| `src/components/sections/HeroSection.tsx`                    | F0 for stability; F5 later for final experience                | F3B supplies primitives/tokens, not final Hero redesign                              |
| `src/components/sections/CategoriesSection.tsx`              | F5/F6 later                                                    | F0 parser fix accepted; final data/content migration remains                         |
| `src/routeTree.gen.ts`                                       | Router generator                                               | Never edit manually                                                                  |
| `docs/front-overhaul/*`                                      | Supervisor                                                     | Phase evidence may be linked; statuses and final decisions are supervisor-controlled |

## Integration History

| Date       | Phase / action         | Commit or PR                                              | Decision                                   | Reviewer   |
| ---------- | ---------------------- | --------------------------------------------------------- | ------------------------------------------ | ---------- |
| 2026-08-05 | F0                     | `3d910a5501abd77470403bd667b947a709229102`                | Approved; initial integration base         | Supervisor |
| 2026-08-06 | F1                     | PR #12 / merge `87ff54b7f6bcad4ae2f83dedb77e6a0fbb7e060a` | Integrated with route reconciliation       | Supervisor |
| 2026-08-06 | F2                     | PR #13 / merge `d6c509f1ca65d032155c4e49c58e1d7886f3e2bb` | Integrated; persistence hardening required | Supervisor |
| 2026-08-06 | F3A                    | PR #14 / merge `148ebca6dc52e3beb71abd8096f7d125fbb6e1ab` | Integrated                                 | Supervisor |
| 2026-08-06 | Gate 1 hardening       | `95ca7cd7d1f52f1327f5b4fa6848ef5091daf245`                | Strict commerce persistence validation     | Supervisor |
| 2026-08-06 | Gate 1 tests           | `e499ba8c97a071ac8f6805a79857347308392908`                | Persistence and quantity-rule coverage     | Supervisor |
| 2026-08-06 | Gate 1 decision record | `7d471e0b25bf94a2be7f77cc024220521b1107e1`                | Governing cross-phase decisions recorded   | Supervisor |

## Registry Rules

- A phase is complete only after supervisor review, evidence review, integration, and a green integration quality run.
- No phase branch may merge itself.
- Wave branches start from the supervisor-declared integration SHA, not from `main` or another phase branch.
- Shared-file conflicts are resolved on the integration branch.
- Quality checks rerun after every shared-file resolution.
- A planning document cannot silently override a later accepted route/domain contract.
- Unsupported claims and unverified assets remain blocked even when prototype code renders them.
