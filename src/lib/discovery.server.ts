import { productToCardViewModel } from "@/components/commerce/product-card-product-adapter";
import { CATALOG_BRANDS } from "@/data/fixtures/brands";
import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";
import type { Product } from "@/domain/product";
import {
  getDiscoverySeoDecision,
  type DiscoverySearchState,
} from "@/domain/search";
import type { Money } from "@/domain/shared";
import {
  DEFAULT_DISCOVERY_SORT,
  inventoryMatchesDiscoveryAvailability,
  type DiscoveryLoadResult,
  type DiscoveryServerResult,
} from "@/lib/discovery";

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

function unique(
  values: readonly string[],
): readonly string[] {
  return [...new Set(values.filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "en"),
  );
}

function uniqueNumbers(
  values: readonly number[],
): readonly number[] {
  return [
    ...new Set(values.filter(Number.isFinite)),
  ].sort((a, b) => a - b);
}

function defaultVariant(product: Product) {
  return product.variants.find(
    (variant) =>
      variant.id === product.defaultVariantId,
  );
}

function effectivePrice(product: Product): number {
  const money =
    defaultVariant(product)?.pricing.effectivePrice;

  if (!money) return Number.MAX_SAFE_INTEGER;

  return (
    money.amountMinor / 10 ** money.fractionDigits
  );
}

function activeDiscount(product: Product): number {
  const pricing = defaultVariant(product)?.pricing;

  if (
    !pricing?.salePrice ||
    pricing.listPrice.amountMinor <= 0
  ) {
    return 0;
  }

  return (
    (pricing.listPrice.amountMinor -
      pricing.salePrice.amountMinor) /
    pricing.listPrice.amountMinor
  );
}

function specKeys(
  product: Product,
  key: string,
): readonly string[] {
  const specification =
    product.specificationValues.find(
      (item) => item.key === key,
    );

  if (!specification) return [];

  if (specification.filterValueKeys?.length) {
    return specification.filterValueKeys;
  }

  if (specification.value.type === "text") {
    return [specification.value.value];
  }

  if (specification.value.type === "number") {
    return [String(specification.value.value)];
  }

  if (specification.value.type === "list") {
    return specification.value.values;
  }

  return [];
}

function specNumbers(
  product: Product,
  key: string,
): readonly number[] {
  const specification =
    product.specificationValues.find(
      (item) => item.key === key,
    );

  return specification?.value.type === "number"
    ? [specification.value.value]
    : [];
}

function optionKeys(
  product: Product,
  key: string,
): readonly string[] {
  return product.variants.flatMap((variant) =>
    variant.optionValues
      .filter(
        (option) => option.optionKey === key,
      )
      .map((option) => option.valueKey),
  );
}

function hasAny(
  source: readonly string[],
  selected: readonly string[],
): boolean {
  return selected.some((value) =>
    source.includes(value),
  );
}

type OmittedFilter =
  | "q"
  | "category"
  | "brand"
  | "audience"
  | "style"
  | "movement"
  | "price"
  | "caseSize"
  | "caseMaterial"
  | "strapMaterial"
  | "dialColor"
  | "waterResistance"
  | "availability"
  | "discount";

