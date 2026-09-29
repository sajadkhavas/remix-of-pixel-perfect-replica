import type { Money } from "@/domain/shared";
import type { Product, ProductInventory, ProductSpecification } from "@/domain/product";
import {
  getDefaultVariant,
  isInventoryStateConsistent,
  isPurchasableVariant,
  isValidPricing,
} from "@/domain/product";

import {
  discountPercent,
  type ProductCardAvailabilityModel,
  type ProductCardViewModel,
} from "./product-card-model";

export type MoneyFormatter = (money: Money) => string | null;

function availabilityLabel(inventory: ProductInventory): string {
  switch (inventory.status) {
    case "out-of-stock":
      return inventory.backorderable ? "قابل سفارش" : "ناموجود";
    case "backorder":
      return inventory.backorderable ? "قابل سفارش" : "ناموجود";
    case "low-stock":
      return "موجودی محدود";
    case "preorder":
      return "پیش‌خرید";
    case "in-stock":
    case "not-tracked":
      return "موجود";
  }
}

const SPEC_LABELS: Readonly<Record<string, string>> = {
  "stainless-steel": "استیل ضدزنگ",
  "stainless-steel-pvd": "استیل با پوشش PVD",
  "yellow-rolesor": "استیل و طلای زرد",
  aluminum: "آلومینیوم",
  titanium: "تیتانیوم",
  ceramic: "سرامیک",
  leather: "چرم",
  resin: "رزین",
  silicone: "سیلیکون",
};

function specValue(specification: ProductSpecification): string | null {
  const { value } = specification;
  if (value.type === "text") return SPEC_LABELS[value.value] ?? value.value;
  if (value.type === "number") {
    return `${value.value.toLocaleString("fa-IR")}${value.unit ? ` ${value.unit}` : ""}`;
  }
  if (value.type === "boolean") return value.value ? "بله" : "خیر";
  if (value.type === "list") {
    return value.values.map((item) => SPEC_LABELS[item] ?? item).join("، ");
  }
  return null;
}

export function productToCardViewModel(
  product: Product,
  brandName: string,
  formatMoney: MoneyFormatter,
  options: Readonly<{ includeRatings?: boolean }> = {},
): ProductCardViewModel {
  const variant = getDefaultVariant(product);
  const variantBelongsToProduct = variant?.productId === product.identity.id;
  const variantActive = variant?.status === "active";
  const inventoryConsistent = variant ? isInventoryStateConsistent(variant.inventory) : false;
  const pricingValid = variant ? isValidPricing(variant.pricing) : false;
  const primaryImage = product.media.assets.find(
    (asset) => asset.type === "image" && asset.id === product.media.primaryMediaId,
  );

  const price =
    variant && variantBelongsToProduct && pricingValid
      ? {
          current: formatMoney(variant.pricing.effectivePrice) ?? "",
          previous: variant.pricing.salePrice
            ? (formatMoney(variant.pricing.listPrice) ?? undefined)
            : undefined,
          discountPercent: variant.pricing.salePrice
            ? discountPercent(
                variant.pricing.listPrice.amountMinor,
                variant.pricing.salePrice.amountMinor,
              )
            : undefined,
        }
      : undefined;

  const availability: ProductCardAvailabilityModel =
    variant &&
    product.status === "active" &&
    variantBelongsToProduct &&
    variantActive &&
    inventoryConsistent &&
    pricingValid
      ? {
          status: variant.inventory.status,
          label: availabilityLabel(variant.inventory),
          purchasable: isPurchasableVariant(variant),
        }
      : { status: "unknown", label: "ناموجود", purchasable: false };

  const specs = [...product.specificationValues]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((specification) =>
      ["case-diameter", "case-material", "water-resistance"].includes(specification.key),
    )
    .slice(0, 2)
    .map(specValue)
    .filter((value): value is string => Boolean(value));

  return {
    id: product.identity.id,
    routeId: product.identity.slug,
    name: product.content.name.default,
    brand: brandName,
    image:
      primaryImage?.type === "image"
        ? {
            src: primaryImage.url,
            alt: primaryImage.alt,
            width: primaryImage.dimensions.width,
            height: primaryImage.dimensions.height,
          }
        : undefined,
    price: price?.current ? price : undefined,
    availability,
    badges: product.badges,
    specs,
    rating:
      options.includeRatings && product.reviewSummary
        ? {
            value: product.reviewSummary.ratingValue,
            count: product.reviewSummary.reviewCount,
          }
        : undefined,
    commerce:
      variant && variantBelongsToProduct && pricingValid
        ? {
            productId: product.identity.id,
            variantId: variant.id,
            productSlug: product.identity.slug,
            variantLabel:
              variant.optionValues.map((option) => option.label.default).join(" / ") || undefined,
            sku: variant.sku,
            unitPrice: variant.pricing.effectivePrice,
            minQuantity: variant.inventory.minOrderQuantity,
            maxQuantity: variant.inventory.maxOrderQuantity,
            increment: variant.inventory.orderIncrement,
            availableQuantity: variant.inventory.availableQuantity,
          }
        : undefined,
  };
}
