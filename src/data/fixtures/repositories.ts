import type { BrandRepository, CatalogQuery, CatalogRepository, ContentRepository, ContentSummary, ProductRepository, SearchRepository, SearchResult, StoreSettings, StoreSettingsRepository } from "../contracts";
import type { Product, Review } from "../../domain/product";
import type { DiscoverySearchState } from "../../domain/search";
import type { EntityId, PageRequest, PageResult, Slug } from "../../domain/shared";
import { FIXTURE_BRANDS } from "./brands";
import { FIXTURE_CATEGORIES } from "./categories";
import { FIXTURE_CONTENT } from "./articles";
import { FIXTURE_PRODUCTS } from "./products";

function paginate<T>(items: readonly T[], request: PageRequest): PageResult<T> {
  const page = Math.max(1, Math.trunc(request.page));
  const pageSize = Math.max(1, Math.trunc(request.pageSize));
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, totalItems: items.length, totalPages: Math.max(1, Math.ceil(items.length / pageSize)) };
}

export class FixtureCatalogRepository implements CatalogRepository {
  async listProducts(query: CatalogQuery): Promise<PageResult<Product>> {
    let items = [...FIXTURE_PRODUCTS];
    if (query.categorySlug) {
      const category = FIXTURE_CATEGORIES.find((item) => item.slug === query.categorySlug);
      items = category ? items.filter((item) => item.categoryIds.includes(category.id)) : [];
    }
    if (query.brandSlugs?.length) {
      const ids = FIXTURE_BRANDS.filter((brand) => query.brandSlugs?.includes(brand.slug)).map((brand) => brand.id);
      items = items.filter((item) => ids.includes(item.brandId));
    }
    if (query.productIds?.length) items = items.filter((item) => query.productIds?.includes(item.identity.id));
    if (!query.includeUnavailable) items = items.filter((item) => item.status === "active");
    return paginate(items, query.page);
  }

  async listCategories() { return FIXTURE_CATEGORIES; }
  async listCollections() { return []; }
}

export class FixtureProductRepository implements ProductRepository {
  async getById(id: EntityId) { return FIXTURE_PRODUCTS.find((product) => product.identity.id === id) ?? null; }
  async getBySlug(slug: Slug) { return FIXTURE_PRODUCTS.find((product) => product.identity.slug === slug) ?? null; }
  async listRelated(productId: EntityId, limit: number) {
    const source = FIXTURE_PRODUCTS.find((product) => product.identity.id === productId);
    if (!source) return [];
    return FIXTURE_PRODUCTS.filter((product) => product.identity.id !== source.identity.id && product.categoryIds.some((id) => source.categoryIds.includes(id))).slice(0, Math.max(0, limit));
  }
  async listReviews(_productId: EntityId, page: PageRequest): Promise<PageResult<Review>> { return paginate([], page); }
}

export class FixtureBrandRepository implements BrandRepository {
  async list() { return FIXTURE_BRANDS; }
  async getById(id: EntityId) { return FIXTURE_BRANDS.find((brand) => brand.id === id) ?? null; }
  async getBySlug(slug: Slug) { return FIXTURE_BRANDS.find((brand) => brand.slug === slug) ?? null; }
}

const effectivePrice = (product: Product): number => product.variants.find((variant) => variant.id === product.defaultVariantId)?.pricing.effectivePrice.amountMinor ?? Number.MAX_SAFE_INTEGER;
const activeDiscount = (product: Product): number => {
  const pricing = product.variants.find((variant) => variant.id === product.defaultVariantId)?.pricing;
  if (!pricing?.salePrice || pricing.listPrice.amountMinor === 0) return 0;
  return (pricing.listPrice.amountMinor - pricing.salePrice.amountMinor) / pricing.listPrice.amountMinor;
};
const productBrand = (product: Product) => FIXTURE_BRANDS.find((brand) => brand.id === product.brandId);

