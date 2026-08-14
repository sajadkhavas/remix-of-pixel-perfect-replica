import type { ProductCardViewModel } from "@/components/commerce/product-card-model";
import type { SearchFacetResult } from "@/data/contracts";
import type { Category } from "@/domain/catalog";
import {
  parseDiscoverySearch,
  serializeDiscoverySearch,
  type DiscoverySearchState,
  type DiscoverySeoDecision,
  type RawSearch,
  type SortValue,
} from "@/domain/search";

export const DEFAULT_DISCOVERY_SORT: SortValue = "newest";

export const DISCOVERY_SORT_OPTIONS: ReadonlyArray<Readonly<{ value: SortValue; label: string }>> =
  [
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

export type ValidatedDiscoverySearch = Partial<DiscoverySearchState>;

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
  readonly seo: DiscoverySeoDecision;
  readonly rankingSource: "fixture" | "text-score" | "search-service";
}

export interface DiscoveryServerResult {
  readonly data: DiscoveryLoadResult;
  readonly category: Category | null;
}

export function validatePublicDiscoverySearch(rawSearch: RawSearch): ValidatedDiscoverySearch {
  const state = parseDiscoverySearch(rawSearch, DEFAULT_DISCOVERY_SORT);
  const sort = DISCOVERY_SORT_OPTIONS.some((option) => option.value === state.sort)
    ? state.sort
    : DEFAULT_DISCOVERY_SORT;
  return { ...state, sort };
}

export function completeDiscoveryState(search: ValidatedDiscoverySearch): DiscoverySearchState {
  return {
    q: search.q,
    category: search.category,
    brand: search.brand ?? [],
    audience: search.audience ?? [],
    style: search.style ?? [],
    movement: search.movement ?? [],
    priceMin: search.priceMin,
    priceMax: search.priceMax,
    caseSize: search.caseSize ?? [],
    caseMaterial: search.caseMaterial ?? [],
    strapMaterial: search.strapMaterial ?? [],
    dialColor: search.dialColor ?? [],
    waterResistance: search.waterResistance ?? [],
    availability: search.availability ?? [],
    discount: search.discount ?? false,
    sort: search.sort ?? DEFAULT_DISCOVERY_SORT,
    page: search.page ?? 1,
    view: search.view ?? "grid",
  };
}

export function discoveryFilterLabel(value: string): string {
  return FILTER_LABELS[value] ?? value;
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
