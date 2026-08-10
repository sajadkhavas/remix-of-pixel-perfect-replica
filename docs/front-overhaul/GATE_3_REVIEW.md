# Gate 3 Supervisor Review

## Scope

Gate 3 covers the first production-facing feature wave after the shared foundation:

- F4 — Global Shell and Navigation
- F8 — Shared Commerce Components
- F11 — Content, Trust and Legal

Starting integration baseline: `cce59a743c02ecd995ea2b33f3490d7a023bfd09`

Original Gate 3 integrated code SHA: `350acdb3af171561d16241a0aafb420b29204034`

Supervisor hardening branch: `phase/gate3-hardening`

Supervisor hardening final branch SHA: `7ffa86422332a2882e5617622dfcdfb895029ded`

Supervisor hardening integration: PR #24 / merge `7c19320b9c7fdc6189362ce2e051c34a64e7ac9c`

Pre-wave final closure branch: `phase/pre-wave-final-closure`

Pre-wave final closure SHA: `e3bbe73e47749d6985fef89fb4d721d64583761c`

Pre-wave final closure integration: PR #25 / merge `af3bb06f33061fa531143d53a105560627650a8a`

## Final Decisions

| Phase | Branch | Final phase SHA | Integration | Decision |
| --- | --- | --- | --- | --- |
| F4 — Global Shell and Navigation | `phase/f4-global-shell-navigation` | `57b2ebd70a6c21816219cd69ed1e2c0095e0289f` | PR #19 / merge `93732aafe8e71772eaf29f61ea6e64d9fde2ff43` | `APPROVED_AFTER_SUPERVISOR_RECONSTRUCTION` |
| F8 — Shared Commerce Components | `phase/f8-shared-commerce-components` + supervisor hardening | `553306f8dfccddcb596e51dedf8c77f84558cd59` + `7ffa86422332a2882e5617622dfcdfb895029ded` | PR #20 / merge `62202ee71cdaabcd8e695b16e30523d95093fa3c`; PR #24 / merge `7c19320b9c7fdc6189362ce2e051c34a64e7ac9c` | `APPROVED_AFTER_SUPERVISOR_HARDENING` |
| F11 — Content, Trust and Legal | `phase/f11-content-trust-legal` | `07f95647bae4df43dc62938ff83df41acf117717` | PR #21 / merge `350acdb3af171561d16241a0aafb420b29204034` | `APPROVED_AFTER_SUPERVISOR_COMPLETION` |

F2 remains `APPROVED_AFTER_SUPERVISOR_HARDENING`; PR #24 adds a cross-gate contract hardening closure for persisted commerce timestamps and inventory consistency without changing F2's accepted IA or data-model direction.

F3B remains `APPROVED_AFTER_INTEGRATION_VERIFICATION`; PR #25 closes its six remaining Fast Refresh warnings using a narrow named-export architecture exception rather than disabling the rule.

F14A remains `APPROVED_AFTER_SUPERVISOR_RECONCILIATION`; PR #25 corrects its automatic phase-owner map, adds ownership regression tests and reconciles stale static debt registries.

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

## Supervisor Hardening Closure

PR #24 closes the concrete defects found during the post-Gate-3 source audit.

### F2 commerce persistence

- Persisted commerce timestamps are no longer accepted merely because they are non-empty strings.
- Cart line, cart, wishlist, compare, recently-viewed, shipping, checkout-draft and root-state timestamps must pass an ISO date-time boundary check and `Date.parse` validation.
- Legacy commerce migration rejects an invalid migration timestamp.
- Regression tests cover malformed cart, line and shipping timestamps and invalid migration time.

### F2 product inventory contract

- Added a shared `isInventoryStateConsistent` domain rule.
- `tracking: "not-tracked"` is valid only with `status: "not-tracked"`; tracked inventory cannot use the `not-tracked` status.
- Purchase eligibility now fails closed for contradictory inventory states.
- Backorder/out-of-stock purchase is allowed only when `backorderable` is explicitly true.

