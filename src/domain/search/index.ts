export const SORT_VALUES = [
  "relevance",
  "newest",
  "price-asc",
  "price-desc",
  "popular",
  "best-rated",
  "discount",
] as const;

export type SortValue = (typeof SORT_VALUES)[number];

export const VIEW_VALUES = ["grid", "list"] as const;
export type ViewValue = (typeof VIEW_VALUES)[number];

export const AVAILABILITY_VALUES = [
  "in-stock",
  "low-stock",
  "preorder",
  "backorder",
] as const;

export type AvailabilityValue = (typeof AVAILABILITY_VALUES)[number];

export interface DiscoverySearchState {
  readonly q?: string;
  readonly category: readonly string[];
  readonly brand: readonly string[];
  readonly audience: readonly string[];
  readonly style: readonly string[];
  readonly movement: readonly string[];
  readonly priceMin?: number;
  readonly priceMax?: number;
  readonly caseSize: readonly number[];
  readonly caseMaterial: readonly string[];
  readonly strapMaterial: readonly string[];
  readonly dialColor: readonly string[];
  readonly waterResistance: readonly string[];
  readonly availability: readonly AvailabilityValue[];
  readonly discount: boolean;
  readonly sort: SortValue;
  readonly page: number;
  readonly view: ViewValue;
}

export type RawSearch = Readonly<Record<string, unknown>>;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PARAM_ORDER = [
  "q",
  "category",
  "brand",
  "audience",
  "style",
  "movement",
  "priceMin",
  "priceMax",
  "caseSize",
  "caseMaterial",
  "strapMaterial",
  "dialColor",
  "waterResistance",
  "availability",
  "discount",
  "sort",
  "page",
  "view",
] as const;

function asSingleString(value: unknown): string | undefined {
  if (typeof value === "string") return value;

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return undefined;
}

function rawListItems(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      typeof item === "string" ||
      typeof item === "number"
        ? String(item).split(",")
        : [],
    );
  }

  const stringValue = asSingleString(value);

  if (!stringValue) return [];

  const trimmed = stringValue.trim();

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.flatMap((item) =>
          typeof item === "string" ||
          typeof item === "number"
            ? String(item).split(",")
            : [],
        );
      }
    } catch {
      // Fall through to comma parsing.
    }
  }

  return trimmed.split(",");
}

function uniqueSorted<T extends string | number>(
  values: readonly T[],
): readonly T[] {
  return [...new Set(values)].sort((a, b) =>
    String(a).localeCompare(String(b), "en"),
  );
}

function slugList(value: unknown): readonly string[] {
  return uniqueSorted(
    rawListItems(value)
      .map((item) => item.trim().toLowerCase())
      .filter((item) => SLUG.test(item)),
  );
}

function numberValue(
  value: unknown,
  min: number,
  max: number,
): number | undefined {
  const candidate = Array.isArray(value)
    ? value[0]
    : value;

  const parsed = Number(asSingleString(candidate));

  return Number.isFinite(parsed) &&
    parsed >= min &&
    parsed <= max
    ? parsed
    : undefined;
}

function numberList(
  value: unknown,
  min: number,
  max: number,
): readonly number[] {
  return uniqueSorted(
    rawListItems(value)
      .map(Number)
      .filter(
        (item) =>
          Number.isFinite(item) &&
          item >= min &&
          item <= max,
      ),
  );
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  const candidate = asSingleString(
    Array.isArray(value) ? value[0] : value,
  );

  return candidate &&
    (allowed as readonly string[]).includes(candidate)
    ? (candidate as T)
    : fallback;
}

function enumList<T extends string>(
  value: unknown,
  allowed: readonly T[],
): readonly T[] {
  return slugList(value).filter(
    (item): item is T =>
      (allowed as readonly string[]).includes(item),
  );
}

