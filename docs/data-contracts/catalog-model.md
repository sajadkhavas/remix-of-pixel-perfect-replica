# Catalog, Brand, Category, Collection, and Breadcrumb Contracts

## Brand

`Brand` uses a stable ID and slug, separates global and localized names, stores logo/hero assets with media metadata, and treats official status as evidence-backed. `productCount` is a calculated repository projection, not authored source data. Related articles are references by ID.

A brand landing page is indexable only when it has unique content and at least one valid product or durable editorial value. Empty and placeholder brand pages are noindex.

## Category

`Category` is a hierarchy node with parent/children IDs, depth, slug, localized title and intro, hero media, SEO fields, allowed filters/sorts, breadcrumb, indexability, and optional landing content.

Rules:

- a product may belong to multiple categories but has one primary category for breadcrumb hierarchy;
- public paths remain `/shop/$categorySlug`, independent of arbitrary internal nesting;
- relationships use IDs rather than embedded mutable child objects;
- available filters come from the category contract;
- a category landing page is indexable only when useful without active filters.

## Collection

A collection is a merchandised or brand-owned grouping. It is distinct from a navigational category and a taxonomy filter. Collection landing routes are deferred; adding them requires a URL-policy decision.

## Taxonomy definitions

Taxonomies carry a stable internal key, localized label, value type/cardinality, filter/sort flags, indexable-landing eligibility, structured-data relevance, priority, unknown-value behavior, and allowed values. Downstream features must not create new literal unions outside these contracts.

## Breadcrumb

`BreadcrumbItem` contains label, optional href, 1-based position, and current-page semantics. `createBreadcrumb` is the shared constructor. The same normalized data later feeds visible navigation and `BreadcrumbList` JSON-LD.

Examples:

- Home > Shop > Men > Product
- Home > Brands > Brand
- Home > Magazine > Article
- Home > Account > Orders > Order

Reference: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