export class FixtureSearchRepository implements SearchRepository {
  async search(state: DiscoverySearchState): Promise<SearchResult> {
    let items = FIXTURE_PRODUCTS.filter((product) => product.status === "active");
    if (state.q) {
      const query = state.q.toLocaleLowerCase("fa");
      items = items.filter((product) => {
        const brand = productBrand(product);
        return [product.content.name.default, product.content.shortDescription.default, product.identity.slug, brand?.name ?? "", brand?.localizedName?.default ?? ""].some((value) => value.toLocaleLowerCase("fa").includes(query));
      });
    }
    if (state.category) {
      const category = FIXTURE_CATEGORIES.find((item) => item.slug === state.category);
      items = category ? items.filter((product) => product.categoryIds.includes(category.id)) : [];
    }
    if (state.brand.length) {
      const brandIds = FIXTURE_BRANDS.filter((brand) => state.brand.includes(brand.slug)).map((brand) => brand.id);
      items = items.filter((product) => brandIds.includes(product.brandId));
    }
    if (state.audience.length) items = items.filter((product) => state.audience.some((key) => product.audienceKeys.includes(key)));
    if (state.style.length) items = items.filter((product) => state.style.some((key) => product.styleKeys.includes(key)));
    if (state.movement.length) items = items.filter((product) => state.movement.includes(product.movementKey));
    if (state.priceMin !== undefined) items = items.filter((product) => effectivePrice(product) >= state.priceMin!);
    if (state.priceMax !== undefined) items = items.filter((product) => effectivePrice(product) <= state.priceMax!);
    if (state.discount) items = items.filter((product) => activeDiscount(product) > 0);
    if (state.availability.length) {
      items = items.filter((product) => product.variants.some((variant) => state.availability.includes(variant.inventory.status as (typeof state.availability)[number])));
    }

    const sorted = [...items];
    switch (state.sort) {
      case "price-asc": sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
      case "price-desc": sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
      case "newest": sorted.sort((a, b) => (b.releasedAt ?? b.publishedAt ?? b.createdAt).localeCompare(a.releasedAt ?? a.publishedAt ?? a.createdAt)); break;
      case "best-rated": sorted.sort((a, b) => (b.reviewSummary?.ratingValue ?? 0) - (a.reviewSummary?.ratingValue ?? 0)); break;
      case "discount": sorted.sort((a, b) => activeDiscount(b) - activeDiscount(a)); break;
      case "popular": sorted.sort((a, b) => (b.reviewSummary?.reviewCount ?? 0) - (a.reviewSummary?.reviewCount ?? 0)); break;
      case "relevance": break;
    }

    return {
      products: paginate(sorted, { page: state.page, pageSize: 24 }),
      facets: [
        {
          filterKey: "brand",
          buckets: FIXTURE_BRANDS.map((brand) => ({ valueKey: brand.slug, count: sorted.filter((product) => product.brandId === brand.id).length, selected: state.brand.includes(brand.slug) })),
        },
      ],
      normalizedQuery: state.q,
      rankingSource: "fixture",
    };
  }
}

export class FixtureContentRepository implements ContentRepository {
  async listMagazine(page: PageRequest): Promise<PageResult<ContentSummary>> { return paginate(FIXTURE_CONTENT.filter((item) => item.type === "article"), page); }
  async getArticleBySlug(slug: Slug) { return FIXTURE_CONTENT.find((item) => item.type === "article" && item.slug === slug) ?? null; }
  async getGuideBySlug(slug: Slug) { return FIXTURE_CONTENT.find((item) => item.type === "guide" && item.slug === slug) ?? null; }
}

export class FixtureStoreSettingsRepository implements StoreSettingsRepository {
  async getSettings(): Promise<StoreSettings> {
    return { defaultCurrency: "IRR", supportedCurrencies: ["IRR"], defaultLocale: "fa", supportedLocales: ["fa", "en"], maxCompareItems: 4, lowStockThreshold: 3 };
  }
}
