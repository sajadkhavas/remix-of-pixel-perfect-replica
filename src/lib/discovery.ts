import type { ProductCardViewModel } from "@/components/commerce/product-card-model";
import { productToCardViewModel } from "@/components/commerce/product-card-product-adapter";
import type { SearchFacetResult } from "@/data/contracts";
import {
  FixtureBrandRepository,
  FixtureCatalogRepository,
  FixtureSearchRepository,
} from "@/data/fixtures/repositories";
import type { Category } from "@/domain/catalog";
import type { Product } from "@/domain/product";
import {
  getDiscoverySeoDecision,
  serializeDiscoverySearch,
  type DiscoverySearchState,
  type SortValue,
} from "@/domain/search";
import type { Money } from "@/domain/shared";

export const DEFAULT_DISCOVERY_SORT: SortValue = "newest";

export const DISCOVERY_SORT_OPTIONS: ReadonlyArray<
  Readonly<{ value: SortValue; label: string }>
> = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "کمترین قیمت" },
  { value: "price-desc", label: "بیشترین قیمت" },
  { value: "discount", label: "بیشترین تخفیف" },
];

export const AVAILABILITY_OPTIONS = [
  { value: "in-stock", label: "موجود" },
  { value: "low-stock", label: "موجودی محدود" },
  { value: "preorder", label: "پیش‌خرید" },
  { value: "backorder", label: "قابل سفارش" },
] as const;

const FILTER_LABELS: Readonly<Record<string, string>> = {
  unisex: "یونیسکس",
  men: "مردانه",
  women: "زنانه",
  luxury: "لوکس",
  classic: "کلاسیک",
  smart: "هوشمند",
  sport: "اسپرت",
  automatic: "اتوماتیک",
  mechanical: "مکانیکی",
  quartz: "کوارتز",
  solar: "سولار",
  "stainless-steel": "استیل",
  titanium: "تیتانیوم",
  ceramic: "سرامیک",
  gold: "طلا",
  blue: "آبی",
  black: "مشکی",
  white: "سفید",
  green: "سبز",
  silver: "نقره‌ای",
};

export function discoveryFilterLabel(value: string): string {
  return FILTER_LABELS[value] ?? value;
}

