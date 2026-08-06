import type { SeoPageType } from "./types";
import { classifyIndexability } from "./indexability";

export type SitemapGroup = "static" | "products" | "categories" | "brands" | "magazine" | "guides";

export interface SitemapImageInput {
  readonly url: string;
  readonly caption?: string;
  readonly productionApproved: boolean;
}

export interface SitemapCandidate {
  readonly group: SitemapGroup;
  readonly pageType: SeoPageType;
  readonly url: string;
  readonly canonicalUrl: string;
  readonly indexable: boolean;
  readonly lastmod?: string;
  readonly images?: readonly SitemapImageInput[];
}

export interface SitemapEntry {
  readonly loc: string;
  readonly lastmod?: string;
  readonly images?: readonly Readonly<{ loc: string; caption?: string }>[];
}

export interface SitemapCollection {
  readonly group: SitemapGroup;
  readonly entries: readonly SitemapEntry[];
}

export interface SitemapIndexEntry {
  readonly loc: string;
  readonly lastmod?: string;
}

function httpUrl(value: string): string {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Sitemap URLs must use HTTP or HTTPS.");
  }
  parsed.hash = "";
  return parsed.href;
}

function validLastmod(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (Number.isNaN(Date.parse(value))) throw new Error(`Invalid sitemap lastmod: ${value}`);
  return value;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function createSitemapCollection(
  group: SitemapGroup,
  candidates: readonly SitemapCandidate[],
): SitemapCollection {
  const byCanonical = new Map<string, SitemapEntry>();
  for (const candidate of candidates) {
    if (candidate.group !== group || !candidate.indexable) continue;
    if (
      ["search", "cart", "wishlist", "compare", "checkout", "account"].includes(candidate.pageType)
    ) {
      continue;
    }
    const loc = httpUrl(candidate.url);
    const canonical = httpUrl(candidate.canonicalUrl);
    const classification = classifyIndexability(loc, {
      contentValid: true,
      contentUseful: true,
      published: true,
      pageExists: true,
    });
    if (!classification.indexable || classification.pageType !== candidate.pageType) continue;
    const classifiedCanonical = classification.canonicalPath
      ? new URL(classification.canonicalPath, loc).href
      : null;
    if (loc !== canonical || classifiedCanonical !== canonical) continue;
    if (byCanonical.has(canonical)) continue;
    const approvedImages = candidate.images
      ?.filter((image) => image.productionApproved)
      .map((image) => ({
        loc: httpUrl(image.url),
        caption: image.caption?.trim() || undefined,
      }));
    byCanonical.set(canonical, {
      loc: canonical,
      lastmod: validLastmod(candidate.lastmod),
      images: approvedImages?.length ? approvedImages : undefined,
    });
  }
  return {
    group,
    entries: [...byCanonical.values()].sort((left, right) =>
      left.loc.localeCompare(right.loc, "en"),
    ),
  };
}

export function createSitemapIndex(
  entries: readonly SitemapIndexEntry[],
): readonly SitemapIndexEntry[] {
  const result = new Map<string, SitemapIndexEntry>();
  for (const entry of entries) {
    const loc = httpUrl(entry.loc);
    if (!result.has(loc)) result.set(loc, { loc, lastmod: validLastmod(entry.lastmod) });
  }
  return [...result.values()].sort((left, right) => left.loc.localeCompare(right.loc, "en"));
}

export function serializeSitemapXml(collection: SitemapCollection): string {
  const hasImages = collection.entries.some((entry) => entry.images?.length);
  const namespace = hasImages
    ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : "";
  const rows = collection.entries.map((entry) => {
    const lastmod = entry.lastmod ? `<lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : "";
    const images =
      entry.images
        ?.map(
          (image) =>
            `<image:image><image:loc>${xmlEscape(image.loc)}</image:loc>${
              image.caption ? `<image:caption>${xmlEscape(image.caption)}</image:caption>` : ""
            }</image:image>`,
        )
        .join("") ?? "";
    return `<url><loc>${xmlEscape(entry.loc)}</loc>${lastmod}${images}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${namespace}>${rows.join("")}</urlset>`;
}

export function serializeSitemapIndexXml(entries: readonly SitemapIndexEntry[]): string {
  const rows = createSitemapIndex(entries).map(
    (entry) =>
      `<sitemap><loc>${xmlEscape(entry.loc)}</loc>${
        entry.lastmod ? `<lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : ""
      }</sitemap>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${rows.join("")}</sitemapindex>`;
}
