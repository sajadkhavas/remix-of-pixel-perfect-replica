import type { CanonicalBuildInput, SiteUrlOptions } from "./types";

export const TRACKING_PARAMETER_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

const TRACKING_KEYS = new Set<string>(TRACKING_PARAMETER_KEYS);
const SAFE_PATH_SEGMENT = /^[a-z0-9]+(?:[._~-]?[a-z0-9]+)*$/;
function containsControlCharacter(value: string): boolean {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint !== undefined && (codePoint <= 0x1f || codePoint === 0x7f)) return true;
  }
  return false;
}

export class SeoUrlError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "SeoUrlError";
    this.code = code;
  }
}

function parseHttpOrigin(value: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new SeoUrlError("invalid-site-url", "Site URL must be an absolute HTTP(S) URL.");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new SeoUrlError("invalid-site-url-scheme", "Site URL must use HTTP or HTTPS.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new SeoUrlError(
      "invalid-site-url-components",
      "Site URL cannot contain credentials, query parameters, or fragments.",
    );
  }
  parsed.pathname = "/";
  return parsed;
}

export function resolveSiteOrigin(options: SiteUrlOptions): string {
  const value = options.siteUrl?.trim();
  if (!value) {
    if (options.environment === "production") {
      throw new SeoUrlError(
        "missing-production-site-url",
        "Production SEO requires an explicit site URL from F12/deployment configuration.",
      );
    }
    throw new SeoUrlError(
      "missing-site-url",
      `SEO URL generation requires an explicit site URL in ${options.environment}.`,
    );
  }
  return parseHttpOrigin(value).origin;
}

function decodeSafePathSegment(segment: string): string {
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    throw new SeoUrlError("malformed-path-encoding", "Path contains malformed percent encoding.");
  }
  if (
    !decoded ||
    decoded === "." ||
    decoded === ".." ||
    decoded.includes("/") ||
    decoded.includes("\\") ||
    containsControlCharacter(decoded)
  ) {
    throw new SeoUrlError("unsafe-path-segment", "Path contains an unsafe segment.");
  }
  const normalized = decoded.toLowerCase();
  if (!SAFE_PATH_SEGMENT.test(normalized)) {
    throw new SeoUrlError(
      "invalid-path-segment",
      "Canonical path segments must use stable lowercase ASCII characters.",
    );
  }
  return normalized;
}

export function normalizePathname(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "/";

  let pathname = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    pathname = new URL(trimmed).pathname;
  } else {
    pathname = trimmed.split(/[?#]/, 1)[0] ?? "/";
  }

  const rawSegments = pathname.replace(/\\/g, "/").split("/").filter(Boolean);
  if (rawSegments.length === 0) return "/";
  return `/${rawSegments.map(decodeSafePathSegment).join("/")}`;
}

export function isOfficialCatalogPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  return normalized === "/shop" || normalized.startsWith("/shop/");
}

export function absoluteUrl(origin: string, pathname: string, search = ""): string {
  const normalizedOrigin = parseHttpOrigin(origin).origin;
  const normalizedPath = normalizePathname(pathname);
  const query = search.replace(/^\?/, "");
  return `${normalizedOrigin}${normalizedPath}${query ? `?${query}` : ""}`;
}

function normalizeQueryValue(value: string): string | null {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

export function normalizeCanonicalSearch(
  search: string | URLSearchParams | undefined,
  allowedQueryKeys: readonly string[] = [],
  retainPage = false,
): string {
  const params =
    search instanceof URLSearchParams
      ? new URLSearchParams(search)
      : new URLSearchParams((search ?? "").replace(/^\?/, ""));
  const allowed = new Set(allowedQueryKeys.map((key) => key.toLowerCase()));
  if (retainPage) allowed.add("page");

  const pairs: Array<readonly [string, string]> = [];
  params.forEach((rawValue, rawKey) => {
    const key = rawKey.trim().toLowerCase();
    if (!key || TRACKING_KEYS.has(key) || !allowed.has(key)) return;
    const value = normalizeQueryValue(rawValue);
    if (value === null) return;
    if (key === "page") {
      const page = Number(value);
      if (!Number.isSafeInteger(page) || page <= 1) return;
      pairs.push([key, String(page)]);
      return;
    }
    pairs.push([key, value]);
  });

  pairs.sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    const keyComparison = leftKey.localeCompare(rightKey, "en");
    return keyComparison || leftValue.localeCompare(rightValue, "en");
  });

  const normalized = new URLSearchParams();
  for (const [key, value] of pairs) normalized.append(key, value);
  return normalized.toString();
}

export function buildCanonicalUrl(options: SiteUrlOptions, input: CanonicalBuildInput): string {
  const origin = resolveSiteOrigin(options);
  const search = normalizeCanonicalSearch(
    input.search,
    input.allowedQueryKeys,
    input.retainPage ?? false,
  );
  return absoluteUrl(origin, input.pathname, search);
}

export function buildPaginationCanonical(
  options: SiteUrlOptions,
  pathname: string,
  page: number,
): string {
  const search = Number.isSafeInteger(page) && page > 1 ? `page=${page}` : "";
  return buildCanonicalUrl(options, { pathname, search, retainPage: true });
}

export function stripTrackingParameters(search: string | URLSearchParams): string {
  const params =
    search instanceof URLSearchParams
      ? new URLSearchParams(search)
      : new URLSearchParams(search.replace(/^\?/, ""));
  for (const key of [...params.keys()]) {
    if (TRACKING_KEYS.has(key.toLowerCase())) params.delete(key);
  }
  const pairs = [...params.entries()].sort(([aKey, aValue], [bKey, bValue]) => {
    const keyComparison = aKey.localeCompare(bKey, "en");
    return keyComparison || aValue.localeCompare(bValue, "en");
  });
  const result = new URLSearchParams();
  for (const [key, value] of pairs) result.append(key, value);
  return result.toString();
}
