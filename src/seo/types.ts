import type { SeoEnvironment, SeoImageInput } from "../data/contracts/seo";

export type RobotsDirective = "index,follow" | "noindex,follow" | "noindex,nofollow";

export type SeoPageType =
  | "home"
  | "shop"
  | "curated-landing"
  | "brand-index"
  | "brand"
  | "product"
  | "magazine-index"
  | "article"
  | "guide"
  | "policy"
  | "search"
  | "cart"
  | "wishlist"
  | "compare"
  | "checkout"
  | "account"
  | "not-found"
  | "error"
  | "unknown";

export interface SeoAlternateInput {
  readonly locale: string;
  readonly pathname: string;
}

export interface MetadataInput {
  readonly pageType: SeoPageType;
  readonly title?: string;
  readonly description?: string;
  readonly pathname: string;
  readonly canonical?: string;
  readonly image?: SeoImageInput;
  readonly robots?: RobotsDirective;
  readonly locale?: string;
  readonly alternates?: readonly SeoAlternateInput[];
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly productContext?: Readonly<{
    brand?: string;
    availability?: string;
    price?: string;
    currency?: string;
  }>;
}

export interface HeadMetaDescriptor {
  readonly charSet?: string;
  readonly name?: string;
  readonly property?: string;
  readonly content?: string;
}

export interface HeadLinkDescriptor {
  readonly rel: string;
  readonly href: string;
  readonly hreflang?: string;
}

export interface TanStackHeadDescriptor {
  readonly title: string;
  readonly meta: readonly HeadMetaDescriptor[];
  readonly links: readonly HeadLinkDescriptor[];
}

export type SeoIssueSeverity = "error" | "warning" | "info";

export interface SeoValidationIssue {
  readonly code: string;
  readonly severity: SeoIssueSeverity;
  readonly message: string;
  readonly path?: string;
  readonly value?: string | number | boolean;
}

export interface MetadataBuildResult {
  readonly head: TanStackHeadDescriptor;
  readonly canonical: string;
  readonly robots: RobotsDirective;
  readonly issues: readonly SeoValidationIssue[];
}

export interface SiteUrlOptions {
  readonly environment: SeoEnvironment;
  readonly siteUrl?: string;
}

export interface CanonicalBuildInput {
  readonly pathname: string;
  readonly search?: string | URLSearchParams;
  readonly allowedQueryKeys?: readonly string[];
  readonly retainPage?: boolean;
}

export interface IndexabilityContext {
  readonly contentValid?: boolean;
  readonly contentUseful?: boolean;
  readonly published?: boolean;
  readonly pageExists?: boolean;
}

export interface IndexabilityDecision {
  readonly pageType: SeoPageType;
  readonly robots: RobotsDirective;
  readonly indexable: boolean;
  readonly canonicalPath: string | null;
  readonly normalizedPath: string;
  readonly reason: string;
}
