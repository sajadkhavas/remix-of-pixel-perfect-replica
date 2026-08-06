import type { Category } from "../../domain/catalog";
import { createBreadcrumb } from "../../domain/catalog";

const filters = [
  "brand",
  "audience",
  "style",
  "movement",
  "price",
  "case-diameter",
  "case-material",
  "strap-material",
  "dial-color",
  "water-resistance",
  "availability",
  "discount",
] as const;
const sorts = ["newest", "price-asc", "price-desc", "popular", "best-rated", "discount"] as const;

const category = (id: string, slug: string, label: string): Category => ({
  id,
  slug,
  parentId: "category_shop",
  childIds: [],
  depth: 1,
  title: { default: label },
  intro: { default: `دسته fixture ${label}.` },
  seo: {
    title: `${label} | KRONOS`,
    description: `مجموعه ${label}.`,
    canonicalPath: `/shop/${slug}`,
    robots: "index,follow",
    structuredDataType: "CollectionPage",
  },
  allowedFilterKeys: filters,
  allowedSortKeys: sorts,
  indexability: "index",
  breadcrumb: createBreadcrumb([
    { type: "home", label: "خانه", href: "/" },
    { type: "shop", label: "فروشگاه", href: "/shop" },
    { type: "category", label },
  ]),
});

export const FIXTURE_CATEGORIES: readonly Category[] = [
  {
    id: "category_shop",
    slug: "shop",
    childIds: ["category_luxury", "category_classic", "category_smart"],
    depth: 0,
    title: { default: "فروشگاه", values: { en: "Shop", fa: "فروشگاه" } },
    intro: { default: "ریشه کاتالوگ KRONOS." },
    seo: {
      title: "فروشگاه ساعت | KRONOS",
      description: "کاوش مجموعه ساعت‌ها.",
      canonicalPath: "/shop",
      robots: "index,follow",
      structuredDataType: "CollectionPage",
    },
    allowedFilterKeys: filters,
    allowedSortKeys: sorts,
    indexability: "index",
    breadcrumb: createBreadcrumb([
      { type: "home", label: "خانه", href: "/" },
      { type: "shop", label: "فروشگاه" },
    ]),
  },
  category("category_luxury", "luxury", "ساعت لوکس"),
  category("category_classic", "classic", "ساعت کلاسیک"),
  category("category_smart", "smart", "ساعت هوشمند"),
] as const;
