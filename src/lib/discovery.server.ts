import { productToCardViewModel } from "@/components/commerce/product-card-product-adapter";
import { FIXTURE_BRANDS } from "@/data/fixtures/brands";
import { FIXTURE_CATEGORIES } from "@/data/fixtures/categories";
import { FIXTURE_PRODUCTS } from "@/data/fixtures/products";
import type { Product } from "@/domain/product";
import { getDiscoverySeoDecision, type DiscoverySearchState } from "@/domain/search";
import type { Money } from "@/domain/shared";
import {
  DEFAULT_DISCOVERY_SORT,
  type DiscoveryLoadResult,
  type DiscoveryServerResult,
} from "@/lib/discovery";

function formatMoney(money: Money): string | null {
  if (!Number.isSafeInteger(money.amountMinor) || money.amountMinor < 0) return null;
  const amount = money.amountMinor / 10 ** money.fractionDigits;
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

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "en"));
}

function effectivePrice(product: Product): number {
  return (
    product.variants.find((variant) => variant.id === product.defaultVariantId)?.pricing
      .effectivePrice.amountMinor ?? Number.MAX_SAFE_INTEGER
  );
}

function activeDiscount(product: Product): number {
  const pricing = product.variants.find(
    (variant) => variant.id === product.defaultVariantId,
  )?.pricing;
  if (!pricing?.salePrice || pricing.listPrice.amountMinor <= 0) return 0;
  return (
    (pricing.listPrice.amountMinor - pricing.salePrice.amountMinor) / pricing.listPrice.amountMinor
  );
}

function specKeys(product: Product, key: string): readonly string[] {
  const specification = product.specificationValues.find((item) => item.key === key);
  if (!specification) return [];
  if (specification.filterValueKeys?.length) return specification.filterValueKeys;
  if (specification.value.type === "text") return [specification.value.value];
  if (specification.value.type === "number") return [String(specification.value.value)];
  if (specification.value.type === "list") return specification.value.values;
  return [];
}

function specNumbers(product: Product, key: string): readonly number[] {
  const specification = product.specificationValues.find((item) => item.key === key);
  return specification?.value.type === "number" ? [specification.value.value] : [];
}

function optionKeys(product: Product, key: string): readonly string[] {
  return product.variants.flatMap((variant) =>
    variant.optionValues
      .filter((option) => option.optionKey === key)
      .map((option) => option.valueKey),
  );
}

function hasAny(source: readonly string[], selected: readonly string[]): boolean {
  return selected.some((value) => source.includes(value));
}

