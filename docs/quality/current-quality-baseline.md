# F14A Current Quality Baseline

**Repository:** `sajadkhavas/remix-of-pixel-perfect-replica`  
**Baseline:** `integration/front-200@b0d8e9ba1d0156d18ccb68258a9a650490931d89`  
**Branch:** `phase/f14a-quality-harness`

## Command baseline

- frozen Bun install: pass;
- format at Gate 1: pass; F14A changes are normalized by the final sync and checked in blocking CI;
- lint: zero errors and eight exact, owned warnings;
- typecheck: pass;
- existing Bun tests: eight tests, 19 assertions, zero failures;
- production build: pass with one oversized client-chunk warning;
- Playwright route, accessibility, reduced-motion, and keyboard inventory: executed with exact registries;
- no Lighthouse, Core Web Vitals field data, or production RUM exists.

## Exact tracked source and asset debt

- forbidden production-copy findings: 31;
- link-integrity findings: 3;
- asset violations: 83;
- lint warnings: 8;
- route, accessibility, reduced-motion, and keyboard counts are generated in `quality/quality-summary.json` from their authoritative registries.

A baseline finding is not an approval. New, moved, expired, or unowned findings fail CI. Release requires the applicable baseline debt to reach zero.

## Route coverage

- final accepted route architecture: 39 paths/patterns;
- current generated route patterns: 13;
- future routes are coverage-matrix entries only and do not receive fake green tests;
- `/shop` is the catalog family; `/watches` is invalid unless a later supervisor decision adds an explicit redirect.

## Performance baseline

Measured from emitted production output after F14A tooling:

| Metric               |     Current |
| -------------------- | ----------: |
| Client JS total      |   827,737 B |
| Largest client chunk |   576,551 B |
| CSS total            |    97,878 B |
| Server JS total      |   179,076 B |
| Image bytes          | 1,680,909 B |
| Font bytes           | 0 B emitted |
| JS chunks            |          29 |
| Images               |          11 |
| Largest image        |   673,220 B |

Hard limits permit only a small regression over this prototype. Future targets are separately documented in `quality/performance-budget.json`.

## Known release blockers

- eight existing owned lint warnings;
- 31 copy/trust/demo findings;
- three link/action findings;
- 83 asset metadata/approval/identity/format violations;
- accessibility contrast, touch-target, and focus defects;
- mobile-menu keyboard activation defect;
- long/infinite motion under reduced motion;
- incomplete final route architecture and metadata coverage;
- homepage SSR/editorial invalid-element runtime error observed in browser execution;
- no completed manual QA sign-off.
