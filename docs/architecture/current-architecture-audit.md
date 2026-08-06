# F2 Current Storefront Architecture Audit

**Repository:** `sajadkhavas/remix-of-pixel-perfect-replica`  
**Baseline:** `main@0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c`  
**Audit scope:** information architecture, routes, catalog data, discovery state, commerce state, and SEO contracts.  
**Non-goal:** changing route components, visual design, or the current `StoreProvider`.

## Executive summary

The storefront is a compact TanStack Start prototype with working presentation routes and local fixture data. Its main architectural risk is inverted ownership: the catalog imports the `Watch` type from `ProductCard`, so a UI component is currently the source of truth for commerce data. Product URLs use numeric IDs, discovery state lives in component `useState`, and cart/wishlist persistence stores unvalidated product IDs without schema versioning. The current implementation is adequate for a visual prototype but not safe as the shared contract for parallel feature teams or a future API.

F2 introduces independent domain contracts under `src/domain`, repository boundaries under `src/data/contracts`, and replacement-ready fixtures under `src/data/fixtures`. Existing routes and components remain untouched.

## Current route inventory

| Current route file | Effective path | Current purpose | Main architectural issue |
|---|---|---|---|
| `index.tsx` | `/` | Homepage | Uses presentation sections and static catalog references without a page data contract. |
| `shop.tsx` | `/shop` | Catalog listing, text search, category filter, sort | Search, category, and sort are local React state; URL does not preserve discovery state. |
| `shop.$category.tsx` | `/shop/$category` | Category listing | Category accepts an unconstrained string; no shared taxonomy or indexability policy. |
| `product.$id.tsx` | `/product/$id` | Product detail | Numeric ID is exposed in the URL; no product slug, variant identity, canonical rule, or structured-data contract. |
| `brands.tsx` | `/brands` | Brand listing | No brand detail route or normalized brand entity. |
| `wishlist.tsx` | `/wishlist` | Local wishlist | Persists numeric product IDs only; no versioning, validation, or variant distinction. |
| `cart.tsx` | `/cart` | Local cart | Cart line is `{ id, qty }`; no variant, price snapshot, stock cap, currency, migration, or cross-tab contract. |
| `auth.tsx` | `/auth` | Authentication presentation | No public/private route policy or redirect contract. |
| `blog.tsx` | `/blog` | Editorial listing | Final IA requires `/magazine`; no article contract or redirect plan. |
| `about.tsx` | `/about` | Informational page | No shared page metadata policy. |
| `services.tsx` | `/services` | Services page | No content repository contract. |
| `faq.tsx` | `/faq` | FAQ page | No FAQ structured-data decision record. |
| `contact.tsx` | `/contact` | Contact page | No form/backend dependency contract. |
| `__root.tsx` | root shell | Layout and document shell | SEO defaults exist at route level but there is no URL policy shared by child routes. |

Missing final-architecture routes include `/search`, `/brands/$brandSlug`, compare, checkout, account subsections, magazine article routes, guides, policy pages, authenticity, warranty, shipping/returns, and payment information.

## Catalog and product model audit

### Current source of truth

`src/lib/catalog.ts` exports `CATALOG`, `CATEGORIES`, and `BRANDS`. It imports `Watch` from `src/components/ui/ProductCard.tsx`.

This creates a UI-to-data dependency:

```text
ProductCard.tsx owns Watch
        ↑
catalog.ts imports Watch
        ↑
routes import catalog
```

The desired direction is:

```text
domain contracts
    ↑          ↑
repositories  adapters
    ↑          ↑
routes       fixtures/API
    ↑
components receive view models
```

### Current `Watch` shape

The current type contains numeric `id`, display `name`, brand as free text, raw `price`, optional `sale_price`, one image, a four-category union, two optional specification strings, stock as a number, rating/review count, and `isNew` / `isLimited` booleans.

### Risks

1. **ID and URL identity are conflated.** Numeric IDs drive `/product/$id`; there is no stable public slug.
2. **Brand is denormalized text.** Brand pages cannot safely join products by ID; current matching derives a slug from the display name.
3. **Category is a UI-owned literal union.** Other dimensions—audience, movement, collection, material, size, color, and usage—have no shared taxonomy.
4. **No variants.** SKU, option combinations, per-variant images, prices, inventory, and availability cannot be represented.
5. **Price semantics are implicit.** The code assumes `sale_price` is active but has no currency code, validity period, tax policy, or validation.
6. **Inventory is under-modeled.** `stock` cannot distinguish tracked/untracked inventory, reservations, backorders, incoming stock, discontinued state, or per-order limits.
7. **Media is under-modeled.** No type, dimensions, ordering, alt contract, focal point, or variant association.
8. **Ratings are not separated from reviews.** There is no review entity, moderation state, or verified-purchase evidence.
9. **Trust claims are hard-coded in the PDP.** Authenticity, shipping, returns, and warranty copy is presented without data/evidence references.
10. **SEO metadata is assembled ad hoc in route files.** No reusable `SEOFields`, product status policy, canonical source, or structured-data mapping.
11. **No DTO/domain separation.** Future API payload changes would leak directly into UI code.
12. **No runtime validation boundary.** Fixture and persisted data are trusted after JSON parsing.

