# F6 — Discovery / Catalog Supervisor Review

## Decision

`APPROVED_WITH_F14B_PERFORMANCE_DEBT`

F6 is complete and integrated. This decision closes the F6 feature phase while explicitly preserving the existing application-wide F14B production-release blocker.

## Scope reviewed

Repository: `sajadkhavas/remix-of-pixel-perfect-replica`

Declared phase baseline:

`integration/front-200@0876dc312f9f8dcaf48509bf87a7f200a054b159`

Final phase branch:

`phase/f6-discovery-catalog@21ece001622a2a3272627698165d7a77f6a044ce`

Supervisor integration:

PR #29 / merge `efccf09a3e8a37050899f3af82dfa3fa18467502`

The final compare is 27 commits ahead, 0 behind, with nine changed files limited to F6 discovery components, discovery libraries, `/shop` routes, F6 tests and its implementation record. No package, lockfile, workflow, generated route tree or supervisor registry file was changed by the phase branch.

## Functional acceptance

The accepted implementation:

- keeps `/shop` as the only canonical catalog family;
- uses F2 discovery/search/taxonomy contracts instead of the legacy catalog state model;
- makes URL search parameters the source of truth for query, facets, sorting, pagination and view state;
- preserves refresh, back/forward and deep-link behavior;
- limits public sorting to `newest`, `price-asc`, `price-desc` and `discount` and fails unsupported ranking modes closed to `newest`;
- uses only the accepted top-level taxonomy `luxury`, `classic`, `smart`;
- adapts normalized F2 products through the accepted F8 card view-model rules;
- does not invent ratings, popularity or unsupported ranking evidence;
- keeps the F7-owned legacy numeric PDP boundary intact instead of emitting broken normalized PDP links;
- applies the accepted discovery SEO decision so query/filter/non-default-sort variants remain `noindex,follow`;
- keeps discovery fixture processing behind the F6 server boundary and leaves the shared F2 repository implementation unchanged.

## Executable quality evidence

Exact phase workflow: Frontend Quality run `31822361279`, attempt 2, on `21ece001622a2a3272627698165d7a77f6a044ce`.

The following gates executed successfully:

- frozen dependency install;
- changed-file Prettier validation;
- lint warning governance;
- TypeScript typecheck;
- unit tests, including seven F6 discovery-contract tests;
- contract tests;
- forbidden-production-copy scanner;
- link-integrity scanner;
- asset validation;
- registry-summary freshness;
- production client and SSR build.

The browser matrix did not run because the shared release dependency failed at the application-wide Performance Budget gate.

## Performance evidence and ownership

The declared integration baseline already fails the same F14B application-wide hard limits. Baseline run `31812949539` measured:

| Metric          |  Baseline | Hard limit |
| --------------- | --------: | ---------: |
| Client JS total | 898,198 B |  850,000 B |
| Server JS total | 226,595 B |  190,000 B |
| JS chunk count  |        35 |         31 |

The final F6 phase head measured:

| Metric          |   F6 head | Delta vs baseline |
| --------------- | --------: | ----------------: |
| Client JS total | 921,052 B |         +22,854 B |
| Server JS total | 288,055 B |         +61,460 B |
| JS chunk count  |        36 |                +1 |
| CSS total       | 119,649 B |            +967 B |

The accepted Gate 2 CSS hard limit remains 122,500 B, so F6 does not violate that CSS limit.

No performance budget, scanner, workflow or threshold was weakened to accept F6. The remaining JS/chunk debt is carried forward explicitly to F14B, whose existing registry responsibility is final application-wide performance and browser release reconciliation.

## Release distinction

F6 phase acceptance is not production-release acceptance.

F6 is closed and integrated, but production release remains `BLOCKED_BY_F14B_PERFORMANCE` until the shared performance hard limits are met and the dependent browser release gate executes successfully.
