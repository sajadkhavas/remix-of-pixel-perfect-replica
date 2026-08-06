import type {
  IndexabilityContext,
  IndexabilityDecision,
  RobotsDirective,
  SeoPageType,
} from "./types";
import {
  normalizeCanonicalSearch,
  normalizePathname,
  SeoUrlError,
  TRACKING_PARAMETER_KEYS,
} from "./site-url";

export const CURATED_SHOP_LANDINGS = [
  "/shop/men",
  "/shop/women",
  "/shop/luxury",
  "/shop/classic",
  "/shop/sport",
  "/shop/smart",
  "/shop/automatic",
  "/shop/mechanical",
  "/shop/quartz",
] as const;

const CURATED_LANDING_SET = new Set<string>(CURATED_SHOP_LANDINGS);
const PUBLIC_POLICY_PATHS = new Set([
  "/about",
  "/authenticity",
  "/warranty",
  "/shipping-returns",
  "/services",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/purchase-terms",
  "/payment-methods",
]);
const PRIVATE_EXACT_PATHS = new Set(["/cart", "/wishlist", "/compare", "/checkout", "/auth"]);
const FILTER_KEYS = new Set([
  "category",
  "brand",
  "audience",
  "style",
  "movement",
  "pricemin",
  "pricemax",
  "casesize",
  "casematerial",
  "strapmaterial",
  "dialcolor",
  "waterresistance",
  "availability",
  "discount",
]);
const SORT_VIEW_KEYS = new Set(["sort", "view"]);
const TRACKING_KEYS = new Set<string>(TRACKING_PARAMETER_KEYS);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function routeIdentity(pathname: string): Readonly<{ pageType: SeoPageType; validShape: boolean }> {
  if (pathname === "/") return { pageType: "home", validShape: true };
  if (pathname === "/shop") return { pageType: "shop", validShape: true };
  if (CURATED_LANDING_SET.has(pathname)) return { pageType: "curated-landing", validShape: true };
  if (pathname === "/brands") return { pageType: "brand-index", validShape: true };
  if (pathname === "/magazine") return { pageType: "magazine-index", validShape: true };
  if (pathname === "/search") return { pageType: "search", validShape: true };
  if (PUBLIC_POLICY_PATHS.has(pathname)) return { pageType: "policy", validShape: true };
  if (PRIVATE_EXACT_PATHS.has(pathname)) {
    const mapped: Partial<Record<string, SeoPageType>> = {
      "/cart": "cart",
      "/wishlist": "wishlist",
      "/compare": "compare",
      "/checkout": "checkout",
    };
    return { pageType: mapped[pathname] ?? "account", validShape: true };
  }
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    return { pageType: "account", validShape: true };
  }

  const matchers: ReadonlyArray<readonly [RegExp, SeoPageType]> = [
    [/^\/brands\/([a-z0-9]+(?:-[a-z0-9]+)*)$/, "brand"],
    [/^\/product\/([a-z0-9]+(?:-[a-z0-9]+)*)$/, "product"],
    [/^\/magazine\/([a-z0-9]+(?:-[a-z0-9]+)*)$/, "article"],
    [/^\/guides\/([a-z0-9]+(?:-[a-z0-9]+)*)$/, "guide"],
  ];
  for (const [pattern, pageType] of matchers) {
    const match = pattern.exec(pathname);
    if (match && match[1] && SLUG.test(match[1])) return { pageType, validShape: true };
  }
  return { pageType: "unknown", validShape: false };
}

function noindex(
  pageType: SeoPageType,
  normalizedPath: string,
  canonicalPath: string | null,
  reason: string,
  robots: RobotsDirective = "noindex,follow",
): IndexabilityDecision {
  return {
    pageType,
    robots,
    indexable: false,
    canonicalPath,
    normalizedPath,
    reason,
  };
}

