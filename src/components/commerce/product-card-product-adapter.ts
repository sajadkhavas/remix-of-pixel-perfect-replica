import type { Money } from "@/domain/shared";
import type { Product, ProductInventory } from "@/domain/product";
import { getDefaultVariant, isPurchasableVariant, isValidPricing } from "@/domain/product";

import {
  discountPercent,
  type ProductCardAvailabilityModel,
  type ProductCardViewModel,
} from "./product-card-model";

export type MoneyFormatter = (money: Money) => string | null;

function availabilityLabel(inventory: ProductInventory): string {
  switch (inventory.status) {
    case "out-of-stock":
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

export function productToCardViewModel(
  product: Product,
  brandName: string,
  formatMoney: MoneyFormatter,
  options: Readonly<{ includeRatings?: boolean }> = {},
): ProductCardViewModel {
  const variant = getDefaultVariant(product);
  const pricingValid = variant ? isValidPricing(variant.pricing) : false;
  const primaryImage = product.media.assets.find(
    (asset) => asset.type === "image" && asset.id === product.media.primaryMediaId,
  );

  const price = variant && pricingValid
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
    variant && product.status === "active" && pricingValid
      ? {
          status: variant.inventory.status,
          label: availabilityLabel(variant.inventory),
          purchasable: isPurchasableVariant(variant),
        }
      : { status: "unknown", label: "ناموجود", purchasable: false };

  return {
    id: product.identity.id,
    routeId: product.identity.id,
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
    specs: product.specificationValues
      .filter((specification) => specification.value.type === "text")
      .slice(0, 2)
      .map((specification) =>
        specification.value.type === "text" ? specification.value.value : "",
      )
      .filter(Boolean),
    rating:
      options.includeRatings && product.reviewSummary
        ? {
            value: product.reviewSummary.ratingValue,
            count: product.reviewSummary.reviewCount,
          }
        : undefined,
  };
}
