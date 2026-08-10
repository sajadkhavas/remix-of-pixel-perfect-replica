# Pre-Wave Final Closure

## Purpose

This closure reconciles the accepted Gate 3 code with the F14A quality governance before the next feature wave. It does not implement future F5/F6/F7/F9/F10 feature scope and it does not waive release gates that require executable CI/browser evidence.

Starting baseline: `integration/front-200@b303c0b9f81cea8ab21c70f38597d77e9e7748b7`

## Completed Closure Work

- Closed all six F3B Fast Refresh baseline warnings through a narrow, named-export architecture exception instead of disabling the rule globally.
- Reassigned the two remaining lint warnings to their actual future owners: F5 editorial cleanup and F9 StoreContext migration.
- Removed stale forbidden-copy entries already resolved by F4/F11 truth-safe shell and contact work.
- Reassigned remaining homepage claims to F5, legacy catalog review fixtures to F6/F7, and demo auth copy to F10.
- Removed resolved F4 placeholder-link and F8 static error-page link debt; only the legacy cart CTA remains and is owned by F9.
- Closed the obsolete critical F4 mobile-menu keyboard baseline after verifying native button/dialog semantics, focus transfer, a named close control, and focus restoration.
- Updated the F14A automatic owner map to the accepted phase ownership model and added regression tests so unknown files are no longer silently assigned to F8.
- Refreshed the static quality summary against this closure baseline.

## Reconciled Static Debt

| Registry | Gate 2 snapshot | Pre-wave closure | Change |
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

The 978 total intentionally keeps the last executable browser and asset debt. Those entries are not asserted to be current defects where later code may have improved them; they remain conservative release blockers until the quality jobs can execute again.

## Remaining Debt Ownership

- F5: homepage unsupported marketing statistics/metadata and editorial lint cleanup.
- F6/F7: legacy catalog review-count fixtures and discovery/PDP migration to F2 repositories.
- F9: legacy StoreContext refresh boundary and cart checkout affordance; commerce-state migration.
- F10: legacy demo auth copy/behavior.
- Asset/page owners: production asset identity, source/license and responsive derivative approval.
- F14B: rerun and reconcile route smoke, accessibility, reduced-motion, performance and final release quality.

## CI / Release Evidence

Frontend Quality run `31362729256` was triggered on the closure branch. GitHub created the static and release jobs but did not execute any steps; the browser job was skipped. This reproduces the account-level GitHub Actions billing/spending blocker previously diagnosed by GitHub's own check annotation: jobs are not started while recent account payments have failed or the Actions spending limit must be increased.

No CI rule, browser suite, scanner, or performance budget was weakened to work around this external blocker.

## Decision

`PRE_WAVE_CODE_CLOSURE_COMPLETE_WITH_EXTERNAL_CI_BILLING_BLOCKER`

This closure is eligible to become the next-wave development baseline after supervisor PR review and integration. It is not a production-release approval. Production release still requires a fully executable green combined quality run after the GitHub account billing/spending blocker is resolved.
