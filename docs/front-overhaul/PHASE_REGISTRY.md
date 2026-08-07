# Front 200 Phase Registry

## Project Baseline

- Repository: `sajadkhavas/remix-of-pixel-perfect-replica`
- Original main baseline: `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c`
- Integration branch: `integration/front-200`
- Gate 1 branch baseline: `b0d8e9ba1d0156d18ccb68258a9a650490931d89`
- Gate 2 measured code baseline: `f8e48e839a7ac43a5b7088254dde4441c4232c35`
- Gate 3 original integrated code baseline: `350acdb3af171561d16241a0aafb420b29204034`
- Gate 3 hardened code baseline: `7c19320b9c7fdc6189362ce2e051c34a64e7ac9c`
- Gate 3 hardening review record: `93c186d5172ca6e89609d1e6bb75b7130b70b082`
- Registry owner: Supervisor chat / final integration owner
- Governing reviews:
  - `docs/front-overhaul/GATE_1_REVIEW.md`
  - `docs/front-overhaul/GATE_2_REVIEW.md`
  - `docs/front-overhaul/GATE_3_REVIEW.md`

## Phase Status

| Phase | Branch | Baseline | Final phase SHA | Review | Evidence / tests | Integration |
| --- | --- | --- | --- | --- | --- | --- |
| F0 — Production Foundation | `phase/f0-production-foundation` | `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c` | `3d910a5501abd77470403bd667b947a709229102` | `APPROVED` | Frozen install, format, lint, typecheck, tests, dev smoke, client/SSR build | Initial integration base |
| F1 — Brand, Content and Keyword Architecture | `phase/f1-brand-content-seo-map` | Original main baseline | `b8c3920c8fdddaa3b1d3fa33214e27626c35d3c7` | `APPROVED_WITH_RECONCILIATION` | Content audit, brand system, page copy, intent/keyword maps, 20 briefs | PR #12; `/shop` supersedes `/watches` planning references |
| F2 — Information Architecture and Data Contracts | `phase/f2-ia-taxonomy-contracts` + supervisor hardening | Original main baseline | `0c7d711b1550c4613977f10095b7b6303d821ac3` + `7ffa86422332a2882e5617622dfcdfb895029ded` | `APPROVED_AFTER_SUPERVISOR_HARDENING` | Domain/search/commerce contracts, ADRs, strict persistence tests; ISO timestamp boundary validation; inventory tracking/status consistency | PR #13; integration hardening; PR #24 / merge `7c19320b9c7fdc6189362ce2e051c34a64e7ac9c` |
| F3A — Visual Direction and Asset Strategy | `phase/f3a-visual-direction-assets` | Original main baseline | `247021a753efbfe0bda92438782f466dc7c2269c` | `APPROVED` | Visual audit, art direction, responsive/motion rules, page briefs, asset manifest | PR #14 |
| F3B — Production Design System | `phase/f3b-design-system` | Gate 1 branch baseline | `a7d5ac3f9f6a6ae97bc5f37388fe68e514107714` | `APPROVED_AFTER_INTEGRATION_VERIFICATION` | Semantic tokens, shared primitives, RTL/reduced-motion foundations, six design-system tests | PR #15 / merge `aa6522e47b0c67d11eb6b746de276bd936ed8831`; formatting and warning locations reconciled |
| F12 — Store Configuration and Integration Contract | `phase/f12-store-config` | Gate 1 branch baseline | `6d18f9c18a738345be61e687c3a5690a26332c00` | `APPROVED_AFTER_INTEGRATION_VERIFICATION` | Strict public settings schemas, trust/secret boundaries, repositories, sixteen contract tests | PR #16 / merge `bef820d48c13ef0fe219716db6b33e0cfb3af601` |
| F13A — Technical SEO Infrastructure | `phase/f13a-seo-infrastructure` | Gate 1 branch baseline | `8ed51895d7a765e156bd0a3420d56c2384dada40` | `APPROVED` | URL/canonical policy, metadata, indexability, secure JSON-LD, sitemap/robots, twenty-six tests | PR #17 / merge `a73a089a58b86aa5a93c2b49f5f4984a4824fc95` |
| F14A — Quality, Accessibility and Performance Harness | `phase/f14a-quality-harness` | Gate 1 branch baseline | `b1ecc60333f61ad32f9f5f782188e74fedf94c8a` | `APPROVED_AFTER_SUPERVISOR_RECONCILIATION` | Playwright/Axe, exact debt registries, scanners, budgets, nineteen unit/quality tests, browser matrix | PR #18 / merge `dbb4ba79ac3a2c9214361f1d4656da53640e153b`; combined scripts and CI upgraded |
| F4 — Global Shell and Navigation | `phase/f4-global-shell-navigation` | Gate 2 accepted baseline | `57b2ebd70a6c21816219cd69ed1e2c0095e0289f` | `APPROVED_AFTER_SUPERVISOR_RECONSTRUCTION` | Format/lint/type/unit/contract/scanner/build evidence; fail-closed F12 settings, reduced-motion shell, keyboard-usable mobile dialog | PR #19 / merge `93732aafe8e71772eaf29f61ea6e64d9fde2ff43` |
| F8 — Shared Commerce Components | `phase/f8-shared-commerce-components` + `phase/gate3-hardening` | Gate 2 accepted baseline; cleanly rebased after F4 | `553306f8dfccddcb596e51dedf8c77f84558cd59` + `7ffa86422332a2882e5617622dfcdfb895029ded` | `APPROVED_AFTER_SUPERVISOR_HARDENING` | Original format/lint/type/unit/contract/scanner/build/performance evidence; normalized Product adapter now consumes F2 pricing/inventory/variant rules; added regression coverage | PR #20 / merge `62202ee71cdaabcd8e695b16e30523d95093fa3c`; PR #24 / merge `7c19320b9c7fdc6189362ce2e051c34a64e7ac9c` |
| F11 — Content, Trust and Legal | `phase/f11-content-trust-legal` | Integrated F4 baseline | `07f95647bae4df43dc62938ff83df41acf117717` | `APPROVED_AFTER_SUPERVISOR_COMPLETION` | Successful route-generation/build workflow; evidence-aware/noindex trust/legal pages; no fake contact success | PR #21 / merge `350acdb3af171561d16241a0aafb420b29204034` |

