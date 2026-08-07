import type { Money } from "@/domain/shared";
import type { Product, ProductVariant } from "@/domain/product";
import { getDefaultVariant } from "@/domain/product";

import {
  discountPercent,
  type ProductCardAvailabilityModel,
  type ProductCardViewModel,
} from "./product-card-model";

export type MoneyFormatter = (money: Money) => string | null;

function availabilityLabel(status: ProductVariant["inventory"]["status"]): string {
  switch (status) {
    case "out-of-stock":
      return "ناموجود";
    case "low-stock":
      return "موجودی محدود";
    case "preorder":
      return "پیش‌خرید";
    case "backorder":
      return "قابل سفارش";
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
  const primaryImage = product.media.assets.find(
    (asset) => asset.type === "image" && asset.id === product.media.primaryMediaId,
  );

  const price = variant
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

  const availability: ProductCardAvailabilityModel = variant
    ? {
        status: variant.inventory.status,
        label: availabilityLabel(variant.inventory.status),
        purchasable:
          variant.status === "active" &&
          (variant.inventory.status !== "out-of-stock" || variant.inventory.backorderable),
      }
    : { status: "unknown", label: "وضعیت نامشخص", purchasable: false };

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
