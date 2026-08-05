# Front 200 Phase Registry

## Project Baseline

- Repository: `sajadkhavas/remix-of-pixel-perfect-replica`
- Main baseline: `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c`
- Integration branch: To be assigned by the supervisor
- Registry owner: Supervisor chat / final integration owner

## Phase Status

| Phase | Branch | Baseline | Final SHA | Review | Tests | Integration |
|---|---|---|---|---|---|---|
| F0 — Production Foundation | `phase/f0-production-foundation` | `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c` | Pending final verification | Ready for supervisor review after green CI | Foundation smoke test + quality gate | Not merged |

No phase is marked `APPROVED` in this initial registry. Approval and integration decisions belong only to the supervisor.

## Shared File Ownership

| Path | Owner phase | Notes |
|---|---|---|
| `package.json` | F0 | Toolchain and quality scripts; later dependency changes require integration review |
| `bun.lock` | F0 / integration owner | Must be updated only with the declared Bun version and reviewed for concurrent dependency changes |
| `eslint.config.js` | F0 | Central lint policy; later exceptions must be narrow and documented |
| `tsconfig*.json` | F0 | Shared TypeScript contract; strictness changes require repository-wide verification |
| `.prettier*` | F0 | Formatting policy; baseline debt must not be hidden |
| `.github/workflows/*` | F0 | Frontend quality gate; integration owner controls required-check policy |
| `scripts/format-changed.mjs` | F0 | Changed-file formatting gate used locally and in CI |
| `tests/server-error-page.smoke.test.ts` | F0 | Foundation smoke coverage for the server fallback |
| `src/components/sections/HeroSection.tsx` | F0 for stability only | Build, SSR, hydration, lifecycle, and reduced-motion fixes only; visual redesign belongs to its design phase |
| `src/components/sections/CategoriesSection.tsx` | Later visual/catalog phase | F0 touched only the direct JSX parser blocker and GSAP cleanup required for a valid build |
| `src/routeTree.gen.ts` | Router generator | Never edit manually; generated-file exclusions are owned by F0 |
| `docs/front-overhaul/*` | Supervisor / documenting phase | Phase evidence may be added by the owning phase; final statuses are controlled by the supervisor |

## Integration History

| Date | Phase | Commit | Decision | Reviewer |
|---|---|---|---|---|
| 2026-08-05 | F0 | Pending final verification | Branch created from required baseline; not merged | Supervisor pending |

## Registry Rules

- A phase row is evidence, not approval.
- `Final SHA`, `Review`, and `Integration` are finalized only after supervisor verification.
- No phase branch may merge itself.
- Shared-file conflicts must be resolved on the designated integration branch, not by rewriting another phase's branch.
- Quality checks must be rerun after any shared-file conflict resolution.