export function createDefaultDiscoveryState(
  defaultSort: SortValue = "relevance",
): DiscoverySearchState {
  return {
    category: [],
    brand: [],
    audience: [],
    style: [],
    movement: [],
    caseSize: [],
    caseMaterial: [],
    strapMaterial: [],
    dialColor: [],
    waterResistance: [],
    availability: [],
    discount: false,
    sort: defaultSort,
    page: 1,
    view: "grid",
  };
}

export function parseDiscoverySearch(
  raw: RawSearch,
  defaultSort: SortValue = "relevance",
): DiscoverySearchState {
  const rawQuery = asSingleString(
    Array.isArray(raw.q) ? raw.q[0] : raw.q,
  );

  const q =
    rawQuery
      ?.trim()
      .replace(/\s+/g, " ")
      .slice(0, 120) || undefined;

  let priceMin = numberValue(
    raw.priceMin,
    0,
    Number.MAX_SAFE_INTEGER,
  );

  let priceMax = numberValue(
    raw.priceMax,
    0,
    Number.MAX_SAFE_INTEGER,
  );

  if (priceMin !== undefined) {
    priceMin = Math.trunc(priceMin);
  }

  if (priceMax !== undefined) {
    priceMax = Math.trunc(priceMax);
  }

  if (
    priceMin !== undefined &&
    priceMax !== undefined &&
    priceMin > priceMax
  ) {
    [priceMin, priceMax] = [priceMax, priceMin];
  }

  const discountValue = asSingleString(
    Array.isArray(raw.discount)
      ? raw.discount[0]
      : raw.discount,
  );

  return {
    q,
    category: slugList(raw.category),
    brand: slugList(raw.brand),
    audience: slugList(raw.audience),
    style: slugList(raw.style),
    movement: slugList(raw.movement),
    priceMin,
    priceMax,
    caseSize: numberList(raw.caseSize, 10, 100),
    caseMaterial: slugList(raw.caseMaterial),
    strapMaterial: slugList(raw.strapMaterial),
    dialColor: slugList(raw.dialColor),
    waterResistance: slugList(
      raw.waterResistance,
    ),
    availability: enumList(
      raw.availability,
      AVAILABILITY_VALUES,
    ),
    discount:
      discountValue === "1" ||
      discountValue === "true",
    sort: enumValue(
      raw.sort,
      SORT_VALUES,
      defaultSort,
    ),
    page: Math.trunc(
      numberValue(raw.page, 1, 10000) ?? 1,
    ),
    view: enumValue(
      raw.view,
      VIEW_VALUES,
      "grid",
    ),
  };
}

