import type {
  BreadcrumbItem,
  EntityId,
  ImageMedia,
  LocalizedText,
  SEOFields,
  Slug,
} from "../shared";

export interface Brand {
  readonly id: EntityId;
  readonly slug: Slug;
  readonly name: string;
  readonly localizedName?: LocalizedText;
  readonly logo: ImageMedia;
  readonly heroImage?: ImageMedia;
  readonly originCountryCode?: string;
  readonly foundedYear?: number;
  readonly description: LocalizedText;
  readonly story?: LocalizedText;
  readonly officialStatus:
    | Readonly<{ status: "unverified" }>
    | Readonly<{ status: "verified"; evidenceRef: EntityId; verifiedAt: string }>;
  readonly seo: SEOFields;
  readonly featured: boolean;
  readonly productCount?: number;
  readonly relatedArticleIds: readonly EntityId[];
}

export type CategoryIndexability = "index" | "noindex";

export interface Category {
  readonly id: EntityId;
  readonly slug: Slug;
  readonly parentId?: EntityId;
  readonly childIds: readonly EntityId[];
  readonly depth: number;
  readonly title: LocalizedText;
  readonly intro?: LocalizedText;
  readonly heroMedia?: ImageMedia;
  readonly seo: SEOFields;
  readonly allowedFilterKeys: readonly string[];
  readonly allowedSortKeys: readonly string[];
  readonly indexability: CategoryIndexability;
  readonly landingContent?: LocalizedText;
  readonly breadcrumb: readonly BreadcrumbItem[];
}

export interface Collection {
  readonly id: EntityId;
  readonly brandId?: EntityId;
  readonly slug: Slug;
  readonly name: LocalizedText;
  readonly description?: LocalizedText;
  readonly heroImage?: ImageMedia;
  readonly seo: SEOFields;
  readonly featured: boolean;
}

export interface TaxonomyValue {
  readonly key: string;
  readonly slug: Slug;
  readonly label: LocalizedText;
  readonly sortOrder: number;
  readonly aliases?: readonly string[];
}

export interface TaxonomyDefinition {
  readonly key: string;
  readonly label: LocalizedText;
  readonly dataType: "enum" | "multi-enum" | "number" | "range" | "boolean" | "text";
  readonly cardinality: "single" | "multiple";
  readonly filterable: boolean;
  readonly sortable: boolean;
  readonly indexableLanding: boolean;
  readonly structuredDataRelevance: "direct" | "indirect" | "none";
  readonly displayPriority: number;
  readonly unknownValueBehavior: "reject" | "store-unmapped" | "hide-from-filter";
  readonly values?: readonly TaxonomyValue[];
}

export interface CatalogBreadcrumbContext {
  readonly type:
    | "home"
    | "shop"
    | "category"
    | "brand"
    | "product"
    | "magazine"
    | "article"
    | "account"
    | "order";
  readonly label: string;
  readonly href?: string;
}

export function createBreadcrumb(
  items: readonly CatalogBreadcrumbContext[],
): readonly BreadcrumbItem[] {
  return items.map((item, index) => ({
    label: item.label,
    href: index === items.length - 1 ? undefined : item.href,
    position: index + 1,
    current: index === items.length - 1,
  }));
}

export function assertValidBreadcrumb(items: readonly BreadcrumbItem[]): boolean {
  return (
    items.length > 0 &&
    items.every(
      (item, index) => item.position === index + 1 && item.current === (index === items.length - 1),
    )
  );
}
