import type { ProductCardViewModel } from "@/components/commerce/product-card-model";
import type { SearchFacetResult } from "@/data/contracts";
import type { Category } from "@/domain/catalog";
import type { ProductInventory } from "@/domain/product";
import {
  parseDiscoverySearch,
  serializeDiscoverySearch,
  type DiscoverySearchState,
  type DiscoverySeoDecision,
  type RawSearch,
  type SortValue,
} from "@/domain/search";

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
  "digital-smart": "هوشمند دیجیتال",
  solar: "سولار",
  "stainless-steel": "استیل ضدزنگ",
  "stainless-steel-pvd": "استیل با پوشش PVD",
  "yellow-rolesor": "استیل و طلای زرد",
  champagne: "شامپاینی",
  titanium: "تیتانیوم",
  ceramic: "سرامیک",
  aluminum: "آلومینیوم",
  leather: "چرم",
  resin: "رزین",
  silicone: "سیلیکون",
  blue: "آبی",
  black: "مشکی",
  white: "سفید",
  green: "سبز",
  silver: "نقره‌ای",
  "space-gray": "خاکستری فضایی",
  "30m": "۳۰ متر",
  "50m": "۵۰ متر",
  "100m": "۱۰۰ متر",
  "200m": "۲۰۰ متر",
  "always-on-retina": "Always-On Retina",
  "iphone-11-or-later": "iPhone 11 یا جدیدتر",
  "ios-27-or-later": "iOS 27 یا جدیدتر",
};

export type ValidatedDiscoverySearch =
  Partial<DiscoverySearchState>;

export interface DiscoveryFilterOptions {
  readonly audience: readonly string[];
  readonly style: readonly string[];
  readonly movement: readonly string[];
  readonly caseSize: readonly number[];
  readonly caseMaterial: readonly string[];
  readonly strapMaterial: readonly string[];
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
  readonly rankingSource:
    | "fixture"
    | "text-score"
    | "search-service";
}

export interface DiscoveryServerResult {
  readonly data: DiscoveryLoadResult;
  readonly category: Category | null;
}

const ROUTER_LIST_SEARCH_KEYS = [
  "category",
  "brand",
  "audience",
  "style",
  "movement",
  "caseSize",
  "caseMaterial",
  "strapMaterial",
  "dialColor",
  "waterResistance",
  "availability",
] as const;

function normalizeRouterSearch(
  rawSearch: RawSearch,
): RawSearch {
  const normalized: Record<string, unknown> = {
    ...rawSearch,
  };

  for (const key of ROUTER_LIST_SEARCH_KEYS) {
    const value = normalized[key];

    if (typeof value !== "string") continue;

    const candidate = value.trim();

    if (
      !candidate.startsWith("[") ||
      !candidate.endsWith("]")
    ) {
      continue;
    }

    try {
      const parsed = JSON.parse(candidate);

      if (Array.isArray(parsed)) {
        normalized[key] = parsed
          .filter(
            (item): item is string | number =>
              typeof item === "string" ||
              typeof item === "number",
          )
          .join(",");
      }
    } catch {
      // The normal search parser safely ignores invalid values.
    }
  }

  return normalized;
}

