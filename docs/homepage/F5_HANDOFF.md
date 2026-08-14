# F5 — Homepage Handoff

## Scope

F5 owns the production-safe homepage experience only. The final implementation is intentionally product-first and restrained: commerce discovery stays precise while the hero/editorial chapters retain premium visual hierarchy without continuous motion.

## Starting baseline

`integration/front-200@0876dc312f9f8dcaf48509bf87a7f200a054b159`

## Branch

`phase/f5-homepage`

## Delivered

- Focused static Hero with the approved H1 and one primary `/shop` CTA.
- Accepted category discovery route family only: luxury, classic, smart.
- Featured-product section stripped of unsupported popularity/sales/statistics claims.
- Trust/policy navigation that does not fabricate service availability or guarantees.
- Static buying-guide editorial chapter linked to `/blog`.
- Truth-safe homepage metadata without unverified brand/authenticity/shipping claims.
- F5 contract tests under `tests/quality/f5-homepage.test.ts`.
- Removal of homepage runtime usage of Swiper autoplay, Typewriter, GSAP, Framer Motion, VanillaTilt and react-parallax.

## Known dependency intentionally left for later owner

The existing `/product/$id` route still resolves numeric legacy catalog IDs. F7 owns Product Experience and the normalized F2 product/PDP migration. F5 therefore keeps the selected-product cards on the existing compatibility boundary rather than introducing broken normalized product links or changing F7-owned routes.

## Acceptance requirements

Before supervisor approval:

- frozen install must pass;
- format must pass;
- lint governance must show no new warning debt;
- typecheck must pass;
- unit/contract/F5 tests must pass;
- scanners must show no new forbidden-copy/link/asset debt;
- production build must pass;
- app-wide performance measurements must not regress from the declared pre-F5 integration baseline;
- F14B release debt remains separate from F5 acceptance and must not be waived by changing budgets.

## Merge policy

This phase branch must not merge itself. A supervisor/integration owner reviews and integrates the accepted delta.
