# F5 — Homepage Handoff

## Scope

F5 owns the production-safe homepage experience only. The final implementation is intentionally product-first and restrained: commerce discovery stays precise while the hero/editorial chapters retain premium visual hierarchy without continuous motion.

## Starting baseline

`integration/front-200@0876dc312f9f8dcaf48509bf87a7f200a054b159`

## Branch

`phase/f5-homepage`

## Verified implementation

- Implementation/evidence SHA: `e35adaec919e906a5c4f8f2d3dfb741809cc36f9`
- Frontend Quality run: `31816379779`
- Comparison against starting integration: branch ahead only; no integration commits missing at verification time.

## Delivered

- Focused static Hero with the approved H1 and one primary `/shop` CTA.
- Accepted category discovery route family only: luxury, classic, smart.
- Featured-product section stripped of unsupported popularity/sales/statistics claims.
- Trust/policy navigation that does not fabricate service availability or guarantees.
- Static buying-guide editorial chapter linked to `/blog`.
- Truth-safe homepage metadata without unverified brand/authenticity/shipping claims.
- F5 contract tests under `tests/quality/f5-homepage.test.ts`.
- Removal of homepage runtime usage of Swiper autoplay, Typewriter, GSAP, Framer Motion, VanillaTilt and react-parallax.
- Removal of implementation/migration notes from rendered storefront copy.
- Closure of one exact F5 lint baseline warning and five exact F5 forbidden-copy findings; total tracked registry debt reduced from 978 to 972 without deleting unrelated browser/asset debt.

## Executable evidence

Run `31816379779` on the verified implementation passed all F5/static gates before the inherited app-wide server budget:

- frozen dependency install: PASS;
- formatting: PASS;
- lint governance: PASS with one existing F9 warning and zero new warnings;
- typecheck: PASS;
- unit/quality tests: 37 PASS / 0 FAIL, including five F5 homepage contract tests;
- contract tests: 51 PASS / 0 FAIL;
- forbidden production copy: PASS with 15 existing non-F5 findings and zero resolved/stale F5 entries;
- link integrity: PASS;
- asset validation: PASS with no newly registered asset violation;
- quality-summary freshness: PASS;
- production client/SSR build: PASS.

## Performance delta

The final F5 measurement from run `31816379779` is:

| Metric | Pre-F5 integration | F5 | Delta | Hard limit | F5 result |
| --- | ---: | ---: | ---: | ---: | --- |
| Client JS total | 898,198 B | 611,075 B | -287,123 B | 850,000 B | PASS |
| Largest client chunk | within limit | 498,970 B | improved/within limit | 590,000 B | PASS |
| CSS total | within limit | 105,178 B | within limit | 122,500 B | PASS |
| Server JS total | 226,595 B | 209,669 B | -16,926 B | 190,000 B | inherited release blocker |
| Image bytes | higher pre-F5 baseline | 380,259 B | materially reduced | 1,720,000 B | PASS |
| JS chunk count | 35 | 31 | -4 | 31 | PASS |
| Image count | — | 8 | — | 11 | PASS |
| Largest image | — | 57,928 B | — | 690,000 B | PASS |

F5 therefore removes the previous client-JS and chunk-count budget failures and materially reduces server JS. The sole remaining executable performance failure is `serverJsTotal=209669 > 190000`, an application-wide F14B release concern. No performance budget, scanner, workflow or threshold was weakened or raised for F5.

Because the shared workflow makes the browser matrix depend on the full static/performance job, the browser job remains skipped while the app-wide server budget fails. Existing browser/accessibility/reduced-motion baseline debt is retained rather than silently removed without executable browser evidence.

## Known dependency intentionally left for later owner

The existing `/product/$id` route still resolves numeric legacy catalog IDs. F7 owns Product Experience and the normalized F2 product/PDP migration. F5 therefore keeps the selected-product cards on the existing compatibility boundary rather than introducing broken normalized product links or changing F7-owned routes. The migration dependency is documented here, not rendered to storefront users.

## Acceptance decision

`F5_CODE_COMPLETE_READY_FOR_SUPERVISOR_REVIEW_WITH_INHERITED_F14B_SERVER_BUDGET_BLOCKER`

F5-specific code/static/contract/build requirements pass, F5 closes its owned static debt, and every measured performance dimension except the already shared server total is now within budget. F5 does not claim production-release approval; F14B must still close the server budget and run the browser release matrix.

## Merge policy

This phase branch must not merge itself. A supervisor/integration owner reviews and integrates the accepted delta.