## Gate Decisions

| Decision | Result |
| --- | --- |
| Canonical catalog route family | `/shop` only |
| `/watches` | Forbidden as a second active route family |
| Approved visual direction | Editorial Precision with Cinematic Chapters |
| Shared UI source of truth | F3B semantic tokens and shared primitives |
| Frontend domain source of truth | F2 contracts and repository boundaries |
| Store identity, contact, trust and policy source | F12 validated public settings |
| Technical SEO source of truth | F13A builders, normalization and indexability policies |
| Missing store configuration | Hidden or neutral; no invented fallback claim, contact detail, policy or payment method |
| Existing asset production status | Blocked until source, identity, license and responsive derivatives are verified |
| Commercial claims | Hidden unless F12 evidence/configuration permits them |
| Global shell commercial data | Must come from public settings; hardcoded trust/contact/payment claims are forbidden |
| Shared ProductCard domain direction | View-model/F2 Product adapter; legacy `Watch` is compatibility-only |
| ProductCard purchase truth | F2 Product status, Variant identity/status, valid pricing, inventory consistency and purchasability |
| Inventory state consistency | `not-tracked` tracking pairs only with `not-tracked` status; contradictory states fail closed |
| Persisted commerce dates | Storage boundaries require valid ISO date-time values; non-empty arbitrary strings are rejected |
| Ratings/reviews | Hidden unless explicitly enabled by backed data/evidence |
| Legal content | No invented contractual language; unapproved content remains neutral and noindex |
| Contact form success | Forbidden without an actually configured backend acceptance path |
| Quality baselines | Exact temporary debt controls, not production-release waivers |
| Gate 2 CSS measurement | 119,738 bytes |
| Gate 2 CSS hard limit | 122,500 bytes |
| CSS future target | 100,000 bytes |
| GitHub Actions current blocker | External account Billing/Spending condition; not a repository test result |
| Production release while CI is blocked | Forbidden; full shared gate must execute green after Billing/Spending is resolved |
| Direct work on `main` | Prohibited |
| Manual editing of `src/routeTree.gen.ts` | Prohibited; generator only |

## Gate 2 Quality Snapshot

| Registry | Exact tracked debt |
| --- | ---: |
| Lint warnings | 8 |
| Forbidden production copy | 31 |
| Link integrity | 3 |
| Asset violations | 83 |
| Route smoke | 10 |
| Accessibility | 803 |
| Reduced motion | 59 |
| Keyboard | 1 |
| **Total** | **998** |