function filterProducts(state: DiscoverySearchState): readonly Product[] {
  let items = FIXTURE_PRODUCTS.filter((product) => product.status === "active");

  if (state.q) {
    const query = state.q.toLocaleLowerCase("fa");
    items = items.filter((product) => {
      const brand = FIXTURE_BRANDS.find((item) => item.id === product.brandId);
      return [
        product.content.name.default,
        product.content.shortDescription.default,
        product.identity.slug,
        brand?.name ?? "",
        brand?.localizedName?.default ?? "",
      ].some((value) => value.toLocaleLowerCase("fa").includes(query));
    });
  }

  if (state.category) {
    const category = FIXTURE_CATEGORIES.find((item) => item.slug === state.category);
    items = category ? items.filter((product) => product.categoryIds.includes(category.id)) : [];
  }

  if (state.brand.length) {
    const brandIds = FIXTURE_BRANDS.filter((brand) => state.brand.includes(brand.slug)).map(
      (brand) => brand.id,
    );
    items = items.filter((product) => brandIds.includes(product.brandId));
  }
  if (state.audience.length)
    items = items.filter((product) => hasAny(product.audienceKeys, state.audience));
  if (state.style.length)
    items = items.filter((product) => hasAny(product.styleKeys, state.style));
  if (state.movement.length)
    items = items.filter((product) => state.movement.includes(product.movementKey));
  if (state.priceMin !== undefined)
    items = items.filter((product) => effectivePrice(product) >= state.priceMin!);
  if (state.priceMax !== undefined)
    items = items.filter((product) => effectivePrice(product) <= state.priceMax!);
  if (state.caseSize.length)
    items = items.filter((product) =>
      state.caseSize.some((value) => specNumbers(product, "case-diameter").includes(value)),
    );
  if (state.caseMaterial.length)
    items = items.filter((product) =>
      hasAny(specKeys(product, "case-material"), state.caseMaterial),
    );
  if (state.strapMaterial.length)
    items = items.filter((product) =>
      hasAny(specKeys(product, "strap-material"), state.strapMaterial),
    );
  if (state.dialColor.length)
    items = items.filter((product) =>
      hasAny(optionKeys(product, "dial-color"), state.dialColor),
    );
  if (state.waterResistance.length)
    items = items.filter((product) =>
      hasAny(specKeys(product, "water-resistance"), state.waterResistance),
    );
  if (state.discount) items = items.filter((product) => activeDiscount(product) > 0);
  if (state.availability.length) {
    items = items.filter((product) =>
      product.variants.some((variant) =>
        state.availability.includes(
          variant.inventory.status as (typeof state.availability)[number],
        ),
      ),
    );
  }

  const sorted = [...items];
  switch (state.sort) {
    case "price-asc":
      sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case "price-desc":
      sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case "discount":
      sorted.sort((a, b) => activeDiscount(b) - activeDiscount(a));
      break;
    case "newest":
    default:
      sorted.sort((a, b) =>
        (b.releasedAt ?? b.publishedAt ?? b.createdAt).localeCompare(
          a.releasedAt ?? a.publishedAt ?? a.createdAt,
        ),
      );
      break;
  }

  return sorted;
}

export async function loadDiscoveryServer(input: {
  readonly state: DiscoverySearchState;
  readonly categorySlug?: string;
}): Promise<DiscoveryServerResult> {
  const categories = FIXTURE_CATEGORIES.filter((item) => item.depth === 1);
  const category = input.categorySlug
    ? (categories.find((item) => item.slug === input.categorySlug) ?? null)
    : null;
  const state = category ? { ...input.state, category: category.slug } : input.state;
  const filtered = filterProducts(state);
  const pageSize = 24;
  const page = Math.max(1, state.page);
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const brandNames = new Map(
    FIXTURE_BRANDS.map((brand) => [brand.id, brand.localizedName?.default ?? brand.name] as const),
  );
  const activeProducts = FIXTURE_PRODUCTS.filter((product) => product.status === "active");

  const data: DiscoveryLoadResult = {
    cards: pageItems.map((product) =>
      productToCardViewModel(product, brandNames.get(product.brandId) ?? "—", formatMoney),
    ),
    facets: [
      {
        filterKey: "brand",
        buckets: FIXTURE_BRANDS.map((brand) => ({
          valueKey: brand.slug,
          count: filtered.filter((product) => product.brandId === brand.id).length,
          selected: state.brand.includes(brand.slug),
        })),
      },
    ],
    categories,
    options: {
      audience: unique(activeProducts.flatMap((product) => product.audienceKeys)),
      style: unique(activeProducts.flatMap((product) => product.styleKeys)),
      movement: unique(activeProducts.map((product) => product.movementKey)),
      caseMaterial: unique(
        activeProducts.flatMap((product) => specKeys(product, "case-material")),
      ),
      dialColor: unique(activeProducts.flatMap((product) => optionKeys(product, "dial-color"))),
      waterResistance: unique(
        activeProducts.flatMap((product) => specKeys(product, "water-resistance")),
      ),
    },
    page,
    pageSize,
    totalItems: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    seo: getDiscoverySeoDecision(state, DEFAULT_DISCOVERY_SORT),
    rankingSource: "fixture",
  };

  return { data, category };
}
