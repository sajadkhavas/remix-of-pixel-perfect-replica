import type { ProductBadge, ProductVariant } from "@/domain/product";
import type { Money } from "@/domain/shared";

export interface ProductCardImageModel {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface ProductCardPriceModel {
  readonly current: string;
  readonly previous?: string;
  readonly discountPercent?: number;
}

export interface ProductCardAvailabilityModel {
  readonly status: ProductVariant["inventory"]["status"] | "unknown";
  readonly label: string;
  readonly purchasable: boolean;
}

export interface ProductCardCommerceModel {
  readonly productId: string;
  readonly variantId: string;
  readonly productSlug: string;
  readonly variantLabel?: string;
  readonly sku: string;
  readonly unitPrice: Money;
  readonly minQuantity: number;
  readonly maxQuantity?: number;
  readonly increment: number;
  readonly availableQuantity?: number;
}

export interface ProductCardViewModel {
  readonly id: string;
  readonly routeId: string;
  readonly name: string;
  readonly brand: string;
  readonly image?: ProductCardImageModel;
  readonly price?: ProductCardPriceModel;
  readonly availability: ProductCardAvailabilityModel;
  readonly badges: readonly ProductBadge[];
  readonly specs: readonly string[];
  readonly rating?: Readonly<{ value: number; count: number }>;
  readonly commerce?: ProductCardCommerceModel;
}

export function discountPercent(listAmount: number, saleAmount: number): number | undefined {
  if (listAmount <= 0 || saleAmount >= listAmount) return undefined;
  return Math.round((1 - saleAmount / listAmount) * 100);
}
