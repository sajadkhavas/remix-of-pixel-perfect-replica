# F13A Current Technical SEO Audit

## Audit identity

- Phase: F13A — Technical SEO Infrastructure
- Repository: `sajadkhavas/remix-of-pixel-perfect-replica`
- Baseline: `integration/front-200@b0d8e9ba1d0156d18ccb68258a9a650490931d89`
- Audit date: 2026-08-06
- Governing decisions: `docs/front-overhaul/GATE_1_REVIEW.md`, accepted F2 URL/domain contracts, then accepted F1 content intent.
- Official catalog family: `/shop` only.

This audit describes the reviewed baseline. It does not authorize changing route files in F13A.

## Executive result

The baseline has basic route-level titles and descriptions, but it does not yet have a shared technical SEO layer. Canonical generation, URL normalization, robots metadata, sitemap generation, JSON-LD, product/offer evidence gates, breadcrumb schema, environment policy, and machine-readable SEO validation are absent or ad hoc. Several visible claims and prototype commerce values are not approved as production evidence.

The principal release risk is inconsistency: each later page phase could otherwise invent its own canonical, robots, metadata, schema, or URL behavior. F13A resolves this with pure typed builders that page owners can consume without changing route ownership.

## Source-of-truth reconciliation

1. Gate 1 and F2 establish `/shop` as the only catalog family.
2. Old F1 planning rows containing `/watches` retain their keyword/content intent only; their URL is superseded by the equivalent `/shop` route.
3. `/watches` must not appear in canonicals, sitemaps, internal links, or redirects unless future production-history evidence proves it was actually published and a supervisor explicitly approves migration.
4. Product, Brand, Category, Search, Money, Inventory, Variant, Media, and evidence fields come from F2 contracts.
5. Store identity, production origin, organization facts, supported locales, and policy configuration remain an F12 dependency.

## Baseline findings

