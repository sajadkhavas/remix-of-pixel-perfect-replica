# KRONOS SEO URL, Canonical, and Indexability Policy

## 1. URL normalization

| Concern | Policy |
|---|---|
| Scheme/host | One production HTTPS origin is canonical; non-canonical hosts redirect at the edge. The host is deployment configuration, not hard-coded in domain contracts. |
| Case | Paths and parameter keys/enum values are lowercase. Mixed-case requests permanently redirect to lowercase where safe. |
| Trailing slash | Only `/` has a trailing slash. Other trailing-slash forms permanently redirect to the slashless path. |
| Slug language | Stable ASCII English/transliterated kebab-case slugs; Persian names remain page copy. Do not encode mutable translated names into IDs. |
| Separators | Hyphen separates words. No spaces, underscores, duplicate hyphens, or filename extensions. |
| IDs | Product and brand URLs use slugs, not database IDs. Opaque order IDs are permitted only on private routes. |
| Query order | Search parameters serialize in the stable contract order. Multi-values are unique and sorted. |
| Defaults | Default search values are omitted from the URL. |
| Tracking | `utm_*`, `gclid`, `fbclid`, and equivalent tracking keys are excluded from canonical URLs and should not be propagated by internal links. |
| Fragments | UI fragments do not affect canonical identity and are not sent to servers. |

## 2. Page-type policy

| Page type | Robots | Canonical | Notes |
|---|---|---|---|
| Home | `index,follow` | self | One canonical origin. |
| Base shop | `index,follow` | self | Must provide useful standalone content and products. |
| Approved clean category/audience/style/movement landing | `index,follow` when useful | self | Uses clean route, not query alias. Empty/thin pages become noindex until useful. |
| Brand directory | `index,follow` | self | Pagination, if used, follows pagination policy. |
| Brand detail | `index,follow` when useful | self canonical slug | Empty placeholders are noindex. Unsupported official claims must not be emitted. |
| Active product | `index,follow` | self canonical product slug | Variant selection normally does not create duplicate indexable URLs. |
| Temporarily unavailable product | usually `index,follow` | self | Keep indexable when page remains useful, return date/alternatives exist, and product is expected back. |
| Discontinued product with demand, support, or alternatives | `index,follow` or time-limited index | self | Explain status and link successors. Reassess when page no longer serves users. |
| Deleted product with clear replacement | redirect | replacement | 301 only when replacement is genuinely equivalent. |
| Deleted product without replacement | not indexable | none | Return 410 for intentional permanent removal when operationally supported; otherwise 404. |
| Magazine/guide index and published content | `index,follow` | self | Draft/preview content is noindex and access controlled. |
| Informational/legal policy page | `index,follow` | self | Legal pages require version/effective date where relevant. |
| Search results | `noindex,follow` | clean `/search` or no canonical when no equivalent exists | Do not make internal search result sets indexable. |
| Arbitrary filtered URL | `noindex,follow` | base/clean landing only when substantially equivalent; otherwise normalized self canonical plus noindex | Canonical is not crawl control. |
| Sort/view-only URL | `noindex,follow` | URL without sort/view | Internal links should prefer default form. |
| Compare, wishlist, cart | `noindex,follow` | clean self | User/session state; no tracking or item IDs in canonical. |
| Checkout/account/order/profile/address | `noindex,nofollow` | clean self or omitted on private response | Authentication, privacy, and transactional pages. |

## 3. Product canonical and variant policy

- `/product/$productSlug` is the canonical product-group page.
- Product ID never appears in the final canonical path.
- Default and selected variant IDs are not ordinary query parameters in indexable internal links.
- Variant-specific availability, price, image, SKU, and option data are visible on the same product URL and represented in structured data when valid.
- A variant may receive its own clean URL only after a separate decision proves that each variant has durable user-search value and materially distinct page content. In that case, each variant must self-canonical and belong to the same product group.
- Unknown/invalid variant state normalizes to the product's default available variant without changing product canonical identity.
- A changed product slug generates a one-hop 301 from every known historical slug to the current slug.

## 4. Faceted navigation policy

### Default

All arbitrary combinations of brand, audience, style, movement, price, case dimensions/material, strap, dial color, water resistance, availability, discount, and view/sort parameters are `noindex,follow`.

### Indexable exception

Only clean, curated routes approved in the route map can be indexable, initially:

- `/shop/men`
- `/shop/women`
- `/shop/luxury`
- `/shop/classic`
- `/shop/sport`
- `/shop/smart`
- `/shop/automatic`
- `/shop/mechanical`
- `/shop/quartz`
- `/brands/$brandSlug`

Approval requires unique intent, unique copy, stable inventory, search demand, internal navigation support, and an explicit canonical route. A query URL must not compete with its approved clean landing.

### Crawl controls

