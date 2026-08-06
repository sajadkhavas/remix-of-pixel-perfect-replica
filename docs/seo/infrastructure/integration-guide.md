# F13A SEO Infrastructure Integration Guide

## Purpose

F13A supplies pure, typed, framework-compatible SEO infrastructure. It does not modify routes, Root, generated route trees, UI components, StoreSettings, or executable sitemap/robots endpoints. Page-owning phases consume these modules and submit their changes through normal integration review.

## Non-negotiable URL rule

The only catalog family is `/shop`.

Approved clean landings:

- `/shop/men`
- `/shop/women`
- `/shop/luxury`
- `/shop/classic`
- `/shop/sport`
- `/shop/smart`
- `/shop/automatic`
- `/shop/mechanical`
- `/shop/quartz`

Do not generate `/watches`, canonicalize to it, include it in a sitemap/internal link, or create a redirect merely because it appears in superseded F1 planning documents.

## Module map

| Module                                   | Responsibility                                                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/contracts/seo.ts`              | Small structural inputs for F12/deployment adapters; not a second StoreSettings model.                                           |
| `src/seo/site-url.ts`                    | Site origin, pathname/query normalization, tracking removal, absolute and canonical URL generation.                              |
| `src/seo/metadata.ts`                    | TanStack-compatible metadata factory and duplicate registry.                                                                     |
| `src/seo/indexability.ts`                | Route/indexability/canonical classification with reason codes.                                                                   |
| `src/seo/json-ld.ts`                     | Safe JSON-LD value boundary and serializer.                                                                                      |
| `src/seo/structured-data.ts`             | Organization, WebSite, Breadcrumb, Product, Offer, Brand, ItemList, CollectionPage, Article, FAQ, return, and shipping builders. |
| `src/seo/breadcrumbs.ts`                 | Visible/structured breadcrumb contract with absolute URLs and sequential positions.                                              |
| `src/seo/product-adapter.ts`             | F2 Product/Brand to metadata and Product/ProductGroup input, gated by evidence flags.                                            |
| `src/seo/sitemap.ts`                     | Pure sitemap collection/index construction and XML serialization.                                                                |
| `src/seo/robots.ts`                      | Environment-specific robots policy.                                                                                              |
| `src/seo/validation.ts`                  | Machine-readable metadata/schema/sitemap/canonical checks.                                                                       |
| `scripts/seo/validate-infrastructure.ts` | JSON manifest validation CLI for integration or later CI ownership.                                                              |

## Site runtime input

F13A intentionally requires a small structural object:

```ts
import type { SeoRuntimeInput } from "@/data/contracts/seo";

const seoRuntime: SeoRuntimeInput = {
  environment: deploymentEnvironment,
  site: {
    siteName: verifiedStoreName,
    defaultTitle: verifiedDefaultTitle,
    titleTemplate: "%s | KRONOS",
    defaultLocale: "fa_IR",
    siteUrl: verifiedPublicOrigin,
    defaultImage: approvedDefaultSocialImage,
  },
};
```

In production, an absent `siteUrl` throws a clear error. Never insert a guessed domain as a fallback.

## Metadata factory pattern

```ts
import { classifyIndexability, createMetadataFactory } from "@/seo";

const metadata = createMetadataFactory({
  environment: seoRuntime.environment,
  siteUrl: seoRuntime.site.siteUrl,
  siteName: seoRuntime.site.siteName,
  defaultTitle: seoRuntime.site.defaultTitle,
  titleTemplate: seoRuntime.site.titleTemplate,
  defaultDescription: approvedDefaultDescription,
  defaultLocale: seoRuntime.site.defaultLocale,
  defaultImage: seoRuntime.site.defaultImage,
});

const decision = classifyIndexability("/shop?page=2");
const result = metadata.build({
  pageType: decision.pageType,
  title: pageTitle,
  description: pageDescription,
  pathname: decision.canonicalPath ?? decision.normalizedPath,
  robots: decision.robots,
});