| Area                          | Baseline observation                                                                                                                  | Risk                                                                                                              | F13A response                                                                                                                         | Owner that integrates it       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Root metadata                 | `src/routes/__root.tsx` declares a global title, description, Open Graph title/description/type, and Twitter card directly.           | Global copy can conflict with route metadata; unsupported authenticity/originality claims can leak to every page. | Typed Metadata Factory, duplicate registry, explicit page inputs, no implicit commercial claims.                                      | F4                             |
| Route metadata                | Routes such as `/shop`, product, cart, about, brands, blog, FAQ, contact, and services define partial `head()` objects independently. | Missing fields and inconsistent conventions; no reusable title template or validation.                            | `createMetadataFactory` returns TanStack-compatible `title`, `meta`, and `links`.                                                     | F4–F11                         |
| Product route identity        | Prototype route is `/product/$id` and reads numeric fixture IDs.                                                                      | Non-canonical public identity; metadata and links can preserve temporary IDs.                                     | Product adapter only accepts an F2 product slug and emits `/product/$productSlug`. Redirect execution is deferred.                    | F7 + route migration owner     |
| Canonical                     | No shared canonical helper is present in Root or reviewed routes.                                                                     | Duplicate URL variants, tracking parameters, sort/filter variants, and pagination may compete.                    | Typed origin/path/query normalization and canonical builders.                                                                         | All page phases                |
| Site URL                      | Production origin is not represented by a reviewed shared SEO contract.                                                               | Hard-coded or guessed domains; invalid absolute canonical/OG/schema URLs.                                         | Production throws `missing-production-site-url`; F12/deployment must supply the origin.                                               | F12 → F4 integration           |
| Trailing slash                | No shared redirect/canonical normalizer.                                                                                              | `/shop` and `/shop/` may become separate crawlable forms.                                                         | Root-only slash policy: `/` keeps slash; all other canonical paths are slashless.                                                     | Integration/edge owner         |
| Path case and encoding        | No shared encoded-slug safety boundary.                                                                                               | Mixed case, malformed encoding, encoded separators, or unstable Unicode path identity.                            | Lowercase ASCII segment policy; malformed encoding, dot segments, encoded slash/backslash, and control characters rejected.           | Route/edge owner               |
| Query ordering                | F2 discovery serializer is stable, but no generic canonical query builder exists.                                                     | Metadata/sitemap builders could serialize params differently.                                                     | Stable key/value ordering and allowlisted canonical params.                                                                           | F6 and sitemap integration     |
| Tracking parameters           | No shared removal helper.                                                                                                             | `utm_*`, `gclid`, and `fbclid` may enter canonicals/internal links.                                               | Explicit removal and clean canonical generation.                                                                                      | All phases                     |
| Invalid parameters            | Existing `/shop` state is local React state rather than route search state.                                                           | Refresh/back-forward/deep links do not govern discovery; future raw params could be indexed.                      | Indexability classifier treats unknown params as noindex and delegates normalized discovery state to F2.                              | F6                             |
| Search                        | No accepted `/search` route implementation is present. Shop contains a local text input.                                              | Internal search could be indexed or canonicalized to catalog pages incorrectly.                                   | `/search` is always `noindex,follow`; query/facets do not become canonical identity.                                                  | F6                             |
| Facets and sort               | Shop filter/sort state is local and metadata does not react to it.                                                                    | Arbitrary combinations can become crawl traps when URL-driven state is introduced.                                | Arbitrary facets and non-default sort/view are noindex with a clean canonical target.                                                 | F6                             |
| Pagination                    | No production pagination metadata/sitemap contract.                                                                                   | Page 2 may canonicalize incorrectly or disappear from crawl paths.                                                | Valid clean listing pagination self-canonicalizes; `page=1` is omitted.                                                               | F6/F11                         |
| Robots metadata               | Cart and other mutable/private routes only set titles; no route-level robots metadata.                                                | Transactional/private pages may be indexable by default.                                                          | Classifier: cart/wishlist/compare `noindex,follow`; checkout/account `noindex,nofollow`.                                              | F9/F10                         |
| Robots.txt                    | No reviewed pure environment policy/generator.                                                                                        | Preview/staging could be indexed; production sitemap could be guessed.                                            | Preview/staging/development disallow all; production requires explicit origin and adds sitemap URL.                                   | Integration route owner        |
| Sitemap                       | No sitemap architecture or generator in baseline.                                                                                     | No controlled source for canonical/indexable URLs; filters/private pages could leak.                              | Pure grouped collections/index generator; duplicates, noncanonical, noindex, forbidden catalog family, and temporary images excluded. | Integration route owner        |
| JSON-LD                       | No JSON-LD builders or serializer.                                                                                                    | Every page could invent schema, expose unverified values, or introduce script-termination XSS.                    | Typed builders plus safe plain-object serializer with circular/prototype/value/depth controls and HTML-significant escaping.          | F4/F7/F11/F12                  |
| Organization/WebSite          | No evidence-aware builders.                                                                                                           | Store identity or official relationships could be invented in Root.                                               | Small structural inputs; no StoreSettings duplication; F12 supplies verified identity.                                                | F12 → F4                       |
| Product schema                | None. Product page shows fixture price, stock, rating, shipping, return, warranty, and authenticity copy.                             | Search schema could contradict visible/current operations or publish fabricated ratings/offers/policies.          | F2 Product adapter with explicit evidence flags; absent evidence means omitted properties.                                            | F7 + F12 policies              |
| Variants                      | Prototype Product metadata has no variant/SKU relationship.                                                                           | ProductGroup/Offer identity mismatch.                                                                             | Product adapter maps F2 product group, variants, SKU, inventory, media, and selected variant only when contracts are valid.           | F7                             |
| Ratings/reviews               | Prototype catalog contains fixture counts and ratings.                                                                                | AggregateRating/Review would be fabricated.                                                                       | Builders require evidence references; adapter defaults to omission.                                                                   | F7/review owner                |
| Price/availability            | Prototype data is static fixture data.                                                                                                | Offer markup could publish stale or fictional commerce facts.                                                     | Offer requires explicit flag, valid Money/currency/variant, and current inventory contract; otherwise omitted.                        | F7/pricing owner               |
| Shipping/returns              | Prototype UI contains generic promises.                                                                                               | ShippingDetails/ReturnPolicy could become unsupported claims.                                                     | Schemas are only included when F12/operational policy supplies explicit verified objects and flags.                                   | F12/F7                         |
| Warranty                      | Prototype UI displays a generic warranty label.                                                                                       | Unsupported warranty claim.                                                                                       | Adapter does not invent warranty schema; future integration requires a reviewed evidence/config contract.                             | F12 dependency                 |
| Breadcrumb                    | Product has a visible manual breadcrumb with category key text; no shared structured data.                                            | Visible hierarchy and schema may diverge; duplicate or relative URLs.                                             | Absolute breadcrumb builder, sequential positions, duplicate rejection, configurable Home, Product/Brand/Article helpers.             | F6/F7/F11                      |
| 404 and error                 | Root has UI components but no explicit SEO metadata integration.                                                                      | Error states may inherit indexable/global metadata.                                                               | F4 must use noindex metadata for not-found/error responses; classifier never marks malformed/unknown routes indexable.                | F4                             |
| Open Graph                    | Root and some routes provide partial OG fields; product uses a relative fixture image.                                                | Missing canonical OG URL, dimensions, alt, locale, or unapproved image.                                           | Metadata factory emits complete optional image descriptors only from provided data; validator rejects relative/invalid images.        | Page phases                    |
| Twitter                       | Root has only the card type.                                                                                                          | Page title/description/image can be stale or absent.                                                              | Factory emits title, description, card, image, and image alt consistently.                                                            | Page phases                    |
| Image alt contract            | F2 media has alt and dimensions, but route metadata bypasses the contract.                                                            | Missing/incorrect social and schema image semantics.                                                              | Product adapter accepts only approved F2 image media and preserves actual alt/dimensions.                                             | F7/F3A asset approval          |
| Duplicate titles/descriptions | No registry or release validation.                                                                                                    | Template copy can silently repeat across pages.                                                                   | Metadata registry warns on duplicate descriptions/canonicals; validator reports title/description limits.                             | Content/page phases + CI audit |
| Validation                    | No machine-readable SEO report.                                                                                                       | Regressions depend on manual review.                                                                              | Typed validators and `scripts/seo/validate-infrastructure.ts` output JSON and non-zero status on errors.                              | Integration/F14A               |