Gate 2 accepted the shared development foundation. Gate 3 removes known fake shell payment/trust surfaces and prototype content behavior, but the exact F14A debt registries remain release blockers until a later full quality snapshot refreshes them. The Gate 2 count is retained as historical measured debt and is not claimed to be the exact post-F4/F8/F11 count while Actions execution is externally blocked.

## Gate 3 CI Infrastructure Record

Original integrated code SHA `350acdb3af171561d16241a0aafb420b29204034` triggered Frontend Quality run `31185981046`. Two attempts produced `runner_id: 0`, an empty `runner_name`, and no executable steps; browser jobs were skipped.

During supervisor hardening, PR #24 run `31189461929` reproduced the same zero-step failure. A diagnostic runner-label experiment used `ubuntu-22.04`; run `31189623381` failed identically before any executable step. The GitHub check annotation then identified the exact cause: the job was not started because recent account payments had failed or the account spending limit needed to be increased.

The diagnostic workflow change was reverted and the repository remains pinned to the original `ubuntu-24.04` runner configuration. No quality gate was disabled, weakened or marked successful. The earlier generic runner/service classification is superseded by the exact account Billing/Spending diagnosis.

Gate 3 is a hardened next-wave development baseline, not a production-release approval. The full shared quality gate must execute and pass after the account Billing/Spending blocker is resolved.

## Shared File Ownership

| Path | Owner phase | Notes |
| --- | --- | --- |
| `package.json` | F0 / F14A / integration owner | Dependency and quality-script changes require lockfile review and the full gate |
| `bun.lock` | Integration owner | Update only with the declared Bun version and reviewed dependency intent |
| `eslint.config.js` | F14A | Exceptions must remain narrow, exact and documented |
| `tsconfig*.json` | F0 / integration owner | Repository-wide verification required |
| `.github/workflows/*` | F14A / integration owner | Gates may be strengthened but never silently weakened |
| `scripts/format-changed.mjs` | F0 | Shared changed-file formatting gate |
| `src/styles.css` | F3B | Feature phases consume semantic tokens and do not invent global token systems |
| `src/components/ui/ProductCard.tsx`, `src/components/commerce/*` | F8 | Shared commerce presentation; migrate legacy route data through adapters |
| `src/components/ui/*` excluding commerce-specific components | F3B | Shared accessible primitives and variants |
| `src/domain/*` | F2 / integration owner | Feature phases consume contracts and request reviewed changes |
| `src/data/contracts/*` | F2 / F12 | Avoid backend-specific URLs and duplicate interfaces |
| `src/config/*`, `src/domain/store-settings/*`, `src/lib/store-settings/*` | F12 | Validated public configuration; no frontend secrets |
| `src/seo/*` | F13A | Metadata, canonical, robots, sitemap and structured-data builders |
| `tests/*`, `playwright.config.ts`, `quality/*`, `scripts/quality/*` | F14A | Exact debt governance and no-regression gates |
| `src/routes/__root.tsx`, `src/components/layout/*` | F4 | Global shell, responsive navigation and public-settings presentation |
| `src/routes/about.tsx`, `contact.tsx`, `faq.tsx`, `services.tsx`, trust/legal routes, `src/components/content/*` | F11 | Truth-safe content/trust/legal presentation |
| `src/components/sections/HeroSection.tsx` | F5 later | F3B supplies tokens/primitives, not the final Hero experience |
| `src/components/sections/CategoriesSection.tsx` | F5/F6 later | Final data/content migration remains |
| `src/routeTree.gen.ts` | Router generator | Never edit manually |
| `docs/front-overhaul/*` | Supervisor | Final phase status and gate decisions are supervisor-controlled |

## Integration History