### F8 ProductCard adapter

- Normalized ProductCard data now requires valid F2 pricing before price presentation.
- Purchase presentation requires an active Product and active default Variant.
- The default Variant must belong to the same Product identity.
- Inventory tracking/status must pass the shared F2 consistency rule.
- Purchasability delegates to the F2 `isPurchasableVariant` helper instead of maintaining a second ad-hoc rule.
- Regression tests cover normalized Product input, rating opt-in, invalid pricing, inactive Product, inactive Variant, Variant identity mismatch, explicit backorder behavior and contradictory inventory state.

## Pre-Wave Final Closure

PR #25 reconciles accepted Gate 3 code with the F14A quality registries before the next feature wave.

### F3B lint closure

- Closed six Design System Fast Refresh baseline warnings through a narrow allowlist of known helper/variant exports.
- The global React Refresh rule remains enabled; it was not disabled or downgraded.
- The only two remaining lint warnings belong to future feature work: F5 `EditorialSection` cleanup and F9 `StoreContext` migration.

### Static debt reconciliation

- Removed stale F4 Footer/Navbar forbidden-copy entries already eliminated by the truth-safe shell.
- Removed stale F11 Contact placeholder entries already eliminated by validated public settings.
- Removed stale root metadata claims already replaced by F12-configured defaults.
- Removed the resolved F4 placeholder link and resolved F8 static error-page action finding.
- Closed the old critical F4 mobile-menu keyboard entry after verifying native button/dialog activation, focus transfer, a named close control and focus restoration.
- Reassigned remaining homepage marketing debt to F5, legacy catalog review fixtures to F6/F7, cart/StoreContext debt to F9 and demo auth debt to F10.

### F14A ownership governance

- Corrected `ownerForFile()` to the accepted phase map instead of legacy ownership assumptions.
- ProductCard/commerce now maps to F8; cart/wishlist/compare/StoreContext to F9; auth/account/checkout to F10; trust/legal routes to F11.
- Unknown future files map to `UNASSIGNED` rather than silently being dumped into F8.
- Added `tests/quality/phase-owner-map.test.ts`; it is automatically included by the existing `tests/quality/*.test.ts` unit gate.

### Reconciled static quality snapshot

| Registry | Gate 2 | Pre-wave closure | Change |
| --- | ---: | ---: | ---: |
| Lint warnings | 8 | 2 | -6 |
| Forbidden production copy | 31 | 20 | -11 |
| Link integrity | 3 | 1 | -2 |
| Keyboard | 1 | 0 | -1 |
| Asset violations | 83 | 83 | unchanged |
| Route smoke | 10 | 10 | last executable browser baseline |
| Accessibility | 803 | 803 | last executable browser baseline |
| Reduced motion | 59 | 59 | last executable browser baseline |
| **Total tracked debt** | **998** | **978** | **-20** |

The browser and asset counts are intentionally retained conservatively. Because GitHub Actions cannot start jobs, they cannot be authoritatively refreshed; later code improvements are not used as an excuse to delete unexecuted browser debt.

## Verification Evidence

### F4 branch verification

During supervisor reconciliation the F4 branch passed repository formatting after normalization, lint after Fast Refresh separation, TypeScript, unit/contract/scanner stages and production build. Its remaining branch-level performance failure was caused by measuring the new functional shell against the pre-feature Gate 2 bundle ceiling. The shell was then reduced by removing unnecessary Radix runtime weight from global mobile navigation instead of blindly increasing the budget.

### F8 branch verification

The F8 branch passed formatting, lint, TypeScript, unit/contract tests, scanners, production build and the performance stage after the Product adapter/runtime was split for tree-shaking and card actions were kept lightweight. A browser contrast failure was traced to the old Footer's fake `VISA / شاپرک / زرین‌پال` badges, not ProductCard; those badges are removed by integrated F4.

