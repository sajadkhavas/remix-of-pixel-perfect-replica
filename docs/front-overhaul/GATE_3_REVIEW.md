# Gate 3 Supervisor Review

## Scope

Gate 3 covers the first production-facing feature wave after the shared foundation:

- F4 — Global Shell and Navigation
- F8 — Shared Commerce Components
- F11 — Content, Trust and Legal

Starting integration baseline: `cce59a743c02ecd995ea2b33f3490d7a023bfd09`

Final integrated code SHA before this review record: `350acdb3af171561d16241a0aafb420b29204034`

## Final Decisions

| Phase | Branch | Final phase SHA | Integration | Decision |
| --- | --- | --- | --- | --- |
| F4 — Global Shell and Navigation | `phase/f4-global-shell-navigation` | `57b2ebd70a6c21816219cd69ed1e2c0095e0289f` | PR #19 / merge `93732aafe8e71772eaf29f61ea6e64d9fde2ff43` | `APPROVED_AFTER_SUPERVISOR_RECONSTRUCTION` |
| F8 — Shared Commerce Components | `phase/f8-shared-commerce-components` | `553306f8dfccddcb596e51dedf8c77f84558cd59` | PR #20 / merge `62202ee71cdaabcd8e695b16e30523d95093fa3c` | `APPROVED_AFTER_CLEAN_REBASE` |
| F11 — Content, Trust and Legal | `phase/f11-content-trust-legal` | `07f95647bae4df43dc62938ff83df41acf117717` | PR #21 / merge `350acdb3af171561d16241a0aafb420b29204034` | `APPROVED_AFTER_SUPERVISOR_COMPLETION` |

## What Was Reconstructed

The original F4/F8/F11 chat work existed locally but had not been pushed as reviewable GitHub branches. The supervisor therefore rebuilt the work from the accepted Gate 2 baseline instead of treating local short SHAs as final evidence.

### F4

- Replaced the prototype shell with a production-oriented RTL shell.
- Removed fake payment badges, unsupported commercial promises and placeholder destinations from global navigation/footer surfaces.
- Consumed the F12 public settings contract with fail-closed visibility.
- Hid account and other surfaces when their feature/backend capability is not configured.
- Added a real main landmark and Skip Link.
- Made Lenis respect `prefers-reduced-motion`.
- Replaced the old custom mobile navigation behavior with a keyboard-usable native-dialog menu and explicit focus return.
- Removed the fake search affordance that had no valid search behavior behind it.
- Added shell visibility tests.

### F8

- Rebuilt ProductCard around reusable commerce view models instead of treating the legacy `Watch` shape as the long-term domain model.
- Added an adapter for the F2 Product contract while retaining a compatibility boundary for existing routes.
- Added shared price, product badge and responsive image primitives.
- Ratings are hidden by default and require explicit evidence/enablement.
- Exact low-stock counts are no longer exposed by the shared card.
- Product actions meet the 44px target and have accessible names/state.
- Removed tilt/motion behavior from the shared ProductCard path.
- Fixed the static error-page retry action so it performs a real navigation/reload action rather than a no-op button.
- Added model tests for rating visibility, discount and low-stock normalization.

### F11

- Replaced unverified About, Contact, FAQ and Services copy.
- Removed fake contact-form success behavior; no successful submission is claimed without a configured backend capability.
- Added evidence/configuration-aware routes for authenticity, warranty, shipping/returns and payment methods.
- Added neutral legal routes for privacy, terms and purchase terms without inventing legal obligations.
- New trust/legal pages are emitted as `noindex,follow` until approved production content/configuration exists.
- Integrated F13A metadata generation and F12/F4 public settings.
- Generated `src/routeTree.gen.ts` through the TanStack generator; it was not manually edited.
- Added tests for noindex policy and fail-closed development configuration.

## Verification Evidence

### F4 branch verification

During supervisor reconciliation the F4 branch passed repository formatting after normalization, lint after Fast Refresh separation, TypeScript, unit/contract/scanner stages and production build. Its remaining branch-level performance failure was caused by measuring the new functional shell against the pre-feature Gate 2 bundle ceiling. The shell was then reduced by removing unnecessary Radix runtime weight from global mobile navigation instead of blindly increasing the budget.

### F8 branch verification

The F8 branch passed formatting, lint, TypeScript, unit/contract tests, scanners, production build and the performance stage after the Product adapter/runtime was split for tree-shaking and card actions were kept lightweight. A browser contrast failure was traced to the old Footer's fake `VISA / شاپرک / زرین‌پال` badges, not ProductCard; those badges are removed by integrated F4.

### F11 branch verification

The one-shot route-generation workflow completed successfully, including dependency installation, production build, route generation and formatting, and removed its temporary workflow before the final F11 branch SHA.

### Combined integration CI infrastructure exception

The final integrated SHA `350acdb3af171561d16241a0aafb420b29204034` triggered Frontend Quality run `31185981046`. Two attempts were made. Both failed before executing a single step: GitHub assigned `runner_id: 0`, `runner_name: ""`, and returned empty step lists for the static and release jobs. Browser jobs were therefore skipped. This is recorded as a GitHub Actions runner/service failure, not a code/test failure.

Gate 3 acceptance is therefore based on the successful executable phase evidence above, explicit supervisor reconciliation, and the fact that both final combined attempts failed before checkout or test execution. The next wave must rerun the full shared gate from this Gate 3 baseline; no production release is approved by this exception.

## Governing Decisions Added by Gate 3

- The global shell must consume public store configuration and must not hardcode contact, payment, trust or commercial promises.
- Missing/unverified store configuration remains hidden or neutral; it is never replaced with invented copy.
- The shared ProductCard API is view-model based; the legacy `Watch` type is compatibility-only and must be removed as discovery/product routes migrate to F2 domain repositories.
- Ratings/reviews remain hidden unless backed by explicit data/evidence.
- Legal pages do not invent contractual terms. Unapproved legal/policy content remains neutral and noindex.
- Contact forms may not claim success unless the configured backend capability actually accepted the request.
- `src/routeTree.gen.ts` remains generator-owned.
- The remaining F14A quality debt is not waived; feature phases must reduce it and must not create unregistered regressions.

## Gate 3 Result

`ACCEPTED_FOR_NEXT_WAVE_WITH_CI_INFRASTRUCTURE_EXCEPTION`

Gate 3 is accepted as the next-wave development baseline. This is not a production-release approval. A future successful combined CI run is mandatory before final release acceptance.
