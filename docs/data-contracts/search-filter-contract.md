# Search, Filter, Sort, and URL State Contract

## Architectural rule

Discovery state is URL-driven. Route integration must use TanStack Router search validation and pass the normalized `DiscoverySearchState` to repositories and UI. React component state may hold transient interaction details only (drawer open state, focused control, pending range drag), never the authoritative applied filters.

This guarantees refresh, deep-link, back/forward, shareability, deterministic canonical decisions, and one source of truth.

## Parameter contract

| URL key | Domain type | Default | Parser and normalization | Invalid value | Canonical/indexability |
|---|---|---:|---|---|---|
| `q` | trimmed string, max 120 chars | absent | collapse whitespace; preserve user language | remove | `/search` and query-bearing discovery URLs are `noindex,follow`; omit from canonical |
| `category` | ASCII kebab-case slug | absent | lowercase; slug validation | remove | a durable category must use `/shop/$categorySlug`; query form is noindex |
| `brand` | sorted unique slug list | `[]` | comma-separated, lowercase, valid slugs | drop invalid members | faceted URL: noindex; canonical normally base listing |
| `audience` | sorted unique key list | `[]` | comma-separated taxonomy keys | drop invalid members | noindex unless represented by an approved clean landing route such as `/shop/men` |
| `style` | sorted unique key list | `[]` | comma-separated taxonomy keys | drop invalid members | noindex unless an approved clean landing route exists |
| `movement` | sorted unique key list | `[]` | comma-separated taxonomy keys | drop invalid members | noindex unless an approved clean landing route exists |
| `priceMin` | non-negative integer minor-unit amount | absent | finite integer; swap with max when reversed | remove | noindex; remove from canonical |
| `priceMax` | non-negative integer minor-unit amount | absent | finite integer; swap with min when reversed | remove | noindex; remove from canonical |
| `caseSize` | sorted unique number list (10–100 mm) | `[]` | comma-separated numbers | drop invalid members | noindex; remove from canonical |
| `caseMaterial` | sorted unique key list | `[]` | comma-separated taxonomy keys | drop invalid members | noindex; remove from canonical |
| `strapMaterial` | sorted unique key list | `[]` | comma-separated taxonomy keys | drop invalid members | noindex; remove from canonical |
| `dialColor` | sorted unique key list | `[]` | comma-separated taxonomy keys | drop invalid members | noindex; remove from canonical |
| `waterResistance` | sorted unique key list | `[]` | comma-separated taxonomy keys | drop invalid members | noindex; remove from canonical |
| `availability` | list of `in-stock`, `low-stock`, `preorder`, `backorder` | `[]` | comma-separated allowlist | drop invalid members | noindex; remove from canonical |
| `discount` | boolean | `false` | `1` or `true` => true | false | noindex; remove from canonical |
| `sort` | `SortValue` | route-dependent (`relevance` for search; `newest` for catalog) | allowlist | fallback | non-default sort: noindex and strip from canonical |
| `page` | integer 1–10000 | `1` | truncate finite number | 1 | clean unfiltered pagination is indexable and self-canonical; filtered/search pagination remains noindex |
| `view` | `grid` or `list` | `grid` | allowlist | grid | noindex and strip from canonical when non-default |

## Serialization

- Query keys always serialize in the order documented in `PARAM_ORDER`.
- Multi-value parameters use a comma-separated, deduplicated, lowercase, lexically sorted representation.
- Default values are omitted.
- Empty values are omitted.
- Spaces use `URLSearchParams` encoding.
- Applying or removing a filter resets `page` to 1.
- Sorting and view changes normally replace the current history entry only while an interaction is unfinished; applying a final user choice creates a navigable history state.

Example normalized query:

```text
brand=aurelius-geneve,kavian-atelier&movement=automatic&priceMin=100000000&page=2
```

## Route integration

A later route phase should use `validateSearch` to call `parseDiscoverySearch`, use the normalized object as loader dependency input, and serialize with `serializeDiscoverySearch`. The domain module deliberately does not import TanStack Router, keeping it portable and testable.

## Search repository requirement

`SearchRepository` receives normalized state and returns products, total count, facet buckets, corrected query if applicable, and an explicit ranking source. It must never receive raw URL values.

## Filter UX contract

- Show only filters allowed by the current category contract.
- Keep applied filters visible and individually removable.
- Provide “clear all” without hiding the current result count.
- Multi-select values use stable taxonomy keys, not translated labels.
- Mobile drawer state is transient; applied state remains in the URL.
- Preserve the user's place and focus after applying filters.
- Zero-result combinations must offer removal/recovery actions, not silently broaden the query.
- Counts are repository projections and may be approximate only when labeled as such.

## Sort semantics

| URL value | Persian label | Semantics | Required data | Fallback | Indexability effect |
|---|---|---|---|---|---|
| `relevance` | مرتبط‌ترین | Search ranking score; meaningful only with `q` | search score and ranking version | `newest` | noindex; strip from canonical |
| `newest` | جدیدترین | `releasedAt` descending, then `publishedAt`, then stable ID | valid release/publish date | `popular` | noindex; strip from canonical |
| `price-asc` | ارزان‌ترین | effective comparable price ascending | normalized price in selected currency | `newest` | noindex; strip from canonical |
| `price-desc` | گران‌ترین | effective comparable price descending | normalized price in selected currency | `newest` | noindex; strip from canonical |
| `popular` | محبوب‌ترین | documented popularity score over a defined time window | analytics/order-derived score | `newest` | noindex; strip from canonical |
| `best-rated` | بالاترین امتیاز | rating adjusted for minimum count, not raw average alone | rating value and count | `popular` | noindex; strip from canonical |
| `discount` | بیشترین تخفیف | active discount percentage descending | valid list and sale prices | `newest` | noindex; strip from canonical |

“Newest” must not be exposed when dates are absent or unreliable. “Popular” must not be mislabeled as “best selling” unless its source is actual sales data.

## SEO decision matrix

| State | Robots | Canonical |
|---|---|---|
| base `/shop` or approved clean landing route | `index,follow` | self |
| unfiltered `page=N` | `index,follow` | self, retaining `page=N` |
| query `q` | `noindex,follow` | clean search route without query, or omit canonical when no equivalent exists |
| arbitrary facets | `noindex,follow` | base category only when substantially duplicate; otherwise normalized self canonical plus noindex |
| sort/view only | `noindex,follow` | URL without sort/view |
| facets plus pagination | `noindex,follow` | normalized policy target; never imply page 2 equals page 1 |
| tracking parameters | inherit clean page | remove tracking keys |

Canonical is not used as the only crawl-control mechanism. Internal navigation should avoid generating unbounded facet combinations, robots rules may disallow known infinite patterns, and only curated clean landing pages are linked as indexable destinations.

## Error and empty behavior

- Invalid values normalize away and the route may replace the URL with the canonical normalized query.
- Unknown taxonomy values do not enter repository requests.
- Repository failure produces an error state while preserving the current URL.
- Empty results preserve applied filters and expose recovery actions.
- Stale pages beyond the new result range normalize to the last valid page or page 1 according to route policy.

## References

- TanStack Router search params and validation: https://tanstack.com/router/latest/docs/framework/react/guide/search-params
- Google faceted navigation guidance: https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
- Google ecommerce URL design: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
- Google pagination guidance: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- Baymard filtering research: https://baymard.com/lists/cart-abandonment-rate