function formatMoney(money: Money): string | null {
  if (!Number.isSafeInteger(money.amountMinor) || money.amountMinor < 0) return null;
  const divisor = 10 ** money.fractionDigits;
  const amount = money.amountMinor / divisor;
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

function specKeys(product: Product, key: string): readonly string[] {
  const specification = product.specificationValues.find((item) => item.key === key);
  if (!specification) return [];
  if (specification.filterValueKeys?.length) return specification.filterValueKeys;
  if (specification.value.type === "text") return [specification.value.value];
  if (specification.value.type === "number") return [String(specification.value.value)];
  if (specification.value.type === "list") return specification.value.values;
  return [];
}

function optionKeys(product: Product, key: string): readonly string[] {
  return product.variants.flatMap((variant) =>
    variant.optionValues.filter((option) => option.optionKey === key).map((option) => option.valueKey),
  );
}

export interface DiscoveryFilterOptions {
  readonly audience: readonly string[];
  readonly style: readonly string[];
  readonly movement: readonly string[];
  readonly caseMaterial: readonly string[];
  readonly dialColor: readonly string[];
  readonly waterResistance: readonly string[];
}

export interface DiscoveryLoadResult {
  readonly cards: readonly ProductCardViewModel[];
  readonly facets: readonly SearchFacetResult[];
  readonly categories: readonly Category[];
  readonly options: DiscoveryFilterOptions;
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly seo: ReturnType<typeof getDiscoverySeoDecision>;
  readonly rankingSource: "fixture" | "text-score" | "search-service";
}

export async function loadDiscovery(state: DiscoverySearchState): Promise<DiscoveryLoadResult> {
  const searchRepository = new FixtureSearchRepository();
  const catalogRepository = new FixtureCatalogRepository();
  const brandRepository = new FixtureBrandRepository();

  const [searchResult, categories, brands, allProducts] = await Promise.all([
    searchRepository.search(state),
    catalogRepository.listCategories(),
    brandRepository.list(),
    catalogRepository.listProducts({
      includeUnavailable: false,
      page: { page: 1, pageSize: 500 },
    }),
  ]);

  const brandNames = new Map(
    brands.map((brand) => [brand.id, brand.localizedName?.default ?? brand.name] as const),
  );
  const cards = searchResult.products.items.map((product) =>
    productToCardViewModel(product, brandNames.get(product.brandId) ?? "—", formatMoney),
  );
  const activeProducts = allProducts.items;

  return {
    cards,
    facets: searchResult.facets,
    categories: categories.filter((category) => category.depth === 1),
    options: {
      audience: unique(activeProducts.flatMap((product) => product.audienceKeys)),
      style: unique(activeProducts.flatMap((product) => product.styleKeys)),
      movement: unique(activeProducts.map((product) => product.movementKey)),
      caseMaterial: unique(activeProducts.flatMap((product) => specKeys(product, "case-material"))),
      dialColor: unique(activeProducts.flatMap((product) => optionKeys(product, "dial-color"))),
      waterResistance: unique(
        activeProducts.flatMap((product) => specKeys(product, "water-resistance")),
      ),
    },
    page: searchResult.products.page,
    pageSize: searchResult.products.pageSize,
    totalItems: searchResult.products.totalItems,
    totalPages: searchResult.products.totalPages,
    seo: getDiscoverySeoDecision(state, DEFAULT_DISCOVERY_SORT),
    rankingSource: searchResult.rankingSource,
  };
}

export function withoutDiscoveryCategory(state: DiscoverySearchState): DiscoverySearchState {
  return { ...state, category: undefined };
}

export function patchDiscoveryState(
  state: DiscoverySearchState,
  patch: Partial<DiscoverySearchState>,
  options: Readonly<{ keepPage?: boolean }> = {},
): DiscoverySearchState {
  return {
    ...state,
    ...patch,
    page: options.keepPage ? (patch.page ?? state.page) : 1,
  };
}

export function toggleDiscoveryValue(values: readonly string[], value: string): readonly string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value].sort((a, b) => a.localeCompare(b, "en"));
}

export function discoveryHref(
  pathname: string,
  state: DiscoverySearchState,
  options: Readonly<{ stripCategory?: boolean }> = {},
): string {
  const urlState = options.stripCategory ? withoutDiscoveryCategory(state) : state;
  const search = serializeDiscoverySearch(urlState, DEFAULT_DISCOVERY_SORT);
  return `${pathname}${search ? `?${search}` : ""}`;
}

export function discoveryHiddenEntries(
  state: DiscoverySearchState,
  omittedKeys: readonly string[],
  options: Readonly<{ stripCategory?: boolean }> = {},
): readonly [string, string][] {
  const urlState = options.stripCategory ? withoutDiscoveryCategory(state) : state;
  const params = new URLSearchParams(serializeDiscoverySearch(urlState, DEFAULT_DISCOVERY_SORT));
  return [...params.entries()].filter(([key]) => !omittedKeys.includes(key));
}

export function activeDiscoveryFilterCount(state: DiscoverySearchState): number {
  return (
    (state.q ? 1 : 0) +
    state.brand.length +
    state.audience.length +
    state.style.length +
    state.movement.length +
    (state.priceMin !== undefined ? 1 : 0) +
    (state.priceMax !== undefined ? 1 : 0) +
    state.caseSize.length +
    state.caseMaterial.length +
    state.strapMaterial.length +
    state.dialColor.length +
    state.waterResistance.length +
    state.availability.length +
    (state.discount ? 1 : 0)
  );
}