The later PR #24 hardening was reviewed at the full diff level and formatting was normalized manually. GitHub Actions could not execute the shared gate because of the account-level billing/spending blocker described below; therefore the new regression tests are committed but are not falsely recorded as CI-executed evidence.

### F11 branch verification

The one-shot route-generation workflow completed successfully, including dependency installation, production build, route generation and formatting, and removed its temporary workflow before the final F11 branch SHA.

### Combined integration CI blocker — corrected root cause

The original Gate 3 integrated SHA `350acdb3af171561d16241a0aafb420b29204034` triggered Frontend Quality run `31185981046`. Two attempts failed before checkout or any executable step, with `runner_id: 0`, an empty `runner_name`, and empty step lists.

During PR #24 hardening, run `31189461929` reproduced the same zero-step failure. A diagnostic workflow-only experiment changed the hosted runner label from `ubuntu-24.04` to `ubuntu-22.04`; run `31189623381` failed identically before any step. GitHub's check annotation then provided the exact root cause: the job was not started because recent account payments had failed or the account spending limit needed to be increased.

On 2026-08-10, the pre-wave closure again triggered Frontend Quality on its final head. PR run `31362947753` created the static and release jobs but executed no steps; the browser gate was skipped. GitHub's annotation repeated the same account Billing/Spending message. This confirms the external blocker persisted and is independent of the closure code.

The diagnostic runner-label change from PR #24 was reverted immediately. The repository workflow remains on the original pinned `ubuntu-24.04` configuration and no CI gate was weakened or bypassed.

This supersedes the earlier generic "runner/service failure" classification. The current blocker is an external GitHub account Billing/Spending condition, not a repository test failure and not a runner-image compatibility issue.

No production release is approved while this blocker prevents execution. Once account Billing/Spending is resolved, the full Frontend Quality workflow must run green on the then-current integrated release candidate.

## Governing Decisions Added by Gate 3

- The global shell must consume public store configuration and must not hardcode contact, payment, trust or commercial promises.
- Missing/unverified store configuration remains hidden or neutral; it is never replaced with invented copy.
- The shared ProductCard API is view-model based; the legacy `Watch` type is compatibility-only and must be removed as discovery/product routes migrate to F2 domain repositories.
- ProductCard purchase state must consume F2 pricing, inventory consistency and Variant purchasability rules rather than duplicating commerce truth.
- Persisted commerce timestamps must be validated at the storage boundary; arbitrary non-empty strings are not accepted as `ISODateTime`.
- Ratings/reviews remain hidden unless backed by explicit data/evidence.
- Legal pages do not invent contractual terms. Unapproved legal/policy content remains neutral and noindex.
- Contact forms may not claim success unless the configured backend capability actually accepted the request.
- F14A debt ownership must follow the accepted phase map; unknown files remain `UNASSIGNED` until explicitly owned.
- Resolved baseline debt must be removed; stale entries are not retained merely to preserve historical counts.
- Browser debt may not be removed without executable browser evidence unless the defect is directly eliminated by deterministic native semantics and explicitly reviewed by the supervisor.
- `src/routeTree.gen.ts` remains generator-owned.
- The remaining quality debt is not waived; feature phases must reduce it and must not create unregistered regressions.
- GitHub Actions Billing/Spending failures are external blockers and never count as a successful release gate.

## Gate 3 / Pre-Wave Result

`PRE_WAVE_CODE_CLOSURE_COMPLETE_WITH_EXTERNAL_CI_BILLING_BLOCKER`

F0, F1, F2, F3A, F3B, F4, F8, F11, F12, F13A and F14A are closed for their accepted scopes and may be used as the foundation for the next development wave. No known in-scope code defect from the supervisor audits remains assigned to those closed phases. Remaining tracked implementation debt belongs to future phases F5/F6/F7/F9/F10, asset/page migration and F14B final quality.

This is not a production-release approval. A successful combined CI and browser run remains mandatory before final release acceptance.