| Date | Phase / action | Commit or PR | Decision | Reviewer |
| --- | --- | --- | --- | --- |
| 2026-08-05 | F0 | `3d910a5501abd77470403bd667b947a709229102` | Approved; initial integration base | Supervisor |
| 2026-08-06 | F1 | PR #12 / merge `87ff54b7f6bcad4ae2f83dedb77e6a0fbb7e060a` | Integrated with route reconciliation | Supervisor |
| 2026-08-06 | F2 | PR #13 / merge `d6c509f1ca65d032155c4e49c58e1d7886f3e2bb` | Integrated and hardened | Supervisor |
| 2026-08-06 | F3A | PR #14 / merge `148ebca6dc52e3beb71abd8096f7d125fbb6e1ab` | Integrated | Supervisor |
| 2026-08-06 | Gate 1 final quality | `b0d8e9ba1d0156d18ccb68258a9a650490931d89` | Frozen Wave 2 baseline | Supervisor |
| 2026-08-06 | F3B | PR #15 / merge `aa6522e47b0c67d11eb6b746de276bd936ed8831` | Integrated; combined verification required | Supervisor |
| 2026-08-06 | F12 | PR #16 / merge `bef820d48c13ef0fe219716db6b33e0cfb3af601` | Integrated; combined verification required | Supervisor |
| 2026-08-06 | F13A | PR #17 / merge `a73a089a58b86aa5a93c2b49f5f4984a4824fc95` | Integrated | Supervisor |
| 2026-08-06 | F14A | PR #18 / merge `dbb4ba79ac3a2c9214361f1d4656da53640e153b` | Integrated; harness reconciliation required | Supervisor |
| 2026-08-06 | Combined test coverage | `777582cceb50c56ae79dc46197d396990b3e378c` | Added F3B, F12 and F13A suites to the shared gate | Supervisor |
| 2026-08-06 | Wave 2 formatting | `dc4bb9ecbe5deed590d251a33e460f893df6b221` | Normalized all integrated Wave 2 files | Supervisor |
| 2026-08-06 | Exact lint reconciliation | `95c3171f2d9e4dbeae4eebd0ded1e124900add72` | Preserved eight exact warnings with new locations | Supervisor |
| 2026-08-06 | CI runtime upgrade / measured code baseline | `f8e48e839a7ac43a5b7088254dde4441c4232c35` | Upgraded action runtimes; combined tests and build verified | Supervisor |
| 2026-08-06 | Performance registration | `898873661abb3cda79b8563f1b65c741edf32422` through `fc9c52ac483ddf97b4882773bf3866b95eb5c5c0` | Registered measured CSS baseline and refreshed summaries | Supervisor |
| 2026-08-06 | Gate 2 review | `739e9cccabf5b40368008d1eb125cdf3f34c0601` | Governing Wave 2 review recorded | Supervisor |
| 2026-08-07 | F4 | PR #19 / merge `93732aafe8e71772eaf29f61ea6e64d9fde2ff43` | Reconstructed, hardened and integrated | Supervisor |
| 2026-08-07 | F8 | PR #20 / merge `62202ee71cdaabcd8e695b16e30523d95093fa3c` | Clean rebased after F4 and integrated | Supervisor |
| 2026-08-07 | F11 | PR #21 / merge `350acdb3af171561d16241a0aafb420b29204034` | Completed truth-safe trust/legal/content routes and integrated | Supervisor |
| 2026-08-07 | Gate 3 original CI attempts | Run `31185981046`, attempts 1–2 | Zero-step failure; later diagnosis supersedes generic runner classification | Supervisor |
| 2026-08-07 | Gate 3 supervisor hardening | PR #24 / merge `7c19320b9c7fdc6189362ce2e051c34a64e7ac9c` | Closed F2 timestamp/inventory and F8 normalized ProductCard edge cases | Supervisor |
| 2026-08-07 | Gate 3 hardening CI | Runs `31189461929`, `31189623381` | Exact external blocker identified: GitHub account Billing/Spending prevented job start | Supervisor |
| 2026-08-07 | Gate 3 hardening review | `93c186d5172ca6e89609d1e6bb75b7130b70b082` | Accepted for next-wave development after hardening; production release still blocked on full green CI | Supervisor |

## Registry Rules

- A phase is complete only after supervisor review and integration, with applicable executable verification evidence or an explicitly documented external execution blocker that does not waive production release requirements.
- A production release additionally requires a green combined quality run; CI infrastructure, account or billing failures never count as a production-quality pass.
- No phase branch may merge itself.
- New wave branches start from the supervisor-declared final integration SHA, not from `main` or an individual phase branch.
- Shared-file conflicts are resolved only on the integration branch.
- Quality checks rerun after shared-file reconciliation; when GitHub account Billing/Spending prevents job execution, the incident is recorded and the full gate remains mandatory after the account blocker is resolved.
- Feature phases may remove exact baseline debt but may not add new unregistered debt.
- A baseline entry requires an exact location, owner, reason, removal condition and expiry where applicable.
- Planning documents cannot silently override accepted route, domain, configuration, SEO or quality contracts.
- Unsupported claims and unverified assets remain blocked even when prototype code still renders them.
