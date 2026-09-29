import { productToCardViewModel } from "@/components/commerce/product-card-product-adapter";
import { CATALOG_BRANDS } from "@/data/fixtures/brands";
import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";
import type { Product } from "@/domain/product";
import type { Money } from "@/domain/shared";
import type {
  ProductDetailData,
  ProductDetailRequest,
} from "@/lib/product-detail.functions";

const PRODUCT_ROUTE_ALIASES: Readonly<Record<string, string>> = {
  "tag-heuer-carrera-chronograph-cbs2210":
    "tag-heuer-carrera-cbs2210",
};

function formatMoney(money: Money): string | null {
  if (
    !Number.isSafeInteger(money.amountMinor) ||
    money.amountMinor < 0
  ) {
    return null;
  }

  const amount =
    money.amountMinor / 10 ** money.fractionDigits;

  try {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: money.currency,
      minimumFractionDigits: money.fractionDigits,
      maximumFractionDigits: money.fractionDigits,
    }).format(amount);
  } catch {
    return null;
  }
}

function resolveProduct(routeId: string): Product | null {
  const canonicalRouteId =
    PRODUCT_ROUTE_ALIASES[routeId] ?? routeId;

  return (
    CATALOG_PRODUCTS.find(
      (item) =>
        item.identity.id === canonicalRouteId ||
        item.identity.slug === canonicalRouteId,
    ) ?? null
  );
}

function relatedScore(
  source: Product,
  candidate: Product,
): number {
  let score = 0;

  if (
    candidate.primaryCategoryId ===
    source.primaryCategoryId
  ) {
    score += 8;
  }

  score +=
    candidate.styleKeys.filter((style) =>
      source.styleKeys.includes(style),
    ).length * 3;

  if (
    candidate.movementKey === source.movementKey
  ) {
    score += 2;
  }

  if (
    candidate.audienceKeys.some((audience) =>
      source.audienceKeys.includes(audience),
    )
  ) {
    score += 1;
  }

  return score;
}

export async function loadProductDetailServer(
  input: ProductDetailRequest,
): Promise<ProductDetailData | null> {
  const product = resolveProduct(input.id);

  if (
    !product ||
    product.status === "draft" ||
    product.status === "archived"
  ) {
    return null;
  }

  const brand =
    CATALOG_BRANDS.find(
      (item) => item.id === product.brandId,
    ) ?? null;

  const category =
    CATALOG_CATEGORIES.find(
      (item) =>
        item.id === product.primaryCategoryId &&
        item.depth === 1,
    ) ?? null;

  if (!category) {
    return null;
  }

  const relatedProducts = CATALOG_PRODUCTS.filter(
    (item) =>
      item.identity.id !== product.identity.id &&
      item.status === "active",
  )
    .map((item) => ({
      item,
      score: relatedScore(product, item),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.item.identity.id.localeCompare(
          b.item.identity.id,
        ),
    )
    .slice(0, 4)
    .map(({ item }) => item);

  const brandNames = new Map(
    CATALOG_BRANDS.map(
      (item) =>
        [
          item.id,
          item.localizedName?.default ??
            item.name,
        ] as const,
    ),
  );

  return {
    product,
    brand: brand
      ? {
          id: brand.id,
          slug: brand.slug,
          name:
            brand.localizedName?.default ??
            brand.name,
        }
      : null,
    category: {
      id: category.id,
      slug: category.slug,
      title: category.title.default,
    },
    relatedCards: relatedProducts.map((item) =>
      productToCardViewModel(
        item,
        brandNames.get(item.brandId) ?? "—",
        formatMoney,
        {
          includeRatings: Boolean(
            item.reviewSummary &&
              item.trustEvidenceRefs.length > 0,
          ),
        },
      ),
    ),
  };
}
