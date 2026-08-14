# F6 — Discovery / Catalog Implementation

## Scope

F6 replaces the legacy discovery experience with the accepted F2 search, taxonomy and product contracts while preserving the existing F7-owned PDP boundary.

## Baseline

`integration/front-200@0876dc312f9f8dcaf48509bf87a7f200a054b159`

## Branch

`phase/f6-discovery-catalog`

## Architecture

- `/shop` remains the canonical catalog family.
- Search is represented as `/shop?q=...`; F6 does not introduce a competing `/search` or `/watches` route family.
- Route search stays optional and is normalized into a complete F2 `DiscoverySearchState` inside F6.
- Filters, sort, pagination, search and grid/list view are URL-backed so refresh, back/forward and deep links preserve state.
- GET forms and ordinary links provide progressive enhancement instead of component-local catalog state.
- Mobile filtering uses native `details/summary`, avoiding a dialog runtime on the catalog critical path.

## Truth-safe sorting

Public sort choices are limited to `newest`, `price-asc`, `price-desc` and `discount`. `popular`, `best-rated` and `relevance` are not exposed without an evidence-backed ranking source and are normalized to `newest` at the public route boundary.

## Taxonomy and filters

Top-level categories come from the accepted F2 taxonomy only: `luxury`, `classic` and `smart`.

The current discovery surface supports category, brand, audience, style, movement, case material, dial color, water resistance, availability, price and discount filtering.

## Data boundary

Discovery keeps fixture product, brand and category data plus filtering logic in `src/lib/discovery.server.ts`; route files never import fixture product data directly.

`src/lib/discovery.functions.ts` uses a compile-time `import.meta.env.SSR` boundary. SSR loads the server discovery module directly, while browser navigation posts a validated serialized discovery request to the `/shop` route handler. The route handler rejects malformed JSON and malformed discovery requests before calling server discovery logic.

The shared `src/data/fixtures/repositories.ts` file was restored to its accepted baseline content so F6 does not mutate the general F2 repository implementation to satisfy one route.

## Product-card boundary

F6 adapts normalized F2 products through the accepted F8 card view-model rules. Ratings are not invented or enabled by F6.

The current PDP still accepts numeric legacy IDs and is owned by F7. F6 therefore renders discovery cards without a PDP link or commerce action rather than creating broken normalized links or taking ownership of F7/F9 behavior.

## SEO behavior

The clean catalog remains indexable. Search, filter and non-default sort variants use the accepted discovery SEO decision and are `noindex,follow`.

## Quality contract

`tests/quality/f6-discovery.test.ts` locks the public sort allowlist, optional URL-search defaults, deep-link serialization, accepted taxonomy, discovery SEO behavior, the legacy-catalog/PDP boundary and the compile-time server-data boundary.

## Performance policy

No performance budget, workflow, scanner or threshold is weakened by F6. Performance is measured against the declared integration baseline and any remaining delta is reported in the handoff instead of being waived.
