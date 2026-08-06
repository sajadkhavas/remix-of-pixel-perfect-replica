import type { Brand, Category, Collection } from "../../domain/catalog";
import type { Product, Review } from "../../domain/product";
import type { DiscoverySearchState } from "../../domain/search";
import type { EntityId, PageRequest, PageResult, Slug } from "../../domain/shared";

/** Transport DTOs are validated and normalized by adapters before entering the domain. */
export interface ProductDtoV1 {
  readonly version: 1;
  readonly id: unknown;
  readonly slug: unknown;
  readonly status: unknown;
  readonly content: unknown;
  readonly brand_id: unknown;
  readonly category_ids: unknown;
  readonly variants: unknown;
  readonly media: unknown;
  readonly seo: unknown;
  readonly created_at: unknown;
  readonly updated_at: unknown;
}

export interface BrandDtoV1 {
  readonly version: 1;
  readonly id: unknown;
  readonly slug: unknown;
  readonly name: unknown;
  readonly localized_name?: unknown;
  readonly logo: unknown;
  readonly seo: unknown;
}

export interface CategoryDtoV1 {
  readonly version: 1;
  readonly id: unknown;
  readonly slug: unknown;
  readonly parent_id?: unknown;
  readonly title: unknown;
  readonly seo: unknown;
}

export interface CatalogQuery {
  readonly categorySlug?: Slug;
  readonly brandSlugs?: readonly Slug[];
  readonly productIds?: readonly EntityId[];
  readonly includeUnavailable?: boolean;
  readonly page: PageRequest;
}

export interface CatalogRepository {
  listProducts(query: CatalogQuery): Promise<PageResult<Product>>;
  listCategories(): Promise<readonly Category[]>;
  listCollections(brandId?: EntityId): Promise<readonly Collection[]>;
}

export interface ProductRepository {
  getById(id: EntityId): Promise<Product | null>;
  getBySlug(slug: Slug): Promise<Product | null>;
  listRelated(productId: EntityId, limit: number): Promise<readonly Product[]>;
  listReviews(productId: EntityId, page: PageRequest): Promise<PageResult<Review>>;
}

export interface BrandRepository {
  list(): Promise<readonly Brand[]>;
  getById(id: EntityId): Promise<Brand | null>;
  getBySlug(slug: Slug): Promise<Brand | null>;
}

export interface SearchFacetBucket {
  readonly valueKey: string;
  readonly count: number;
  readonly selected: boolean;
}

export interface SearchFacetResult {
  readonly filterKey: string;
  readonly buckets: readonly SearchFacetBucket[];
}

export interface SearchResult {
  readonly products: PageResult<Product>;
  readonly facets: readonly SearchFacetResult[];
  readonly normalizedQuery?: string;
  readonly correctedQuery?: string;
  readonly rankingSource: "fixture" | "text-score" | "search-service";
}

export interface SearchRepository {
  search(state: DiscoverySearchState): Promise<SearchResult>;
}

export interface ContentSummary {
  readonly id: EntityId;
  readonly slug: Slug;
  readonly type: "article" | "guide";
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
}

export interface ContentRepository {
  listMagazine(page: PageRequest): Promise<PageResult<ContentSummary>>;
  getArticleBySlug(slug: Slug): Promise<ContentSummary | null>;
  getGuideBySlug(slug: Slug): Promise<ContentSummary | null>;
}

export interface StoreSettings {
  readonly defaultCurrency: string;
  readonly supportedCurrencies: readonly string[];
  readonly defaultLocale: string;
  readonly supportedLocales: readonly string[];
  readonly maxCompareItems: number;
  readonly lowStockThreshold: number;
}

export interface StoreSettingsRepository {
  getSettings(): Promise<StoreSettings>;
}
