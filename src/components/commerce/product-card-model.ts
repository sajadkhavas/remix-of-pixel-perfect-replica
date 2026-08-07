import type { ProductBadge, ProductVariant } from "@/domain/product";

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
}

export interface LegacyWatchModel {
  readonly id: number;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly sale_price?: number;
  readonly image: string;
  readonly category: "luxury" | "sport" | "smart" | "classic";
  readonly caseMaterial?: string;
  readonly waterResistance?: string;
  readonly stock: number;
  readonly rating?: number;
  readonly review_count?: number;
  readonly isNew?: boolean;
  readonly isLimited?: boolean;
}

export function discountPercent(listAmount: number, saleAmount: number): number | undefined {
  if (listAmount <= 0 || saleAmount >= listAmount) return undefined;
  return Math.round((1 - saleAmount / listAmount) * 100);
}

export function legacyWatchToCardViewModel(
  watch: LegacyWatchModel,
  options: Readonly<{ includeRatings?: boolean }> = {},
): ProductCardViewModel {
  const salePrice = watch.sale_price;
  const currentPrice = salePrice ?? watch.price;
  const badges: ProductBadge[] = [];
  if (watch.isNew) badges.push("new");
  if (watch.isLimited) badges.push("limited-edition");
  if (salePrice) badges.push("sale");

  return {
    id: String(watch.id),
    routeId: String(watch.id),
    name: watch.name,
    brand: watch.brand,
    image: {
      src: watch.image,
      alt: watch.name,
      width: 800,
      height: 800,
    },
    price: {
      current: `${currentPrice.toLocaleString("fa-IR")} تومان`,
      previous: salePrice ? `${watch.price.toLocaleString("fa-IR")} تومان` : undefined,
      discountPercent: salePrice ? discountPercent(watch.price, salePrice) : undefined,
    },
    availability:
      watch.stock <= 0
        ? { status: "out-of-stock", label: "ناموجود", purchasable: false }
        : watch.stock < 3
          ? { status: "low-stock", label: "موجودی محدود", purchasable: true }
          : { status: "in-stock", label: "موجود", purchasable: true },
    badges,
    specs: [watch.caseMaterial, watch.waterResistance].filter((value): value is string =>
      Boolean(value?.trim()),
    ),
    rating:
      options.includeRatings && watch.rating && watch.review_count
        ? { value: watch.rating, count: watch.review_count }
        : undefined,
  };
}
