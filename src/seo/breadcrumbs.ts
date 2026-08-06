import type { SiteUrlOptions } from "./types";
import { absoluteUrl, resolveSiteOrigin } from "./site-url";
import { buildBreadcrumbList } from "./structured-data";
import type { JsonValue } from "./json-ld";

export interface BreadcrumbInputItem {
  readonly label: string;
  readonly pathname: string;
}

export interface BuiltBreadcrumbItem {
  readonly label: string;
  readonly pathname: string;
  readonly url: string;
  readonly position: number;
  readonly current: boolean;
}

export interface BreadcrumbBuilderOptions extends SiteUrlOptions {
  readonly homeLabel?: string;
  readonly homePathname?: string;
}

export function buildBreadcrumbs(
  options: BreadcrumbBuilderOptions,
  items: readonly BreadcrumbInputItem[],
): Readonly<{
  items: readonly BuiltBreadcrumbItem[];
  structuredData: Readonly<Record<string, JsonValue>>;
}> {
  const origin = resolveSiteOrigin(options);
  const fullItems: BreadcrumbInputItem[] = [
    {
      label: options.homeLabel?.trim() || "خانه",
      pathname: options.homePathname ?? "/",
    },
    ...items,
  ];
  const seen = new Set<string>();
  const built = fullItems.map((item, index) => {
    const label = item.label.trim();
    if (!label) throw new Error("Breadcrumb label cannot be empty.");
    const url = absoluteUrl(origin, item.pathname);
    if (seen.has(url)) throw new Error(`Duplicate breadcrumb URL: ${url}`);
    seen.add(url);
    return {
      label,
      pathname: new URL(url).pathname,
      url,
      position: index + 1,
      current: index === fullItems.length - 1,
    };
  });
  return {
    items: built,
    structuredData: buildBreadcrumbList(built.map((item) => ({ name: item.label, url: item.url }))),
  };
}

export function productBreadcrumbs(
  options: BreadcrumbBuilderOptions,
  input: Readonly<{
    categoryLabel?: string;
    categoryPathname?: string;
    productLabel: string;
    productPathname: string;
  }>,
) {
  const items: BreadcrumbInputItem[] = [{ label: "فروشگاه", pathname: "/shop" }];
  if (input.categoryLabel && input.categoryPathname) {
    items.push({ label: input.categoryLabel, pathname: input.categoryPathname });
  }
  items.push({ label: input.productLabel, pathname: input.productPathname });
  return buildBreadcrumbs(options, items);
}

export function brandBreadcrumbs(
  options: BreadcrumbBuilderOptions,
  brandLabel: string,
  brandPathname: string,
) {
  return buildBreadcrumbs(options, [
    { label: "برندها", pathname: "/brands" },
    { label: brandLabel, pathname: brandPathname },
  ]);
}

export function articleBreadcrumbs(
  options: BreadcrumbBuilderOptions,
  articleLabel: string,
  articlePathname: string,
) {
  return buildBreadcrumbs(options, [
    { label: "مجله", pathname: "/magazine" },
    { label: articleLabel, pathname: articlePathname },
  ]);
}
