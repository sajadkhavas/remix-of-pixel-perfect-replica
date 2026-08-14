import { productToCardViewModel } from "@/components/commerce/product-card-product-adapter";
import {
  FixtureBrandRepository,
  FixtureCatalogRepository,
  FixtureSearchRepository,
} from "@/data/fixtures/repositories";
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
    variant.optionValues
      .filter((option) => option.optionKey === key)
      .map((option) => option.valueKey),
  );
}

export async function loadDiscoveryServer(input: {
  readonly state: DiscoverySearchState;
  readonly categorySlug?: string;
}): Promise<DiscoveryServerResult> {
  const searchRepository = new FixtureSearchRepository();
  const catalogRepository = new FixtureCatalogRepository();
  const brandRepository = new FixtureBrandRepository();

  const [categories, brands, allProducts] = await Promise.all([
    catalogRepository.listCategories(),
    brandRepository.list(),
    catalogRepository.listProducts({
      includeUnavailable: false,
      page: { page: 1, pageSize: 500 },
    }),
  ]);
  const category = input.categorySlug
    ? (categories.find((item) => item.depth === 1 && item.slug === input.categorySlug) ?? null)
    : null;
  const effectiveState = category ? { ...input.state, category: category.slug } : input.state;
  const searchResult = await searchRepository.search(effectiveState);
  const brandNames = new Map(
    brands.map((brand) => [brand.id, brand.localizedName?.default ?? brand.name] as const),
  );
  const cards = searchResult.products.items.map((product) =>
    productToCardViewModel(product, brandNames.get(product.brandId) ?? "—", formatMoney),
  );
  const activeProducts = allProducts.items;
  const data: DiscoveryLoadResult = {
    cards,
    facets: searchResult.facets,
    categories: categories.filter((item) => item.depth === 1),
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
    seo: getDiscoverySeoDecision(effectiveState, DEFAULT_DISCOVERY_SORT),
    rankingSource: searchResult.rankingSource,
  };

  return { data, category };
}
