import type { DateRange, EntityId, ISODateTime, LocalizedText, MediaAsset, Money, SEOFields, Slug } from "../shared";

export type ProductStatus = "draft" | "active" | "unavailable" | "discontinued" | "archived";
export type ProductBadge = "new" | "limited-edition" | "exclusive" | "sale" | "preorder";
export type ProductCondition = "new" | "refurbished" | "used";

export interface ProductIdentity {
  readonly id: EntityId;
  readonly slug: Slug;
  readonly productGroupId: string;
  readonly primarySku?: string;
  readonly gtin?: string;
  readonly mpn?: string;
}

export interface ProductContent {
  readonly name: LocalizedText;
  readonly shortDescription: LocalizedText;
  readonly description: LocalizedText;
  readonly highlights: readonly LocalizedText[];
}

export interface ProductMedia {
  readonly assets: readonly MediaAsset[];
  readonly primaryMediaId: EntityId;
}

export interface PriceAdjustment {
  readonly type: "percentage" | "fixed";
  readonly value: number;
  readonly label?: string;
  readonly validity?: DateRange;
}

export interface ProductPricing {
  readonly listPrice: Money;
  readonly salePrice?: Money;
  readonly effectivePrice: Money;
  readonly taxIncluded: boolean;
  readonly priceValidUntil?: ISODateTime;
  readonly adjustment?: PriceAdjustment;
}

export type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock" | "backorder" | "preorder" | "not-tracked";

export interface ProductInventory {
  readonly tracking: "tracked" | "not-tracked";
  readonly status: InventoryStatus;
  readonly availableQuantity?: number;
  readonly reservedQuantity?: number;
  readonly incomingQuantity?: number;
  readonly restockAt?: ISODateTime;
  readonly backorderable: boolean;
  readonly minOrderQuantity: number;
  readonly maxOrderQuantity?: number;
  readonly orderIncrement: number;
}

export interface ProductOptionValue {
  readonly optionKey: string;
  readonly valueKey: string;
  readonly label: LocalizedText;
}

export interface ProductVariant {
  readonly id: EntityId;
  readonly productId: EntityId;
  readonly slug?: Slug;
  readonly sku: string;
  readonly barcode?: string;
  readonly optionValues: readonly ProductOptionValue[];
  readonly pricing: ProductPricing;
  readonly inventory: ProductInventory;
  readonly mediaIds: readonly EntityId[];
  readonly status: "active" | "unavailable" | "discontinued";
  readonly weightGrams?: number;
  readonly isDefault: boolean;
}

export interface ProductSpecification {
  readonly key: string;
  readonly label: LocalizedText;
  readonly value:
    | Readonly<{ type: "text"; value: string }>
    | Readonly<{ type: "number"; value: number; unit?: string }>
    | Readonly<{ type: "boolean"; value: boolean }>
    | Readonly<{ type: "list"; values: readonly string[] }>;
  readonly group: "movement" | "case" | "dial" | "strap" | "dimensions" | "features" | "compatibility" | "other";
  readonly filterValueKeys?: readonly string[];
  readonly sortOrder: number;
}

export interface ReviewSummary {
  readonly ratingValue: number;
  readonly ratingCount: number;
  readonly reviewCount: number;
  readonly bestRating: number;
  readonly worstRating: number;
}

export interface Review {
  readonly id: EntityId;
  readonly productId: EntityId;
  readonly authorDisplayName: string;
  readonly rating: number;
  readonly title?: string;
  readonly body: string;
  readonly createdAt: ISODateTime;
  readonly status: "pending" | "published" | "rejected";
  readonly verifiedPurchase: boolean;
}

export interface ShippingInfo {
  readonly shippable: boolean;
  readonly dispatchEstimateDays?: Readonly<{ min: number; max: number }>;
  readonly freeShippingThreshold?: Money;
  readonly restrictions?: readonly string[];
}

export interface ReturnPolicy {
  readonly returnable: boolean;
  readonly windowDays?: number;
  readonly conditionSummary?: LocalizedText;
  readonly policyPagePath: string;
}

export interface WarrantyInfo {
  readonly type: "manufacturer" | "seller" | "international" | "none";
  readonly durationMonths?: number;
  readonly providerName?: string;
  readonly coverageSummary?: LocalizedText;
  readonly policyPagePath?: string;
}

export interface Product {
  readonly schemaVersion: 1;
  readonly identity: ProductIdentity;
  readonly status: ProductStatus;
  readonly condition: ProductCondition;
  readonly content: ProductContent;
  readonly media: ProductMedia;
  readonly brandId: EntityId;
  readonly categoryIds: readonly EntityId[];
  readonly primaryCategoryId: EntityId;
  readonly collectionIds: readonly EntityId[];
  readonly audienceKeys: readonly string[];
  readonly styleKeys: readonly string[];
  readonly movementKey: string;
  readonly specificationValues: readonly ProductSpecification[];
  readonly variants: readonly ProductVariant[];
  readonly defaultVariantId: EntityId;
  readonly badges: readonly ProductBadge[];
  readonly reviewSummary?: ReviewSummary;
  readonly shipping: ShippingInfo;
  readonly returns: ReturnPolicy;
  readonly warranty: WarrantyInfo;
  readonly seo: SEOFields;
  readonly trustEvidenceRefs: readonly EntityId[];
  readonly releasedAt?: ISODateTime;
  readonly publishedAt?: ISODateTime;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}

export function isSameCurrency(a: Money, b: Money): boolean {
  return a.currency === b.currency && a.fractionDigits === b.fractionDigits;
}

export function isValidPricing(pricing: ProductPricing): boolean {
  if (!Number.isSafeInteger(pricing.listPrice.amountMinor) || pricing.listPrice.amountMinor < 0) return false;
  if (!Number.isSafeInteger(pricing.effectivePrice.amountMinor) || pricing.effectivePrice.amountMinor < 0) return false;
  if (!isSameCurrency(pricing.listPrice, pricing.effectivePrice)) return false;
  if (pricing.salePrice) {
    if (!isSameCurrency(pricing.listPrice, pricing.salePrice)) return false;
    if (pricing.salePrice.amountMinor > pricing.listPrice.amountMinor) return false;
    return pricing.effectivePrice.amountMinor === pricing.salePrice.amountMinor;
  }
  return pricing.effectivePrice.amountMinor === pricing.listPrice.amountMinor;
}

export function isPurchasableVariant(variant: ProductVariant): boolean {
  const stockAllowsPurchase = variant.inventory.tracking === "not-tracked" || variant.inventory.status !== "out-of-stock";
  return variant.status === "active" && isValidPricing(variant.pricing) && stockAllowsPurchase;
}

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  return product.variants.find((variant) => variant.id === product.defaultVariantId);
}
