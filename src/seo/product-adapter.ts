import type { Brand } from "../domain/catalog";
import type { Product, ProductVariant } from "../domain/product";
import type { ImageMedia, Money } from "../domain/shared";
import type { VerifiedCommerceSchemaFlags } from "../data/contracts/seo";
import { absoluteUrl, resolveSiteOrigin } from "./site-url";
import type { MetadataInput, RobotsDirective, SiteUrlOptions } from "./types";
import type {
  OfferSchemaInput,
  ProductSchemaInput,
  VerifiedAggregateRatingInput,
} from "./structured-data";
import type { JsonValue } from "./json-ld";

export interface ProductSeoAdapterOptions extends SiteUrlOptions {
  readonly flags: VerifiedCommerceSchemaFlags;
  readonly selectedVariantId?: string;
  readonly ratingEvidenceRef?: string;
  readonly isApprovedMedia?: (media: ImageMedia) => boolean;
  readonly shippingDetails?: Readonly<Record<string, JsonValue>>;
  readonly returnPolicy?: Readonly<Record<string, JsonValue>>;
  /** Explicit lifecycle approval; omitted means the page remains noindex. */
  readonly retainUnavailablePage?: boolean;
  /** Explicit lifecycle approval; omitted means the page remains noindex. */
  readonly retainDiscontinuedPage?: boolean;
}

export interface ProductSeoAdapterResult {
  readonly canonicalPath: string | null;
  readonly robots: RobotsDirective;
  readonly statusReason:
    | "active"
    | "unavailable"
    | "discontinued"
    | "non-public"
    | "invalid-contract";
  readonly metadata: MetadataInput | null;
  readonly productSchema: ProductSchemaInput | null;
}

const PRODUCT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function moneyToDecimal(money: Money): string | null {
  if (
    !Number.isSafeInteger(money.amountMinor) ||
    money.amountMinor < 0 ||
    !Number.isSafeInteger(money.fractionDigits) ||
    money.fractionDigits < 0 ||
    money.fractionDigits > 6 ||
    !/^[A-Za-z]{3}$/.test(money.currency)
  ) {
    return null;
  }
  if (money.fractionDigits === 0) return String(money.amountMinor);
  const scale = 10 ** money.fractionDigits;
  const whole = Math.floor(money.amountMinor / scale);
  const fractional = String(money.amountMinor % scale).padStart(money.fractionDigits, "0");
  return `${whole}.${fractional}`;
}

function schemaAvailability(variant: ProductVariant): string | undefined {
  const values: Partial<Record<ProductVariant["inventory"]["status"], string>> = {
    "in-stock": "https://schema.org/InStock",
    "low-stock": "https://schema.org/LimitedAvailability",
    "out-of-stock": "https://schema.org/OutOfStock",
    backorder: "https://schema.org/BackOrder",
    preorder: "https://schema.org/PreOrder",
  };
  return values[variant.inventory.status];
}

interface ApprovedImageRecord {
  readonly media: ImageMedia;
  readonly url: string;
}

function approvedImageRecords(
  product: Product,
  options: ProductSeoAdapterOptions,
): readonly ApprovedImageRecord[] {
  if (!options.flags.approvedMedia || !options.isApprovedMedia) return [];
  const origin = resolveSiteOrigin(options);
  return product.media.assets
    .filter((media): media is ImageMedia => media.type === "image")
    .filter(options.isApprovedMedia)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((media) => ({
      media,
      url: /^https?:\/\//i.test(media.url) ? media.url : absoluteUrl(origin, media.url),
    }));
}

function offerForVariant(
  variant: ProductVariant,
  productUrl: string,
  options: ProductSeoAdapterOptions,
  allowForStatus: boolean,
): OfferSchemaInput | undefined {
  if (!options.flags.offers || !allowForStatus) return undefined;
  const price = moneyToDecimal(variant.pricing.effectivePrice);
  if (!price) return undefined;
  const availability = schemaAvailability(variant);
  return {
    url: productUrl,
    price,
    priceCurrency: variant.pricing.effectivePrice.currency.toUpperCase(),
    availability,
    sku: variant.sku,
    priceValidUntil: variant.pricing.priceValidUntil,
    shippingDetails: options.flags.shipping ? options.shippingDetails : undefined,
    returnPolicy: options.flags.returns ? options.returnPolicy : undefined,
  };
}

function selectVariant(product: Product, selectedVariantId: string | undefined): ProductVariant | undefined {
  const selected = selectedVariantId
    ? product.variants.find((variant) => variant.id === selectedVariantId)
    : undefined;
  return selected ?? product.variants.find((variant) => variant.id === product.defaultVariantId);
}

