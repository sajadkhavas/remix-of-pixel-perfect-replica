# Product Domain Model

## Boundary

The normalized `Product` entity lives in `src/domain/product` and has no React, JSX, route, or transport dependency. API DTOs live separately in `src/data/contracts`; every future API adapter must validate a DTO and normalize it before a repository returns a domain entity.

## Identity

- `identity.id` is an internal immutable entity ID.
- `identity.slug` is the public URL identity.
- `productGroupId` groups variants for structured data and commerce feeds.
- SKU belongs to a sellable variant; `primarySku` is optional convenience metadata.
- ID changes never drive public redirects; slug changes require redirect records.

## Price model

`Money.amountMinor` is an integer in the currency's smallest unit and is never formatted inside the domain. `fractionDigits` makes the unit explicit. All values in one `ProductPricing` record must share currency and fraction digits.

Rules:

1. `listPrice >= salePrice` when a sale exists.
2. `effectivePrice` equals `salePrice` when present, otherwise `listPrice`.
3. Sale validity is data, not UI copy.
4. Percentage labels are derived.
5. Tax inclusion is explicit.
6. Currency conversion is outside the Product entity.

## Inventory model

Inventory is an operational state, not a boolean. It includes tracking policy, status, available/reserved/incoming quantities, restock date, backorderability, minimum/maximum order quantity, and increment. A later adapter may project multiple stock locations into this storefront record.

## Variants

A variant is the sellable unit and may define its own SKU/barcode, option values, price, inventory, media, status, and physical attributes. Cart lines reference both `productId` and `variantId`. A product with one configuration still owns one default variant.

## Media

Every asset has a type, stable ID, dimensions, alt text, order, and role. Variant media links by media ID. UI code must not derive alt text from filenames.

## Content and technical data

Localized marketing copy lives under `ProductContent`. Filterable technical values use `ProductSpecification` and language-neutral taxonomy keys. Persian labels are localized copy, not technical identifiers.

## Trust and policies

Shipping, returns, and warranty have typed records. Authenticity and “official” claims are not free-form product copy; products reference evidence records that a later trust repository will own.

## DTO normalization

Transport DTO fields are `unknown` at the boundary. Adapters must perform runtime validation, normalize IDs/slugs/money/dates, reject invalid required data, and return only a valid normalized entity. F2 installs no new validation dependency; Zod already exists in the repository and may be used by a later adapter phase.

## Structured data mapping

- Single sellable product: `Product` + `Offer`.
- Product with meaningful variants: `ProductGroup` plus associated variant `Product` records.
- Price, currency, availability, SKU, brand, image, rating, shipping and returns must reflect visible page data.
- Category/list pages do not emit merchant Product markup for every card.

References:

- Google Product variants: https://developers.google.com/search/docs/appearance/structured-data/product-variants
- Google Merchant listing: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Schema.org Product: https://schema.org/Product
- Schema.org Offer: https://schema.org/Offer
- commercetools product modeling: https://docs.commercetools.com/learning-model-your-product-catalog/product-modeling/products
- Medusa pricing concepts: https://docs.medusajs.com/resources/commerce-modules/pricing/concepts