function hasInvalidContentState(pageType: SeoPageType, context: IndexabilityContext): boolean {
  if (context.pageExists === false) return true;
  if (["brand", "product", "policy"].includes(pageType)) return context.contentValid !== true;
  if (["article", "guide"].includes(pageType)) {
    return context.contentValid !== true || context.published !== true;
  }
  if (pageType === "curated-landing") return context.contentUseful !== true;
  return false;
}

export function classifyIndexability(
  rawUrl: string,
  context: IndexabilityContext = {},
): IndexabilityDecision {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl, "https://seo.invalid");
  } catch {
    return noindex("unknown", "/", null, "malformed-url", "noindex,nofollow");
  }

  let normalizedPath: string;
  try {
    normalizedPath = normalizePathname(parsed.pathname);
  } catch (error) {
    const reason = error instanceof SeoUrlError ? error.code : "invalid-path";
    return noindex("unknown", "/", null, reason, "noindex,nofollow");
  }

  if (normalizedPath === "/watches" || normalizedPath.startsWith("/watches/")) {
    return noindex("unknown", normalizedPath, null, "forbidden-catalog-family", "noindex,nofollow");
  }

  const route = routeIdentity(normalizedPath);
  if (!route.validShape) {
    return noindex("unknown", normalizedPath, null, "unknown-route", "noindex,nofollow");
  }

  if (["search", "cart", "wishlist", "compare"].includes(route.pageType)) {
    return noindex(route.pageType, normalizedPath, normalizedPath, `${route.pageType}-noindex`);
  }
  if (["checkout", "account"].includes(route.pageType)) {
    return noindex(
      route.pageType,
      normalizedPath,
      normalizedPath,
      `${route.pageType}-private`,
      "noindex,nofollow",
    );
  }
  if (hasInvalidContentState(route.pageType, context)) {
    return noindex(route.pageType, normalizedPath, null, "content-not-validated");
  }

  const nonTrackingKeys = [...parsed.searchParams.keys()]
    .map((key) => key.toLowerCase())
    .filter((key) => !TRACKING_KEYS.has(key));
  const hasFilters = nonTrackingKeys.some((key) => FILTER_KEYS.has(key));
  const hasSortOrView = nonTrackingKeys.some((key) => SORT_VIEW_KEYS.has(key));
  const unknownKeys = nonTrackingKeys.filter(
    (key) => key !== "page" && !FILTER_KEYS.has(key) && !SORT_VIEW_KEYS.has(key),
  );

  if (hasFilters) {
    return noindex(route.pageType, normalizedPath, normalizedPath, "arbitrary-facet-combination");
  }
  if (hasSortOrView) {
    return noindex(route.pageType, normalizedPath, normalizedPath, "sort-or-view-variant");
  }
  if (unknownKeys.length > 0) {
    return noindex(route.pageType, normalizedPath, normalizedPath, "invalid-query-parameter");
  }

  const pageValues = parsed.searchParams.getAll("page");
  if (pageValues.length > 1) {
    return noindex(route.pageType, normalizedPath, normalizedPath, "duplicate-page-parameter");
  }
  if (pageValues.length === 1) {
    const page = Number(pageValues[0]);
    const paginatable = [
      "shop",
      "curated-landing",
      "brand-index",
      "brand",
      "magazine-index",
    ].includes(route.pageType);
    if (!paginatable || !Number.isSafeInteger(page) || page < 1) {
      return noindex(route.pageType, normalizedPath, normalizedPath, "invalid-pagination");
    }
  }

  const canonicalSearch = normalizeCanonicalSearch(parsed.searchParams, [], true);
  const canonicalPath = `${normalizedPath}${canonicalSearch ? `?${canonicalSearch}` : ""}`;
  return {
    pageType: route.pageType,
    robots: "index,follow",
    indexable: true,
    canonicalPath,
    normalizedPath,
    reason: canonicalSearch ? "clean-pagination" : "approved-indexable-route",
  };
}
