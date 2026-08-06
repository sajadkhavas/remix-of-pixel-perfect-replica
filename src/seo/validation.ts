import type { MetadataBuildResult, SeoValidationIssue } from "./types";
import type { SitemapCollection } from "./sitemap";
import { toSafeJsonValue, type JsonValue } from "./json-ld";

function issue(
  code: string,
  severity: "error" | "warning" | "info",
  message: string,
  path?: string,
): SeoValidationIssue {
  return { code, severity, message, path };
}

function absoluteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function findMeta(result: MetadataBuildResult, key: string): string | undefined {
  return result.head.meta.find((meta) => meta.name === key || meta.property === key)?.content;
}

export function validateMetadata(result: MetadataBuildResult): readonly SeoValidationIssue[] {
  const issues: SeoValidationIssue[] = [...result.issues];
  const title = result.head.title.trim();
  const description = findMeta(result, "description")?.trim() ?? "";
  if (title.length < 20) {
    issues.push(issue("title-too-short", "warning", "Title is shorter than 20 characters."));
  }
  if (title.length > 65) {
    issues.push(issue("title-too-long", "warning", "Title is longer than 65 characters."));
  }
  if (!description) {
    issues.push(issue("description-empty", "error", "Meta description is empty."));
  } else if (description.length > 170) {
    issues.push(
      issue("description-too-long", "warning", "Meta description is longer than 170 characters."),
    );
  }
  if (!absoluteHttpUrl(result.canonical)) {
    issues.push(issue("canonical-invalid", "error", "Canonical must be an absolute HTTP(S) URL."));
  }
  if (result.robots === "index,follow" && !result.canonical) {
    issues.push(
      issue("indexable-without-canonical", "error", "Indexable metadata requires a canonical URL."),
    );
  }
  const ogImage = findMeta(result, "og:image");
  if (ogImage && !absoluteHttpUrl(ogImage)) {
    issues.push(issue("og-image-invalid", "error", "Open Graph image must be absolute."));
  }
  if (ogImage) {
    const width = Number(findMeta(result, "og:image:width"));
    const height = Number(findMeta(result, "og:image:height"));
    if (
      !Number.isSafeInteger(width) ||
      width <= 0 ||
      !Number.isSafeInteger(height) ||
      height <= 0
    ) {
      issues.push(
        issue("og-image-dimensions-invalid", "error", "Open Graph image dimensions are invalid."),
      );
    }
  }
  return issues;
}

export function detectDuplicateCanonicals(
  entries: readonly Readonly<{ pathname: string; canonical: string }>[],
): readonly SeoValidationIssue[] {
  const owners = new Map<string, string>();
  const issues: SeoValidationIssue[] = [];
  for (const entry of entries) {
    const previous = owners.get(entry.canonical);
    if (previous && previous !== entry.pathname) {
      issues.push(
        issue(
          "duplicate-canonical",
          "error",
          `Canonical is shared with ${previous}.`,
          entry.pathname,
        ),
      );
    } else {
      owners.set(entry.canonical, entry.pathname);
    }
  }
  return issues;
}

export function validateSitemapCollection(
  collection: SitemapCollection,
  noindexUrls: ReadonlySet<string> = new Set<string>(),
): readonly SeoValidationIssue[] {
  const issues: SeoValidationIssue[] = [];
  const seen = new Set<string>();
  for (const entry of collection.entries) {
    if (!absoluteHttpUrl(entry.loc)) {
      issues.push(issue("sitemap-url-invalid", "error", "Sitemap URL is invalid.", entry.loc));
    }
    if (noindexUrls.has(entry.loc)) {
      issues.push(
        issue("noindex-in-sitemap", "error", "Noindex URL is present in sitemap.", entry.loc),
      );
    }
    if (seen.has(entry.loc)) {
      issues.push(issue("duplicate-sitemap-url", "error", "Duplicate sitemap URL.", entry.loc));
    }
    seen.add(entry.loc);
  }
  return issues;
}