function filterProducts(
  state: DiscoverySearchState,
  omitted: ReadonlySet<OmittedFilter> = new Set(),
): readonly Product[] {
  let items = CATALOG_PRODUCTS.filter(
    (product) => product.status === "active",
  );

  if (
    !omitted.has("category") &&
    state.category.length
  ) {
    const selectedCategoryIds =
      CATALOG_CATEGORIES.filter(
        (category) =>
          category.depth === 1 &&
          state.category.includes(category.slug),
      ).map((category) => category.id);

    items = items.filter((product) =>
      product.categoryIds.some((categoryId) =>
        selectedCategoryIds.includes(categoryId),
      ),
    );
  }

  if (!omitted.has("q") && state.q) {
    const query = state.q
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("fa");

    items = items.filter((product) => {
      const brand = CATALOG_BRANDS.find(
        (item) => item.id === product.brandId,
      );

      return [
        product.content.name.default,
        product.content.shortDescription.default,
        product.identity.slug,
        product.identity.primarySku ?? "",
        brand?.name ?? "",
        brand?.localizedName?.default ?? "",
      ].some((value) =>
        value
          .toLocaleLowerCase("fa")
          .includes(query),
      );
    });
  }

  if (
    !omitted.has("brand") &&
    state.brand.length
  ) {
    const brandIds = CATALOG_BRANDS.filter(
      (brand) =>
        state.brand.includes(brand.slug),
    ).map((brand) => brand.id);

    items = items.filter((product) =>
      brandIds.includes(product.brandId),
    );
  }

  if (
    !omitted.has("audience") &&
    state.audience.length
  ) {
    items = items.filter((product) =>
      hasAny(
        product.audienceKeys,
        state.audience,
      ),
    );
  }

  if (
    !omitted.has("style") &&
    state.style.length
  ) {
    items = items.filter((product) =>
      hasAny(product.styleKeys, state.style),
    );
  }

  if (
    !omitted.has("movement") &&
    state.movement.length
  ) {
    items = items.filter((product) =>
      state.movement.includes(
        product.movementKey,
      ),
    );
  }

  if (!omitted.has("price")) {
    if (state.priceMin !== undefined) {
      items = items.filter(
        (product) =>
          effectivePrice(product) >=
          state.priceMin!,
      );
    }

    if (state.priceMax !== undefined) {
      items = items.filter(
        (product) =>
          effectivePrice(product) <=
          state.priceMax!,
      );
    }
  }

  if (
    !omitted.has("caseSize") &&
    state.caseSize.length
  ) {
    items = items.filter((product) =>
      state.caseSize.some((value) =>
        specNumbers(
          product,
          "case-diameter",
        ).includes(value),
      ),
    );
  }

  if (
    !omitted.has("caseMaterial") &&
    state.caseMaterial.length
  ) {
    items = items.filter((product) =>
      hasAny(
        specKeys(product, "case-material"),
        state.caseMaterial,
      ),
    );
  }

  if (
    !omitted.has("strapMaterial") &&
    state.strapMaterial.length
  ) {
    items = items.filter((product) =>
      hasAny(
        specKeys(product, "strap-material"),
        state.strapMaterial,
      ),
    );
  }

  if (
    !omitted.has("dialColor") &&
    state.dialColor.length
  ) {
    items = items.filter((product) =>
      hasAny(
        optionKeys(product, "dial-color"),
        state.dialColor,
      ),
    );
  }

  if (
    !omitted.has("waterResistance") &&
    state.waterResistance.length
  ) {
    items = items.filter((product) =>
      hasAny(
        specKeys(
          product,
          "water-resistance",
        ),
        state.waterResistance,
      ),
    );
  }

  if (
    !omitted.has("discount") &&
    state.discount
  ) {
    items = items.filter(
      (product) => activeDiscount(product) > 0,
    );
  }

  if (
    !omitted.has("availability") &&
    state.availability.length
  ) {
    items = items.filter((product) =>
      product.variants.some(
        (variant) =>
          variant.status === "active" &&
          inventoryMatchesDiscoveryAvailability(
            variant.inventory,
            state.availability,
          ),
      ),
    );
  }

  return items;
}

function sortProducts(
  products: readonly Product[],
  state: DiscoverySearchState,
): readonly Product[] {
  const sorted = [...products];

  switch (state.sort) {
    case "price-asc":
      sorted.sort(
        (a, b) =>
          effectivePrice(a) -
          effectivePrice(b),
      );
      break;

    case "price-desc":
      sorted.sort(
        (a, b) =>
          effectivePrice(b) -
          effectivePrice(a),
      );
      break;

    case "discount":
      sorted.sort(
        (a, b) =>
          activeDiscount(b) -
          activeDiscount(a),
      );
      break;

    case "newest":
    case "relevance":
    case "popular":
    case "best-rated":
    default:
      sorted.sort((a, b) =>
        (
          b.releasedAt ??
          b.publishedAt ??
          b.createdAt
        ).localeCompare(
          a.releasedAt ??
            a.publishedAt ??
            a.createdAt,
        ),
      );
      break;
  }

  return sorted;
}

