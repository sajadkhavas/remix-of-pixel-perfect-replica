/**
 * Small structural SEO inputs owned by F13A.
 * F12 may adapt its future store configuration into these contracts.
 */
export type SeoEnvironment = "production" | "staging" | "preview" | "development";

export interface SeoSiteIdentityInput {
  readonly siteName: string;
  readonly defaultTitle: string;
  readonly titleTemplate: string;
  readonly defaultLocale: string;
  readonly siteUrl?: string;
  readonly defaultImage?: SeoImageInput;
}

export interface SeoImageInput {
  readonly url: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface SeoOrganizationInput {
  readonly name: string;
  readonly url: string;
  readonly logo?: SeoImageInput;
  readonly sameAs?: readonly string[];
}

export interface VerifiedCommerceSchemaFlags {
  readonly offers: boolean;
  readonly ratings: boolean;
  readonly reviews: boolean;
  readonly shipping: boolean;
  readonly returns: boolean;
  readonly warranty: boolean;
  readonly approvedMedia: boolean;
}

export interface SeoRuntimeInput {
  readonly environment: SeoEnvironment;
  readonly site: SeoSiteIdentityInput;
}
