import type { JsonValue } from "./json-ld";

export class StructuredDataError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "StructuredDataError";
    this.code = code;
  }
}

export interface BrandSchemaInput {
  readonly name: string;
  readonly url?: string;
  readonly logo?: string;
}

export interface OfferSchemaInput {
  readonly url: string;
  readonly price: string;
  readonly priceCurrency: string;
  readonly availability?: string;
  readonly sku?: string;
  readonly priceValidUntil?: string;
  readonly shippingDetails?: Readonly<Record<string, JsonValue>>;
  readonly returnPolicy?: Readonly<Record<string, JsonValue>>;
}

export interface VerifiedAggregateRatingInput {
  readonly evidenceRef: string;
  readonly ratingValue: number;
  readonly ratingCount: number;
  readonly reviewCount: number;
  readonly bestRating: number;
  readonly worstRating: number;
}

export interface VerifiedReviewInput {
  readonly evidenceRef: string;
  readonly author: string;
  readonly ratingValue: number;
  readonly body?: string;
  readonly datePublished?: string;
}

export interface ProductVariantSchemaInput {
  readonly name: string;
  readonly url: string;
  readonly sku: string;
  readonly images?: readonly string[];
  readonly color?: string;
  readonly material?: string;
  readonly size?: string;
  readonly offer?: OfferSchemaInput;
}

export interface ProductSchemaInput {
  readonly id?: string;
  readonly url: string;
  readonly name: string;
  readonly description?: string;
  readonly images?: readonly string[];
  readonly sku?: string;
  readonly mpn?: string;
  readonly gtin?: string;
  readonly brand?: BrandSchemaInput;
  readonly productGroupId?: string;
  readonly variesBy?: readonly string[];
  readonly offer?: OfferSchemaInput;
  readonly variants?: readonly ProductVariantSchemaInput[];
  readonly aggregateRating?: VerifiedAggregateRatingInput;
  readonly reviews?: readonly VerifiedReviewInput[];
}

function requiredText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new StructuredDataError("missing-required-field", `${field} is required.`);
  return normalized;
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function validHttpUrl(value: string, field: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new StructuredDataError("invalid-url", `${field} must be an absolute URL.`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new StructuredDataError("invalid-url-scheme", `${field} must use HTTP or HTTPS.`);
  }
  return url.href;
}

function validDate(value: string | undefined, field: string): string | undefined {
  if (!value) return undefined;
  if (Number.isNaN(Date.parse(value))) {
    throw new StructuredDataError("invalid-date", `${field} must be a valid date.`);
  }
  return value;
}

function uniqueUrls(values: readonly string[] | undefined): readonly string[] | undefined {
  if (!values?.length) return undefined;
  const result = [...new Set(values.map((value) => validHttpUrl(value, "image")))];
  return result.length ? result : undefined;
}

function cleanObject(entries: Readonly<Record<string, unknown>>): Record<string, JsonValue> {
  const result: Record<string, JsonValue> = {};
  for (const [key, value] of Object.entries(entries)) {
    if (value === undefined) continue;
    result[key] = value as JsonValue;
  }
  return result;
}

export function buildBrand(input: BrandSchemaInput): Readonly<Record<string, JsonValue>> {
  return cleanObject({
    "@type": "Brand",
    name: requiredText(input.name, "brand.name"),
    url: input.url ? validHttpUrl(input.url, "brand.url") : undefined,
    logo: input.logo ? validHttpUrl(input.logo, "brand.logo") : undefined,
  });
}

export function buildOrganization(
  input: Readonly<{
    name: string;
    url: string;
    logo?: string;
    sameAs?: readonly string[];
    returnPolicy?: Readonly<Record<string, JsonValue>>;
    shippingService?: Readonly<Record<string, JsonValue>>;
  }>,
): Readonly<Record<string, JsonValue>> {
  const sameAs = input.sameAs?.length
    ? [...new Set(input.sameAs.map((value) => validHttpUrl(value, "organization.sameAs")))]
    : undefined;
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: requiredText(input.name, "organization.name"),
    url: validHttpUrl(input.url, "organization.url"),
    logo: input.logo ? validHttpUrl(input.logo, "organization.logo") : undefined,
    sameAs,
    hasMerchantReturnPolicy: input.returnPolicy,
    hasShippingService: input.shippingService,
  });
}

export function buildWebSite(
  input: Readonly<{
    name: string;
    url: string;
    searchUrlTemplate?: string;
  }>,
): Readonly<Record<string, JsonValue>> {
  const searchTemplate = optionalText(input.searchUrlTemplate);
  let validatedSearchTemplate: string | undefined;
  if (searchTemplate) {
    if (!searchTemplate.includes("{search_term_string}")) {
      throw new StructuredDataError(
        "invalid-search-template",
        "searchUrlTemplate must include {search_term_string}.",
      );
    }
    const placeholder = "seo-search-placeholder";
    validatedSearchTemplate = validHttpUrl(
      searchTemplate.replace("{search_term_string}", placeholder),
      "website.searchUrlTemplate",
    ).replace(placeholder, "{search_term_string}");
  }
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: requiredText(input.name, "website.name"),
    url: validHttpUrl(input.url, "website.url"),
    potentialAction: validatedSearchTemplate
      ? {
          "@type": "SearchAction",
          target: validatedSearchTemplate,
          "query-input": "required name=search_term_string",
        }
      : undefined,
  });
}