## Severity summary

### Release-blocking before production

- Production site URL and store identity are not yet supplied by F12.
- Root and page routes do not consume the new factory yet; that is intentionally deferred to owning phases.
- Private and transactional routes do not currently emit explicit noindex metadata.
- Product schema must remain disabled until operational prices, inventory, media approval, and evidence gates are connected.
- No executable sitemap/robots route exists; F13A deliberately provides only pure generators.
- Prototype authenticity, originality, shipping, return, warranty, ratings, reviews, prices, and stock are not approved evidence.

### High priority

- Migrate `/product/$id` to slug route in the owning route phase and apply the explicit legacy mapping policy.
- Migrate discovery state to F2 URL state and classify every normalized result.
- Add canonical and error/noindex metadata to all implemented routes.
- Reconcile old F1 `/watches` rows at consumption time to `/shop`; do not edit F1-owned documents in this phase.

### Medium priority

- Connect approved Open Graph images and actual dimensions after F3A asset clearance.
- Generate breadcrumb schema beside visible breadcrumbs.
- Build sitemap collections from repositories after route/data ownership is integrated.
- Add release-level duplicate-title/description/canonical manifests.

## Current indexability expectation

| URL family                                     | Expected policy                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `/`, `/shop`                                   | index when complete and canonical                                    |
| nine curated `/shop/*` landings                | index only when useful content and inventory thresholds are approved |
| `/brands/$brandSlug`, `/product/$productSlug`  | index only with valid normalized entities                            |
| `/magazine/$articleSlug`, `/guides/$guideSlug` | index only when valid and published                                  |
| valid policy pages                             | index only with current approved content                             |
| `/search`, `/cart`, `/wishlist`, `/compare`    | `noindex,follow`                                                     |
| `/checkout`, `/account/*`                      | `noindex,nofollow`                                                   |
| arbitrary filter/sort/view URLs                | noindex; canonical follows F2 equivalence rules                      |
| `/watches` and descendants                     | forbidden; no canonical target generated by F13A                     |
| malformed/unknown URLs, 404, error             | noindex; no indexable canonical                                      |

## Research basis

- TanStack Router document head management: https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management
- TanStack Start SSR: https://tanstack.com/start/latest/docs/framework/react/guide/ssr
- Google canonical guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google faceted navigation: https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
- Google robots meta: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Product and variants: https://developers.google.com/search/docs/appearance/structured-data/product and https://developers.google.com/search/docs/appearance/structured-data/product-variants
- Google merchant return and shipping data: https://developers.google.com/search/docs/appearance/structured-data/return-policy and https://developers.google.com/search/docs/appearance/structured-data/shipping-policy
- Schema.org: https://schema.org/
