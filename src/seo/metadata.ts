import type { SeoEnvironment, SeoImageInput } from "../data/contracts/seo";
import { buildCanonicalUrl, normalizePathname, resolveSiteOrigin } from "./site-url";
import type {
  MetadataBuildResult,
  MetadataInput,
  RobotsDirective,
  SeoValidationIssue,
  TanStackHeadDescriptor,
} from "./types";

export interface MetadataFactoryConfig {
  readonly environment: SeoEnvironment;
  readonly siteUrl?: string;
  readonly siteName: string;
  readonly defaultTitle: string;
  readonly titleTemplate: string;
  readonly defaultDescription?: string;
  readonly defaultLocale: string;
  readonly defaultImage?: SeoImageInput;
  readonly twitterCard?: "summary" | "summary_large_image";
}

function issue(
  code: string,
  severity: "error" | "warning" | "info",
  message: string,
  path?: string,
): SeoValidationIssue {
  return { code, severity, message, path };
}

function validDateTime(value: string | undefined): value is string {
  return Boolean(value && !Number.isNaN(Date.parse(value)));
}

function applyTitleTemplate(title: string, config: MetadataFactoryConfig): string {
  if (title === config.defaultTitle) return title;
  return config.titleTemplate.includes("%s")
    ? config.titleTemplate.replace("%s", title)
    : `${title} | ${config.siteName}`;
}

function buildCanonical(config: MetadataFactoryConfig, input: MetadataInput): string {
  const rawCanonical = input.canonical ?? input.pathname;
  let pathname = rawCanonical;
  let search = "";
  if (/^https?:\/\//i.test(rawCanonical)) {
    const parsed = new URL(rawCanonical);
    const configuredOrigin = resolveSiteOrigin(config);
    if (parsed.origin !== configuredOrigin) {
      throw new Error("Canonical URL origin must match the configured site origin.");
    }
    pathname = parsed.pathname;
    search = parsed.search;
  } else {
    const [pathPart = "/", queryPart = ""] = rawCanonical.split("?", 2);
    pathname = pathPart;
    search = queryPart;
  }
  return buildCanonicalUrl(config, {
    pathname,
    search,
    retainPage: true,
  });
}

function imageMeta(image: SeoImageInput | undefined): readonly Record<string, string>[] {
  if (!image) return [];
  return [
    { property: "og:image", content: image.url },
    { property: "og:image:alt", content: image.alt },
    { property: "og:image:width", content: String(image.width) },
    { property: "og:image:height", content: String(image.height) },
    { name: "twitter:image", content: image.url },
    { name: "twitter:image:alt", content: image.alt },
  ];
}

export class MetadataRegistry {
  private readonly descriptions = new Map<string, string>();
  private readonly canonicals = new Map<string, string>();

  build(config: MetadataFactoryConfig, input: MetadataInput): MetadataBuildResult {
    const issues: SeoValidationIssue[] = [];
    const rawTitle = input.title?.trim() || config.defaultTitle;
    if (!input.title?.trim()) {
      issues.push(issue("metadata-title-defaulted", "warning", "Page title was empty; default title used."));
    }
    const title = applyTitleTemplate(rawTitle, config);
    const rawDescription = input.description?.trim();
    const description = rawDescription || config.defaultDescription || "";
    if (!rawDescription) {
      issues.push(
        issue(
          "metadata-description-empty",
          description ? "warning" : "error",
          description
            ? "Page description was empty; configured default description used."
            : "Page description is empty and no default is configured.",
        ),
      );
    }

    const canonical = buildCanonical(config, input);
    const pathname = normalizePathname(input.pathname);
    const previousCanonicalPath = this.canonicals.get(canonical);
    if (previousCanonicalPath && previousCanonicalPath !== pathname) {
      issues.push(
        issue(
          "duplicate-canonical",
          "error",
          `Canonical is already registered by ${previousCanonicalPath}.`,
          pathname,
        ),
      );
    } else {
      this.canonicals.set(canonical, pathname);
    }

    if (description) {
      const previousDescriptionPath = this.descriptions.get(description);
      if (previousDescriptionPath && previousDescriptionPath !== pathname) {
        issues.push(
          issue(
            "duplicate-description",
            "warning",
            `Description is already registered by ${previousDescriptionPath}.`,
            pathname,
          ),
        );
      } else {
        this.descriptions.set(description, pathname);
      }
    }

    const robots: RobotsDirective = input.robots ?? "index,follow";
    const locale = input.locale?.trim() || config.defaultLocale;
    const image = input.image ?? config.defaultImage;
    const ogType = input.pageType === "article" || input.pageType === "guide" ? "article" : "website";

    if (input.publishedTime && !validDateTime(input.publishedTime)) {
      issues.push(issue("invalid-published-time", "error", "publishedTime is not a valid date-time."));
    }
    if (input.modifiedTime && !validDateTime(input.modifiedTime)) {
      issues.push(issue("invalid-modified-time", "error", "modifiedTime is not a valid date-time."));
    }

    const meta: Array<Record<string, string>> = [
      { name: "description", content: description },
      { name: "robots", content: robots },
      { property: "og:site_name", content: config.siteName },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: locale },
      { name: "twitter:card", content: config.twitterCard ?? "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...imageMeta(image),
    ];

    if (validDateTime(input.publishedTime)) {
      meta.push({ property: "article:published_time", content: input.publishedTime });
    }
    if (validDateTime(input.modifiedTime)) {
      meta.push({ property: "article:modified_time", content: input.modifiedTime });
    }
    if (input.productContext?.brand) {
      meta.push({ property: "product:brand", content: input.productContext.brand });
    }
    if (input.productContext?.availability) {
      meta.push({ property: "product:availability", content: input.productContext.availability });
    }
    if (input.productContext?.price && input.productContext.currency) {
      meta.push({ property: "product:price:amount", content: input.productContext.price });
      meta.push({ property: "product:price:currency", content: input.productContext.currency });
    }

    const links: Array<{ rel: string; href: string; hreflang?: string }> = [
      { rel: "canonical", href: canonical },
    ];
    for (const alternate of input.alternates ?? []) {
      links.push({
        rel: "alternate",
        href: buildCanonicalUrl(config, { pathname: alternate.pathname, retainPage: true }),
        hreflang: alternate.locale,
      });
    }

    const head: TanStackHeadDescriptor = {
      title,
      meta,
      links,
    };
    return { head, canonical, robots, issues };
  }
}

export function createMetadataFactory(config: MetadataFactoryConfig): Readonly<{
  build: (input: MetadataInput) => MetadataBuildResult;
}> {
  const registry = new MetadataRegistry();
  return {
    build: (input) => registry.build(config, input),
  };
}