export function buildOffer(input: OfferSchemaInput): Readonly<Record<string, JsonValue>> {
  const currency = requiredText(input.priceCurrency, "offer.priceCurrency").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new StructuredDataError("invalid-currency", "Offer currency must be ISO 4217-like.");
  }
  const price = requiredText(input.price, "offer.price");
  if (!/^\d+(?:\.\d+)?$/.test(price)) {
    throw new StructuredDataError(
      "invalid-price",
      "Offer price must be a non-negative decimal string.",
    );
  }
  return cleanObject({
    "@type": "Offer",
    url: validHttpUrl(input.url, "offer.url"),
    price,
    priceCurrency: currency,
    availability: optionalText(input.availability),
    sku: optionalText(input.sku),
    priceValidUntil: validDate(input.priceValidUntil, "offer.priceValidUntil"),
    shippingDetails: input.shippingDetails,
    hasMerchantReturnPolicy: input.returnPolicy,
  });
}

function buildAggregateRating(
  input: VerifiedAggregateRatingInput | undefined,
): Readonly<Record<string, JsonValue>> | undefined {
  if (!input?.evidenceRef.trim()) return undefined;
  if (
    !Number.isFinite(input.ratingValue) ||
    !Number.isSafeInteger(input.ratingCount) ||
    !Number.isSafeInteger(input.reviewCount) ||
    input.ratingCount < 1 ||
    input.reviewCount < 0 ||
    input.bestRating <= input.worstRating ||
    input.ratingValue < input.worstRating ||
    input.ratingValue > input.bestRating
  ) {
    throw new StructuredDataError(
      "invalid-aggregate-rating",
      "Aggregate rating values are invalid.",
    );
  }
  return {
    "@type": "AggregateRating",
    ratingValue: input.ratingValue,
    ratingCount: input.ratingCount,
    reviewCount: input.reviewCount,
    bestRating: input.bestRating,
    worstRating: input.worstRating,
  };
}

function buildReview(input: VerifiedReviewInput): Readonly<Record<string, JsonValue>> | undefined {
  if (!input.evidenceRef.trim()) return undefined;
  if (!Number.isFinite(input.ratingValue)) {
    throw new StructuredDataError("invalid-review-rating", "Review rating must be finite.");
  }
  return cleanObject({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: requiredText(input.author, "review.author"),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.ratingValue,
    },
    reviewBody: optionalText(input.body),
    datePublished: validDate(input.datePublished, "review.datePublished"),
  });
}

function buildVariant(
  input: ProductVariantSchemaInput,
  groupId: string,
): Readonly<Record<string, JsonValue>> {
  return cleanObject({
    "@type": "Product",
    name: requiredText(input.name, "variant.name"),
    url: validHttpUrl(input.url, "variant.url"),
    sku: requiredText(input.sku, "variant.sku"),
    inProductGroupWithID: groupId,
    image: uniqueUrls(input.images),
    color: optionalText(input.color),
    material: optionalText(input.material),
    size: optionalText(input.size),
    offers: input.offer ? buildOffer(input.offer) : undefined,
  });
}

export function buildProduct(input: ProductSchemaInput): Readonly<Record<string, JsonValue>> {
  const name = requiredText(input.name, "product.name");
  const groupId = optionalText(input.productGroupId);
  const variants = groupId
    ? input.variants?.map((variant) => buildVariant(variant, groupId))
    : undefined;
  const reviews = input.reviews
    ?.map(buildReview)
    .filter((value): value is Readonly<Record<string, JsonValue>> => Boolean(value));
  const type = groupId ? "ProductGroup" : "Product";
  return cleanObject({
    "@context": "https://schema.org",
    "@type": type,
    "@id": input.id ? validHttpUrl(input.id, "product.id") : undefined,
    url: validHttpUrl(input.url, "product.url"),
    name,
    description: optionalText(input.description),
    image: uniqueUrls(input.images),
    sku: optionalText(input.sku),
    mpn: optionalText(input.mpn),
    gtin: optionalText(input.gtin),
    brand: input.brand ? buildBrand(input.brand) : undefined,
    productGroupID: groupId,
    variesBy: input.variesBy?.filter((value) => value.trim()),
    offers: input.offer ? buildOffer(input.offer) : undefined,
    hasVariant: variants?.length ? variants : undefined,
    aggregateRating: buildAggregateRating(input.aggregateRating),
    review: reviews?.length ? reviews : undefined,
  });
}

export interface BreadcrumbSchemaItemInput {
  readonly name: string;
  readonly url: string;
}