export function validatePublicDiscoverySearch(
  rawSearch: RawSearch,
): ValidatedDiscoverySearch {
  const state = parseDiscoverySearch(
    normalizeRouterSearch(rawSearch),
    DEFAULT_DISCOVERY_SORT,
  );

  const sort = DISCOVERY_SORT_OPTIONS.some(
    (option) => option.value === state.sort,
  )
    ? state.sort
    : DEFAULT_DISCOVERY_SORT;

  return {
    ...(state.q ? { q: state.q } : {}),
    ...(state.category.length
      ? { category: state.category }
      : {}),
    ...(state.brand.length ? { brand: state.brand } : {}),
    ...(state.audience.length
      ? { audience: state.audience }
      : {}),
    ...(state.style.length ? { style: state.style } : {}),
    ...(state.movement.length
      ? { movement: state.movement }
      : {}),
    ...(state.priceMin !== undefined
      ? { priceMin: state.priceMin }
      : {}),
    ...(state.priceMax !== undefined
      ? { priceMax: state.priceMax }
      : {}),
    ...(state.caseSize.length
      ? { caseSize: state.caseSize }
      : {}),
    ...(state.caseMaterial.length
      ? { caseMaterial: state.caseMaterial }
      : {}),
    ...(state.strapMaterial.length
      ? { strapMaterial: state.strapMaterial }
      : {}),
    ...(state.dialColor.length
      ? { dialColor: state.dialColor }
      : {}),
    ...(state.waterResistance.length
      ? { waterResistance: state.waterResistance }
      : {}),
    ...(state.availability.length
      ? { availability: state.availability }
      : {}),
    ...(state.discount ? { discount: true } : {}),
    ...(sort !== DEFAULT_DISCOVERY_SORT
      ? { sort }
      : {}),
    ...(state.page > 1 ? { page: state.page } : {}),
    ...(state.view !== "grid"
      ? { view: state.view }
      : {}),
  };
}

export function completeDiscoveryState(
  search: ValidatedDiscoverySearch,
): DiscoverySearchState {
  return {
    q: search.q,
    category: search.category ?? [],
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

export function discoveryFilterLabel(
  value: string,
): string {
  return FILTER_LABELS[value] ?? value;
}

export function withoutDiscoveryCategory(
  state: DiscoverySearchState,
): DiscoverySearchState {
  return {
    ...state,
    category: [],
  };
}

export function patchDiscoveryState(
  state: DiscoverySearchState,
  patch: Partial<DiscoverySearchState>,
  options: Readonly<{ keepPage?: boolean }> = {},
): DiscoverySearchState {
  return {
    ...state,
    ...patch,
    page: options.keepPage
      ? (patch.page ?? state.page)
      : 1,
  };
}

export function toggleDiscoveryValue(
  values: readonly string[],
  value: string,
): readonly string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value].sort((a, b) =>
        a.localeCompare(b, "en"),
      );
}

export function inventoryMatchesDiscoveryAvailability(
  inventory: ProductInventory,
  selected: DiscoverySearchState["availability"],
): boolean {
  if (selected.length === 0) return true;

  return selected.some((value) => {
    if (value === "in-stock") {
      return (
        inventory.status === "in-stock" ||
        inventory.status === "not-tracked"
      );
    }

    if (value === "backorder") {
      return (
        inventory.status === "backorder" ||
        (inventory.status === "out-of-stock" &&
          inventory.backorderable)
      );
    }

    return inventory.status === value;
  });
}

export function discoveryHref(
  pathname: string,
  state: DiscoverySearchState,
  options: Readonly<{ stripCategory?: boolean }> = {},
): string {
  const urlState = options.stripCategory
    ? withoutDiscoveryCategory(state)
    : state;

  const search = serializeDiscoverySearch(
    urlState,
    DEFAULT_DISCOVERY_SORT,
  );

  return `${pathname}${search ? `?${search}` : ""}`;
}

export function discoveryHiddenEntries(
  state: DiscoverySearchState,
  omittedKeys: readonly string[],
  options: Readonly<{ stripCategory?: boolean }> = {},
): readonly [string, string][] {
  const urlState = options.stripCategory
    ? withoutDiscoveryCategory(state)
    : state;

  const params = new URLSearchParams(
    serializeDiscoverySearch(
      urlState,
      DEFAULT_DISCOVERY_SORT,
    ),
  );

  return [...params.entries()].filter(
    ([key]) => !omittedKeys.includes(key),
  );
}

export function activeDiscoveryFilterCount(
  state: DiscoverySearchState,
): number {
  return (
    (state.q ? 1 : 0) +
    state.category.length +
    state.brand.length +
    state.audience.length +
    state.style.length +
    state.movement.length +
    (state.priceMin !== undefined ||
    state.priceMax !== undefined
      ? 1
      : 0) +
    state.caseSize.length +
    state.caseMaterial.length +
    state.strapMaterial.length +
    state.dialColor.length +
    state.waterResistance.length +
    state.availability.length +
    (state.discount ? 1 : 0)
  );
}
