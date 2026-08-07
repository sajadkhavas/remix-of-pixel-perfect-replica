import { PUBLIC_STORE_SETTINGS } from "@/components/layout/store-settings-runtime";
import { createMetadataFactory } from "@/seo/metadata";
import type { TanStackHeadDescriptor } from "@/seo/types";

const factory = createMetadataFactory({
  environment: PUBLIC_STORE_SETTINGS.environment.name,
  siteUrl: PUBLIC_STORE_SETTINGS.seo.siteUrl,
  siteName: PUBLIC_STORE_SETTINGS.brand.name,
  defaultTitle: PUBLIC_STORE_SETTINGS.seo.defaultTitle,
  titleTemplate: PUBLIC_STORE_SETTINGS.seo.titleTemplate,
  defaultDescription: PUBLIC_STORE_SETTINGS.seo.defaultDescription,
  defaultLocale: PUBLIC_STORE_SETTINGS.seo.defaultLocale,
  twitterCard: "summary_large_image",
});

export function buildTrustPageHead(input: {
  readonly pathname: string;
  readonly title: string;
  readonly description: string;
}): TanStackHeadDescriptor {
  return factory.build({
    pageType: "policy",
    pathname: input.pathname,
    title: input.title,
    description: input.description,
    robots: "noindex,follow",
  }).head;
}