function isObject(value: JsonValue): value is Readonly<Record<string, JsonValue>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectTypedObjects(
  value: JsonValue,
  type: string,
  result: Readonly<Record<string, JsonValue>>[] = [],
): readonly Readonly<Record<string, JsonValue>>[] {
  if (Array.isArray(value)) {
    for (const item of value) collectTypedObjects(item, type, result);
    return result;
  }
  if (!isObject(value)) return result;
  if (value["@type"] === type) result.push(value);
  for (const child of Object.values(value)) collectTypedObjects(child, type, result);
  return result;
}

export interface StructuredDataValidationContext {
  readonly reviewEvidenceCount?: number;
}

export function validateStructuredData(
  input: unknown,
  context: StructuredDataValidationContext = {},
): readonly SeoValidationIssue[] {
  const issues: SeoValidationIssue[] = [];
  let value: JsonValue;
  try {
    value = toSafeJsonValue(input);
  } catch (error) {
    issues.push(
      issue(
        "json-ld-malformed",
        "error",
        error instanceof Error ? error.message : "JSON-LD is malformed.",
      ),
    );
    return issues;
  }
  if (!isObject(value) || typeof value["@type"] !== "string") {
    issues.push(issue("json-ld-type-missing", "error", "JSON-LD root requires @type."));
    return issues;
  }

  for (const product of [
    ...collectTypedObjects(value, "Product"),
    ...collectTypedObjects(value, "ProductGroup"),
  ]) {
    if (typeof product.name !== "string" || !product.name.trim()) {
      issues.push(issue("product-name-missing", "error", "Product schema requires a name."));
    }
  }
  for (const offer of collectTypedObjects(value, "Offer")) {
    if (typeof offer.priceCurrency !== "string" || !/^[A-Z]{3}$/.test(offer.priceCurrency)) {
      issues.push(issue("offer-currency-missing", "error", "Offer requires valid priceCurrency."));
    }
    if (
      (typeof offer.price !== "string" && typeof offer.price !== "number") ||
      String(offer.price).trim() === ""
    ) {
      issues.push(issue("offer-price-missing", "error", "Offer requires a price."));
    }
  }
  const reviews = collectTypedObjects(value, "Review");
  if (reviews.length > (context.reviewEvidenceCount ?? 0)) {
    issues.push(
      issue(
        "review-without-evidence",
        "error",
        "Review schema count exceeds supplied evidence count.",
      ),
    );
  }
  for (const article of collectTypedObjects(value, "Article")) {
    if (
      typeof article.datePublished !== "string" ||
      Number.isNaN(Date.parse(article.datePublished))
    ) {
      issues.push(
        issue("article-date-invalid", "error", "Article requires a valid datePublished."),
      );
    }
  }
  for (const breadcrumb of collectTypedObjects(value, "BreadcrumbList")) {
    const items = breadcrumb.itemListElement;
    if (!Array.isArray(items) || items.length === 0) {
      issues.push(issue("breadcrumb-empty", "error", "BreadcrumbList requires items."));
      continue;
    }
    items.forEach((item, index) => {
      if (!isObject(item) || item.position !== index + 1) {
        issues.push(
          issue("breadcrumb-position-invalid", "error", "Breadcrumb positions must be sequential."),
        );
      }
    });
  }
  return issues;
}

export interface SeoValidationReport {
  readonly valid: boolean;
  readonly issues: readonly SeoValidationIssue[];
  readonly summary: Readonly<{ errors: number; warnings: number; info: number }>;
}

export function createSeoValidationReport(
  issueGroups: readonly (readonly SeoValidationIssue[])[],
): SeoValidationReport {
  const issues = issueGroups.flat();
  const errors = issues.filter((entry) => entry.severity === "error").length;
  const warnings = issues.filter((entry) => entry.severity === "warning").length;
  const info = issues.filter((entry) => entry.severity === "info").length;
  return { valid: errors === 0, issues, summary: { errors, warnings, info } };
}