## Discovery, search, filter, and sort audit

`src/routes/shop.tsx` stores `q`, `cat`, and `sort` in local state. Consequences:

- refresh loses state;
- browser back/forward cannot restore filter changes;
- deep links to a filtered result set are impossible;
- canonical and noindex behavior cannot be derived consistently;
- invalid values have no parser/normalizer;
- parameter order and multi-value encoding are undefined;
- category and sort unions are duplicated locally;
- “newest” does not currently sort because there is no release/published date;
- “popular” uses review count as a proxy while the UI labels it “best selling,” which is a semantic mismatch;
- search has no repository boundary, result metadata, suggestion, or typo policy.

## Commerce state audit

`src/lib/store-context.tsx` defines `CartItem` as `{ id: number; qty: number }` and stores `kronos_cart` / `kronos_wishlist` directly in `localStorage`.

Risks:

- cart lines cannot distinguish variants;
- quantities can exceed stock;
- persisted JSON is cast without validation;
- no schema version or migration strategy;
- no product/variant existence reconciliation;
- no currency or price snapshot;
- monetary calculations are not centralized;
- no cross-tab synchronization;
- no compare/recently-viewed/coupon/shipping/checkout-draft contracts;
- UI notifications are coupled to state mutation.

F2 does not modify this context. The replacement contracts are designed for a later integration phase.

## Route and SEO audit

Current metadata provides titles and some descriptions, but the following policies are absent:

- lowercase and trailing-slash normalization;
- product, brand, category, and article canonical rules;
- query-parameter normalization;
- search results noindex;
- sort-only canonical stripping;
- faceted navigation crawl control;
- pagination canonical behavior;
- unavailable/discontinued/deleted product behavior;
- empty category behavior;
- duplicate slug redirects;
- tracking parameter stripping;
- account, cart, wishlist, compare, auth, and checkout noindex policy;
- breadcrumb data contract and JSON-LD mapping;
- redirect plan from `/blog` and `/product/$id`.

## Type and dependency audit

- `Watch` is defined in a React component.
- `Sort` is declared inside one route.
- category keys appear in data, components, links, colors, and route code.
- product lookup helpers accept unvalidated `number` or `string`.
- domain data imports bundled image modules directly.
- there is no repository interface, adapter, normalizer, or contract version.
- data contracts are not immutable and do not use `readonly`.
- optional fields are chosen by immediate UI needs rather than domain semantics.
- no discriminated unions model media, inventory, product status, or persistence migration.

## Baseline risk rating

| Area | Risk | Reason |
|---|---|---|
| Product identity | High | Public URLs use numeric IDs and no slug contract exists. |
| Variant readiness | Critical | Variants cannot be represented anywhere in product or cart state. |
| Discovery state | High | Local-only state breaks deep links, refresh, history, and SEO policy. |
| Pricing | High | Currency and validity semantics are absent. |
| Inventory | High | Single number is insufficient for stock and order rules. |
| Persistence | High | Unversioned and unvalidated localStorage. |
| SEO URL policy | High | No canonical/noindex decision system. |
| Fixtures/API migration | High | Routes consume static arrays directly. |
| UI coupling | High | UI component owns the catalog type. |
| Accessibility semantics | Medium | Breadcrumbs are ad hoc and stateful controls lack a common contract, but F2 does not alter UI. |

## F2 architectural response

F2 establishes independent domain contracts, separate DTO/domain boundaries, URL-driven discovery parsing and serialization, versioned commerce persistence, repository interfaces, replacement-ready fixtures, a final route/redirect map, canonical/noindex policy, and ADRs preventing downstream teams from creating incompatible local models.

## Deferred integration work

Later phases must replace the UI-owned `Watch`, migrate `/product/$id`, wire `validateSearch`, migrate `StoreProvider`, emit JSON-LD, implement redirects, connect backend/admin services, and perform visual or route-component changes.