function ratingInput(
  product: Product,
  options: ProductSeoAdapterOptions,
): VerifiedAggregateRatingInput | undefined {
  const summary = product.reviewSummary;
  if (!options.flags.ratings || !summary || !options.ratingEvidenceRef?.trim()) return undefined;
  return {
    evidenceRef: options.ratingEvidenceRef,
    ratingValue: summary.ratingValue,
    ratingCount: summary.ratingCount,
    reviewCount: summary.reviewCount,
    bestRating: summary.bestRating,
    worstRating: summary.worstRating,
  };
}

export function adaptProductToSeo(
  product: Product,
  brand: Brand,
  options: ProductSeoAdapterOptions,
): ProductSeoAdapterResult {
  const slug = product.identity.slug.trim();
  const name = product.content.name.default.trim();
  if (
    !PRODUCT_SLUG.test(slug) ||
    !name ||
    product.brandId !== brand.id ||
    product.variants.some((variant) => variant.productId !== product.identity.id)
  ) {
    return {
      canonicalPath: null,
      robots: "noindex,nofollow",
      statusReason: "invalid-contract",
      metadata: null,
      productSchema: null,
    };
  }

  if (product.status === "draft" || product.status === "archived") {
    return {
      canonicalPath: null,
      robots: "noindex,nofollow",
      statusReason: "non-public",
      metadata: null,
      productSchema: null,
    };
  }

  const canonicalPath = `/product/${slug}`;
  const productUrl = absoluteUrl(resolveSiteOrigin(options), canonicalPath);
  const variant = selectVariant(product, options.selectedVariantId);
  if (!variant) {
    return {
      canonicalPath: null,
      robots: "noindex,nofollow",
      statusReason: "invalid-contract",
      metadata: null,
      productSchema: null,
    };
  }

  const statusReason =
    product.status === "discontinued"
      ? "discontinued"
      : product.status === "unavailable"
        ? "unavailable"
        : "active";
  const robots: RobotsDirective =
    product.status === "unavailable"
      ? options.retainUnavailablePage === true
        ? "index,follow"
        : "noindex,follow"
      : product.status === "discontinued"
        ? options.retainDiscontinuedPage === true
          ? "index,follow"
          : "noindex,follow"
        : "index,follow";
  const approvedMedia = approvedImageRecords(product, options);
  const images = approvedMedia.length
    ? [...new Set(approvedMedia.map((item) => item.url))]
    : undefined;
  const primaryImage =
    approvedMedia.find((item) => item.media.id === product.media.primaryMediaId) ??
    approvedMedia[0];
  const allowOffer = product.status !== "discontinued";
  const selectedOffer = offerForVariant(variant, productUrl, options, allowOffer);
  const selectedPrice = selectedOffer?.price;
  const selectedCurrency = selectedOffer?.priceCurrency;

  const variants = product.variants.map((item) => {
    const itemUrl = productUrl;
    const labels = item.optionValues
      .map((option) => option.label.default.trim())
      .filter(Boolean);
    const itemImages = approvedMedia
      .filter((record) => item.mediaIds.includes(record.media.id))
      .map((record) => record.url);
    return {
      name: labels.length ? `${name} — ${labels.join(" / ")}` : name,
      url: itemUrl,
      sku: item.sku,
      images: itemImages.length ? itemImages : undefined,
      offer: offerForVariant(item, itemUrl, options, allowOffer),
    };
  });

  const description =
    product.content.shortDescription.default.trim() || product.content.description.default.trim();
  const metadata: MetadataInput = {
    pageType: "product",
    title: product.seo.title.trim() || name,
    description: product.seo.description.trim() || description,
    pathname: canonicalPath,
    canonical: canonicalPath,
    robots,
    image: primaryImage
      ? {
          url: primaryImage.url,
          alt: primaryImage.media.alt.trim() || name,
          width: primaryImage.media.dimensions.width,
          height: primaryImage.media.dimensions.height,
        }
      : undefined,
    productContext:
      selectedPrice && selectedCurrency
        ? {
            brand: brand.name,
            availability: selectedOffer?.availability,
            price: selectedPrice,
            currency: selectedCurrency,
          }
        : { brand: brand.name },
    modifiedTime: product.updatedAt,
    publishedTime: product.publishedAt,
  };

  const productSchema: ProductSchemaInput = {
    id: `${productUrl}#product`,
    url: productUrl,
    name,
    description: description || undefined,
    images,
    sku: product.identity.primarySku,
    mpn: product.identity.mpn,
    gtin: product.identity.gtin,
    brand: { name: brand.name },
    productGroupId: product.identity.productGroupId,
    variesBy: [...new Set(product.variants.flatMap((item) => item.optionValues.map((v) => v.optionKey)))],
    offer: selectedOffer,
    variants,
    aggregateRating: ratingInput(product, options),
  };

  return { canonicalPath, robots, statusReason, metadata, productSchema };
}