- Do not generate links for every mathematically possible filter combination.
- Links for applied filters may be crawlable only when finite and useful; transient controls may use button-driven navigation while remaining keyboard accessible.
- Normalize invalid/default/duplicate values before rendering internal links.
- Avoid session IDs, timestamps, random ordering, and unconstrained numeric ranges in URLs.
- Server and edge rules may block known infinite spaces, but robots rules must not be treated as a replacement for correct canonicals and internal-link discipline.

## 5. Query-parameter canonical handling

| Parameter class | Canonical treatment | Robots effect |
|---|---|---|
| `q` | remove; canonical to clean `/search` only when that page is the best equivalent, otherwise omit canonical | noindex |
| Filter dimensions | remove when canonicalizing to an equivalent base/curated page; otherwise keep normalized self canonical | noindex |
| `sort` | remove | noindex when non-default |
| `view` | remove | noindex when non-default |
| `page` | retain for valid unfiltered pagination | indexable only for clean listing pagination |
| Tracking/affiliate click IDs | remove | inherit clean page |
| Unknown parameters | remove and preferably redirect/replace to normalized URL | inherit normalized state |

## 6. Pagination

- Every paginated page has a distinct URL using `?page=N`.
- Valid clean listing pages self-canonical, including page 2 and later; they do not canonicalize to page 1.
- Page 1 omits `page=1` and redirects or replaces it with the clean base URL.
- Pagination links are standard crawlable anchors.
- Invalid/non-integer/negative pages normalize to page 1.
- Pages beyond the last page return a clear not-found or normalize only when the application can do so without masking removal; this must be consistent.
- Filtered/search pagination inherits noindex from the filtered/search state.
- Infinite scroll, if introduced, must have equivalent paginated URLs and accessible navigation.

## 7. Search policy

- `/search?q=...` is `noindex,follow`.
- User queries are never inserted into canonical paths.
- Search pages do not emit Product structured data for the entire result grid.
- Empty search results remain 200 with noindex, recovery guidance, and no invented matches.
- Query corrections remain visible and retain the original user intent in state; canonical remains non-indexable search policy.

## 8. Empty and unavailable collections

| State | HTTP | Robots/canonical | UX |
|---|---:|---|---|
| Valid category with temporary zero inventory and useful content | 200 | `noindex,follow` until products return; self canonical | explain temporary state, show relevant alternatives/content |
| Category intentionally retired with equivalent successor | 301 | successor canonical | redirect one hop |
| Category retired without successor | 410 or 404 | none | helpful navigation |
| Unknown category slug | 404 | no index | do not redirect all unknowns to `/shop` |
| Empty filtered combination | 200 | noindex; policy canonical | preserve filters and offer removal actions |

## 9. Duplicate and redirect policy

- Redirects are one hop and preserve only approved meaningful parameters.
- Old product/article/brand slugs redirect to the current canonical slug.
- Numeric legacy product routes require an explicit ID-to-slug map; never derive an unreliable slug at request time from UI text.
- Case, slash, duplicate-hyphen, and percent-encoding normalization redirects to one canonical path.
- Unknown slugs return 404; they do not redirect to a broad parent merely to avoid errors.
- Redirect maps are version-controlled and tested for chains, loops, collisions, and destination status.

## 10. Canonical generation contract

Canonical generation accepts a normalized route identity and normalized search state, never raw `window.location`. It:

1. selects the one production origin from deployment settings;
2. applies lowercase and slash policy;
3. uses the current canonical slug;
4. removes tracking/default/sort/view parameters;
5. retains valid pagination where required;
6. applies the page-type/facet decision;
7. serializes keys in stable order.

Canonical URLs must be absolute in emitted HTML. Internal application contracts store canonical paths so environments do not hard-code a production host.

## 11. Structured-data relationship

- Product structured data appears on product detail pages and matches visible product/variant price, currency, availability, images, ratings, shipping, and returns.
- Product variants use the product-group relationship when implemented.
- Breadcrumb data matches visible hierarchy and canonical paths.
- Brand/category/search grids are not marked as a collection of merchant offers merely because product cards are visible.
- FAQ markup is considered only when current search-feature eligibility and content rules justify it; visible FAQ semantics remain useful independently.

## 12. Verification checklist

- one HTML canonical per indexable public page;
- no canonical references a redirect, 4xx, private, or different-intent page;
- sitemap includes only canonical, indexable, 200 URLs;
- robots meta and canonical are consistent with route policy;
- normalized URL is stable across server and client rendering;
- breadcrumb, internal links, sitemap, hreflang if introduced, and structured data use canonical slugs;
- pagination is reachable without JavaScript;
- arbitrary facet combinations do not enter the sitemap;
- legacy redirects have no loops or chains.

## Research references

- Google canonical consolidation: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google ecommerce URL structure: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
- Google faceted navigation: https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
- Google pagination and incremental loading: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- Google Product variants structured data: https://developers.google.com/search/docs/appearance/structured-data/product-variants
- Schema.org ProductGroup: https://schema.org/ProductGroup