export function serializeDiscoverySearch(
  state: DiscoverySearchState,
  defaultSort: SortValue = "relevance",
): string {
  const values: Partial<
    Record<(typeof PARAM_ORDER)[number], string>
  > = {};

  const putList = (
    key: keyof typeof values,
    items: readonly string[] | readonly number[],
  ) => {
    if (items.length) {
      values[key] = uniqueSorted(
        items.map(String),
      ).join(",");
    }
  };

  if (state.q) values.q = state.q;

  putList("category", state.category);
  putList("brand", state.brand);
  putList("audience", state.audience);
  putList("style", state.style);
  putList("movement", state.movement);

  if (state.priceMin !== undefined) {
    values.priceMin = String(
      Math.trunc(state.priceMin),
    );
  }

  if (state.priceMax !== undefined) {
    values.priceMax = String(
      Math.trunc(state.priceMax),
    );
  }

  putList("caseSize", state.caseSize);
  putList("caseMaterial", state.caseMaterial);
  putList("strapMaterial", state.strapMaterial);
  putList("dialColor", state.dialColor);
  putList("waterResistance", state.waterResistance);
  putList("availability", state.availability);

  if (state.discount) values.discount = "1";

  if (state.sort !== defaultSort) {
    values.sort = state.sort;
  }

  if (state.page > 1) {
    values.page = String(state.page);
  }

  if (state.view !== "grid") {
    values.view = state.view;
  }

  const params = new URLSearchParams();

  PARAM_ORDER.forEach((key) => {
    const value = values[key];

    if (value !== undefined) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export interface DiscoverySeoDecision {
  readonly robots: "index,follow" | "noindex,follow";
  readonly canonicalSearch: string;
  readonly reason:
    | "base"
    | "pagination"
    | "query"
    | "facets"
    | "sort-or-view";
}

export function getDiscoverySeoDecision(
  state: DiscoverySearchState,
  defaultSort: SortValue = "relevance",
): DiscoverySeoDecision {
  const hasFacets = Boolean(
    state.category.length ||
      state.brand.length ||
      state.audience.length ||
      state.style.length ||
      state.movement.length ||
      state.priceMin !== undefined ||
      state.priceMax !== undefined ||
      state.caseSize.length ||
      state.caseMaterial.length ||
      state.strapMaterial.length ||
      state.dialColor.length ||
      state.waterResistance.length ||
      state.availability.length ||
      state.discount,
  );

  if (state.q) {
    return {
      robots: "noindex,follow",
      canonicalSearch: "",
      reason: "query",
    };
  }

  if (hasFacets) {
    return {
      robots: "noindex,follow",
      canonicalSearch:
        state.page > 1 ? `page=${state.page}` : "",
      reason: "facets",
    };
  }

  if (state.page > 1) {
    return {
      robots: "index,follow",
      canonicalSearch: `page=${state.page}`,
      reason: "pagination",
    };
  }

  if (
    state.sort !== defaultSort ||
    state.view !== "grid"
  ) {
    return {
      robots: "noindex,follow",
      canonicalSearch: "",
      reason: "sort-or-view",
    };
  }

  return {
    robots: "index,follow",
    canonicalSearch: "",
    reason: "base",
  };
}

export interface SortDefinition {
  readonly value: SortValue;
  readonly labelFa: string;
  readonly semantics: string;
  readonly requiredData: string;
  readonly fallback: SortValue;
  readonly indexabilityEffect:
    | "none"
    | "noindex-and-strip-from-canonical";
}

export const SORT_DEFINITIONS: readonly SortDefinition[] = [
  {
    value: "relevance",
    labelFa: "مرتبط‌ترین",
    semantics:
      "Search ranking score; only meaningful with q.",
    requiredData: "search score",
    fallback: "newest",
    indexabilityEffect:
      "noindex-and-strip-from-canonical",
  },
  {
    value: "newest",
    labelFa: "جدیدترین",
    semantics:
      "Descending releasedAt, then publishedAt, then stable ID.",
    requiredData: "valid release or publish date",
    fallback: "popular",
    indexabilityEffect:
      "noindex-and-strip-from-canonical",
  },
  {
    value: "price-asc",
    labelFa: "ارزان‌ترین",
    semantics:
      "Ascending effective price in selected currency.",
    requiredData: "comparable effective price",
    fallback: "newest",
    indexabilityEffect:
      "noindex-and-strip-from-canonical",
  },
  {
    value: "price-desc",
    labelFa: "گران‌ترین",
    semantics:
      "Descending effective price in selected currency.",
    requiredData: "comparable effective price",
    fallback: "newest",
    indexabilityEffect:
      "noindex-and-strip-from-canonical",
  },
  {
    value: "popular",
    labelFa: "محبوب‌ترین",
    semantics:
      "Descending documented popularity score.",
    requiredData:
      "analytics or order-derived popularity score with time window",
    fallback: "newest",
    indexabilityEffect:
      "noindex-and-strip-from-canonical",
  },
  {
    value: "best-rated",
    labelFa: "بالاترین امتیاز",
    semantics:
      "Bayesian/threshold-adjusted rating; not raw average alone.",
    requiredData:
      "rating value and minimum rating count",
    fallback: "popular",
    indexabilityEffect:
      "noindex-and-strip-from-canonical",
  },
  {
    value: "discount",
    labelFa: "بیشترین تخفیف",
    semantics:
      "Descending active discount percentage, then effective price.",
    requiredData: "valid list and sale prices",
    fallback: "newest",
    indexabilityEffect:
      "noindex-and-strip-from-canonical",
  },
] as const;