export const Route = createFileRoute("/shop")({
  head: () => result.head,
});
```

Use a registry for a route-manifest/release pass so duplicate descriptions and canonicals are surfaced. Runtime route calls can use a shared factory instance within one server request or a build-time manifest. Do not persist mutable registry state globally across unrelated server requests.

## Canonical rules for page phases

- Canonicals are absolute at output time and use the configured production origin.
- Only `/` retains a trailing slash.
- Paths are lowercase ASCII kebab-case.
- Tracking keys are removed.
- Invalid, unknown, default, sort, and view parameters are removed from canonical identity.
- Page 1 omits `page=1`; clean page 2+ self-canonicalizes.
- Search remains noindex and uses a clean search canonical only when appropriate.
- Arbitrary facets remain noindex and are never treated as curated landings.
- A Product canonical is `/product/$productSlug`, not a numeric ID or selected-variant query.

## Structured-data integration

Builders return plain JSON-safe objects. The safe serializer is the only approved boundary for script text:

```ts
import { buildOrganization, serializeJsonLd } from "@/seo";

const organization = buildOrganization({
  name: verifiedName,
  url: verifiedSiteUrl,
  logo: approvedLogoUrl,
  sameAs: verifiedProfiles,
});

const escapedJson = serializeJsonLd(organization);
```

The Root/page owner chooses the rendering mechanism. It must inject only `escapedJson`, not a raw `JSON.stringify` result or arbitrary user object. F13A does not add a Script component or use `dangerouslySetInnerHTML`.

### Evidence gates

Omit a property when its source is not verified. Do not emit zero or placeholder values.

| Property                            | Required source                                                  |
| ----------------------------------- | ---------------------------------------------------------------- |
| `AggregateRating` / `Review`        | Published review data plus evidence reference/count.             |
| `Offer.price` / currency            | Current operational variant pricing with a valid Money contract. |
| Availability                        | Current variant inventory state.                                 |
| Images                              | F3A/manifest production approval and matching product identity.  |
| Shipping details                    | F12/operational shipping configuration.                          |
| Return policy                       | Current approved policy/configuration.                           |
| Warranty or official brand relation | Explicit evidence/configuration; no generic prototype label.     |

## Product adapter pattern

```ts
const seo = adaptProductToSeo(product, brand, {
  environment: seoRuntime.environment,
  siteUrl: seoRuntime.site.siteUrl,
  selectedVariantId,
  retainUnavailablePage: lifecycleDecision.keepUnavailableIndexable,
  retainDiscontinuedPage: lifecycleDecision.keepDiscontinuedIndexable,
  isApprovedMedia: assetManifest.isProductionApproved,
  shippingDetails: verifiedShippingSchema,
  returnPolicy: verifiedReturnPolicySchema,
  flags: {
    offers: hasLivePricingAndInventory,
    ratings: hasPublishedRatingEvidence,
    reviews: hasPublishedReviewEvidence,
    shipping: hasVerifiedShippingPolicy,
    returns: hasVerifiedReturnPolicy,
    warranty: hasVerifiedWarrantyEvidence,
    approvedMedia: true,
  },
});
```

- Draft/archived/invalid products produce no public canonical or schema.
- Unavailable and discontinued products remain noindex until an explicit lifecycle decision keeps the page useful/indexable.
- Discontinued products never receive an Offer from this adapter.
- Deleted products are handled before adaptation: explicit equivalent replacement may redirect; otherwise return 410/404 according to the accepted policy.

## Breadcrumb integration

Create the visible breadcrumb model and structured data from the same call. Do not maintain separate arrays.

```ts
const breadcrumb = productBreadcrumbs(runtime, {
  categoryLabel,
  categoryPathname,
  productLabel: product.content.name.default,
  productPathname: `/product/${product.identity.slug}`,
});
```

The builder rejects empty labels and duplicate URLs and creates absolute schema URLs with correct positions. RTL is presentation-only; order remains semantic Home → parent → current page.

## Sitemap integration

F13A provides no executable route. The integration/route owner should:

1. Load canonical normalized entities through repositories.
2. Classify each URL and pass only valid candidates.
3. Build separate collections for static, products, categories, brands, magazine, and guides.
4. Serialize XML or build a sitemap index.
5. Include images only when `productionApproved` is true.
6. Exclude search, facets, sort/view variants, private/transactional routes, noncanonical URLs, `/watches`, and duplicates.
7. Supply `lastmod` only from a real timestamp; do not invent change frequency or priority.

## Robots integration

- Development, preview, and staging default to `Disallow: /`.
- Production requires a valid site URL and may add the production sitemap URL.
- Page-level noindex remains mandatory for private/mutable routes. Robots.txt is not a replacement for metadata.
- The executable `robots.txt` route remains Integration/F4 ownership.

## Phase consumption matrix

### F4 — Root, Navigation, global metadata

- Build the site-level metadata factory from the F12 adapter.
- Replace unverified Root claims with approved content.
- Emit Organization/WebSite schema only from verified identity.
- Integrate the safe serialized JSON-LD API.
- Apply explicit noindex metadata to Root 404/error responses.
- Ensure Navigation uses `/shop` exclusively.
- Own executable robots/sitemap endpoints only after integration approval.

### F5 — Homepage

- Build Home metadata through the factory.
- Use self canonical `/`.
- Use approved social image only.
- Add CollectionPage/ItemList only when the visible modules and entities match the schema.
- Do not emit Product offers for homepage cards.

### F6 — Shop, Search, Category

- Use F2 parser/serializer for discovery state.
- Feed normalized URL to `classifyIndexability`.
- Keep `/shop` and the nine approved clean landings only.
- Search, arbitrary facets, sort, and view remain noindex.
- Clean page 2+ self-canonicalizes.
- Build CollectionPage/ItemList only from visible canonical entities; do not mark search results as Product schema.

### F7 — Product

- Migrate to `/product/$productSlug` and repository-backed F2 entities.
- Use `adaptProductToSeo` and explicit evidence flags.
- Keep selected variant state under the product canonical unless a later approved URL decision changes it.
- Generate ProductGroup/variants, SKU, Brand, Offer, and availability only when current verified data exists.
- Use the shared breadcrumb builder.
- Do not publish fixture ratings, reviews, price, inventory, shipping, returns, warranty, or temporary images.

### F9 — Cart, Wishlist, Compare

- Use `noindex,follow` and clean self canonical.
- Never include product IDs/session state in canonical or sitemap.
- Do not emit Product/Offer structured data for mutable collections.

### F10 — Checkout and Account

- Use `noindex,nofollow`.
- Never put PII, return tokens, order IDs, or checkout state into public canonical/metadata/schema.
- Exclude all routes from sitemap.

### F11 — Brand, Magazine, Trust pages

- Brand pages require valid normalized Brand data and unique useful content.
- Articles/guides require valid published dates before indexability and Article schema.
- Trust/policy pages require approved current content.
- FAQPage is optional and only represents visible FAQ content; feature eligibility is not guaranteed by markup.
- Official brand relationships and policy claims require evidence.

### F12 — Organization and policy configuration

F12 owns store/deployment configuration. It should adapt its final settings to the small `SeoRuntimeInput`, `SeoOrganizationInput`, `SeoImageInput`, and evidence flags rather than importing or duplicating a large F13A StoreSettings model.

## Dependency request to F12

F13A requests the following reviewed values/interfaces:

- production public HTTPS origin;
- environment classification: production/staging/preview/development;
- verified store/site name, default title, title template, and locale;
- approved default Open Graph image with URL, alt, width, and height;
- verified Organization name, URL, logo, and social/profile URLs;
- supported locale/alternate mapping if hreflang is enabled;
- verified return-policy schema input;
- verified shipping-policy schema input;
- warranty evidence/config shape if schema integration is later approved;
- a clear boolean/evidence boundary for active prices, inventory, ratings, reviews, media, shipping, returns, and official relationships.

No import from the parallel F12 branch is allowed. Integration resolves the adapter after both branches are reviewed.

## Validation CLI

Prepare a JSON manifest and run:

```bash
bun scripts/seo/validate-infrastructure.ts path/to/seo-manifest.json
```

The command prints a machine-readable report and exits non-zero when errors exist. The manifest may contain `structuredData`, `canonicalEntries`, `sitemaps`, and `noindexUrls`. This script is an integration hook; adding it to a package script or workflow belongs to F14A/integration ownership.

## Release checklist

- [ ] One canonical for every indexable public page.
- [ ] `/shop` is the only catalog family.
- [ ] No `/watches` canonical, sitemap entry, internal link, or speculative redirect.
- [ ] Search/filter/sort/private routes have correct noindex directives.
- [ ] Production origin comes from F12/deployment and is not guessed.
- [ ] Metadata descriptions are unique or intentionally reviewed.
- [ ] OG image is absolute, approved, and has real dimensions/alt.
- [ ] JSON-LD is built from verified visible data and serialized safely.
- [ ] No rating/review/offer/shipping/return/warranty/official relation is invented.
- [ ] Breadcrumb visible hierarchy and schema share one source.
- [ ] Sitemap contains only canonical, indexable, 200-intended URLs.
- [ ] Preview/staging/development robots policy blocks indexing.
- [ ] SEO validation report has zero errors.