export async function loadDiscoveryServer(
  input: {
    readonly state: DiscoverySearchState;
    readonly categorySlug?: string;
  },
): Promise<DiscoveryServerResult> {
  const categories = CATALOG_CATEGORIES.filter(
    (item) => item.depth === 1,
  );

  const category = input.categorySlug
    ? categories.find(
        (item) =>
          item.slug === input.categorySlug,
      ) ?? null
    : null;

  if (input.categorySlug && !category) {
    return {
      data: {
        cards: [],
        facets: [],
        categories,
        options: {
          audience: [],
          style: [],
          movement: [],
          caseSize: [],
          caseMaterial: [],
          strapMaterial: [],
          dialColor: [],
          waterResistance: [],
        },
        page: 1,
        pageSize: 24,
        totalItems: 0,
        totalPages: 1,
        seo: getDiscoverySeoDecision(
          input.state,
          DEFAULT_DISCOVERY_SORT,
        ),
        rankingSource: "fixture",
      },
      category: null,
    };
  }

  const effectiveState: DiscoverySearchState =
    category
      ? {
          ...input.state,
          category: [category.slug],
        }
      : input.state;

  const filtered = sortProducts(
    filterProducts(effectiveState),
    effectiveState,
  );

  const pageSize = 24;
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize),
  );
  const page = Math.min(
    Math.max(1, input.state.page),
    totalPages,
  );
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(
    start,
    start + pageSize,
  );

  const brandNames = new Map(
    CATALOG_BRANDS.map(
      (brand) =>
        [
          brand.id,
          brand.localizedName?.default ??
            brand.name,
        ] as const,
    ),
  );

  const optionProducts = filterProducts({
    ...effectiveState,
    q: undefined,
    brand: [],
    audience: [],
    style: [],
    movement: [],
    priceMin: undefined,
    priceMax: undefined,
    caseSize: [],
    caseMaterial: [],
    strapMaterial: [],
    dialColor: [],
    waterResistance: [],
    availability: [],
    discount: false,
  });

  const brandScope = filterProducts(
    effectiveState,
    new Set(["brand"]),
  );

  const data: DiscoveryLoadResult = {
    cards: pageItems.map((product) =>
      productToCardViewModel(
        product,
        brandNames.get(product.brandId) ??
          "—",
        formatMoney,
        { includeRatings: true },
      ),
    ),

    facets: [
      {
        filterKey: "brand",
        buckets: CATALOG_BRANDS.map(
          (brand) => ({
            valueKey: brand.slug,
            count: brandScope.filter(
              (product) =>
                product.brandId === brand.id,
            ).length,
            selected:
              input.state.brand.includes(
                brand.slug,
              ),
          }),
        ).filter(
          (bucket) =>
            bucket.count > 0 ||
            bucket.selected,
        ),
      },
    ],

    categories,

    options: {
      audience: unique(
        optionProducts.flatMap(
          (product) =>
            product.audienceKeys,
        ),
      ),
      style: unique(
        optionProducts.flatMap(
          (product) => product.styleKeys,
        ),
      ),
      movement: unique(
        optionProducts.map(
          (product) =>
            product.movementKey,
        ),
      ),
      caseSize: uniqueNumbers(
        optionProducts.flatMap((product) =>
          specNumbers(
            product,
            "case-diameter",
          ),
        ),
      ),
      caseMaterial: unique(
        optionProducts.flatMap((product) =>
          specKeys(
            product,
            "case-material",
          ),
        ),
      ),
      strapMaterial: unique(
        optionProducts.flatMap((product) =>
          specKeys(
            product,
            "strap-material",
          ),
        ),
      ),
      dialColor: unique(
        optionProducts.flatMap((product) =>
          optionKeys(
            product,
            "dial-color",
          ),
        ),
      ),
      waterResistance: unique(
        optionProducts.flatMap((product) =>
          specKeys(
            product,
            "water-resistance",
          ),
        ),
      ),
    },

    page,
    pageSize,
    totalItems: filtered.length,
    totalPages,
    seo: getDiscoverySeoDecision(
      input.state,
      DEFAULT_DISCOVERY_SORT,
    ),
    rankingSource: "fixture",
  };

  return {
    data,
    category,
  };
}