export function buildBreadcrumbList(
  items: readonly BreadcrumbSchemaItemInput[],
): Readonly<Record<string, JsonValue>> {
  if (!items.length) {
    throw new StructuredDataError("empty-breadcrumb", "BreadcrumbList requires at least one item.");
  }
  const seen = new Set<string>();
  const itemListElement = items.map((item, index) => {
    const url = validHttpUrl(item.url, "breadcrumb.url");
    if (seen.has(url)) {
      throw new StructuredDataError("duplicate-breadcrumb-url", "Breadcrumb URLs must be unique.");
    }
    seen.add(url);
    return {
      "@type": "ListItem",
      position: index + 1,
      name: requiredText(item.name, "breadcrumb.name"),
      item: url,
    };
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

export function buildItemList(
  input: Readonly<{
    name?: string;
    items: readonly Readonly<{ name: string; url: string }>[];
  }>,
): Readonly<Record<string, JsonValue>> {
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: optionalText(input.name),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: requiredText(item.name, "itemList.name"),
      url: validHttpUrl(item.url, "itemList.url"),
    })),
  });
}

export function buildCollectionPage(
  input: Readonly<{
    name: string;
    url: string;
    description?: string;
    itemList?: Readonly<Record<string, JsonValue>>;
  }>,
): Readonly<Record<string, JsonValue>> {
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: requiredText(input.name, "collection.name"),
    url: validHttpUrl(input.url, "collection.url"),
    description: optionalText(input.description),
    mainEntity: input.itemList,
  });
}

export function buildArticle(
  input: Readonly<{
    headline: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    description?: string;
    images?: readonly string[];
    authorName?: string;
  }>,
): Readonly<Record<string, JsonValue>> {
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: requiredText(input.headline, "article.headline"),
    url: validHttpUrl(input.url, "article.url"),
    datePublished: validDate(input.datePublished, "article.datePublished"),
    dateModified: validDate(input.dateModified, "article.dateModified"),
    description: optionalText(input.description),
    image: uniqueUrls(input.images),
    author: input.authorName
      ? { "@type": "Person", name: requiredText(input.authorName, "article.author") }
      : undefined,
  });
}

export function buildFaqPage(
  items: readonly Readonly<{ question: string; answer: string }>[],
): Readonly<Record<string, JsonValue>> {
  if (!items.length) throw new StructuredDataError("empty-faq", "FAQPage requires visible items.");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: requiredText(item.question, "faq.question"),
      acceptedAnswer: {
        "@type": "Answer",
        text: requiredText(item.answer, "faq.answer"),
      },
    })),
  };
}

export function buildMerchantReturnPolicy(
  input: Readonly<{
    applicableCountry: string;
    returnPolicyCategory: string;
    merchantReturnDays?: number;
    returnFees?: string;
    returnMethod?: readonly string[];
    policyUrl?: string;
  }>,
): Readonly<Record<string, JsonValue>> {
  const category = requiredText(input.returnPolicyCategory, "returnPolicy.category");
  if (category.endsWith("MerchantReturnFiniteReturnWindow")) {
    if (!Number.isSafeInteger(input.merchantReturnDays) || (input.merchantReturnDays ?? 0) < 0) {
      throw new StructuredDataError(
        "missing-return-window",
        "Finite return policy requires non-negative merchantReturnDays.",
      );
    }
  }
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "MerchantReturnPolicy",
    applicableCountry: requiredText(input.applicableCountry, "returnPolicy.country").toUpperCase(),
    returnPolicyCategory: category,
    merchantReturnDays: input.merchantReturnDays,
    returnFees: optionalText(input.returnFees),
    returnMethod: input.returnMethod?.filter((value) => value.trim()),
    merchantReturnLink: input.policyUrl
      ? validHttpUrl(input.policyUrl, "returnPolicy.policyUrl")
      : undefined,
  });
}

export function buildOfferShippingDetails(
  input: Readonly<{
    country: string;
    currency: string;
    rate: string;
    handlingDays?: Readonly<{ min: number; max: number }>;
    transitDays?: Readonly<{ min: number; max: number }>;
  }>,
): Readonly<Record<string, JsonValue>> {
  const currency = requiredText(input.currency, "shipping.currency").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new StructuredDataError("invalid-currency", "Shipping currency must be ISO 4217-like.");
  }
  if (!/^\d+(?:\.\d+)?$/.test(input.rate)) {
    throw new StructuredDataError("invalid-shipping-rate", "Shipping rate must be decimal text.");
  }
  const duration = (value: Readonly<{ min: number; max: number }> | undefined) => {
    if (!value) return undefined;
    if (
      !Number.isSafeInteger(value.min) ||
      !Number.isSafeInteger(value.max) ||
      value.min < 0 ||
      value.max < value.min
    ) {
      throw new StructuredDataError("invalid-shipping-duration", "Shipping duration is invalid.");
    }
    return {
      "@type": "QuantitativeValue",
      minValue: value.min,
      maxValue: value.max,
      unitCode: "DAY",
    };
  };
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: input.rate,
      currency,
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: requiredText(input.country, "shipping.country").toUpperCase(),
    },
    deliveryTime:
      input.handlingDays || input.transitDays
        ? cleanObject({
            "@type": "ShippingDeliveryTime",
            handlingTime: duration(input.handlingDays),
            transitTime: duration(input.transitDays),
          })
        : undefined,
  });
}
