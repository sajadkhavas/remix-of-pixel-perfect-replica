export type EntityId = string;
export type Slug = string;
export type ISODateTime = string;
export type LocaleCode = string;
export type CurrencyCode = string;

export interface LocalizedText {
  readonly default: string;
  readonly values?: Readonly<Record<LocaleCode, string>>;
}

export interface Money {
  /** Integer amount in the currency's smallest unit. */
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
  readonly fractionDigits: number;
}

export interface DateRange {
  readonly startsAt?: ISODateTime;
  readonly endsAt?: ISODateTime;
}

export interface PageRequest {
  readonly page: number;
  readonly pageSize: number;
}

export interface PageResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

export interface SEOFields {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath?: string;
  readonly robots?: "index,follow" | "noindex,follow" | "noindex,nofollow";
  readonly imageUrl?: string;
  readonly keywords?: readonly string[];
  readonly structuredDataType?: "Product" | "ProductGroup" | "Brand" | "CollectionPage" | "Article" | "FAQPage";
}

export interface MediaDimensions {
  readonly width: number;
  readonly height: number;
}

export interface ImageMedia {
  readonly type: "image";
  readonly id: EntityId;
  readonly url: string;
  readonly alt: string;
  readonly dimensions: MediaDimensions;
  readonly sortOrder: number;
  readonly role: "primary" | "gallery" | "thumbnail" | "hero" | "logo";
  readonly focalPoint?: Readonly<{ x: number; y: number }>;
}

export interface VideoMedia {
  readonly type: "video";
  readonly id: EntityId;
  readonly url: string;
  readonly posterUrl: string;
  readonly alt: string;
  readonly dimensions: MediaDimensions;
  readonly sortOrder: number;
  readonly durationSeconds?: number;
}

export type MediaAsset = ImageMedia | VideoMedia;

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
  readonly position: number;
  readonly current: boolean;
}
