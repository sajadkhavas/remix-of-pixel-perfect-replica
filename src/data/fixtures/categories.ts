import type { Category } from "../../domain/catalog";
import { createBreadcrumb } from "../../domain/catalog";
const luxuryImage = "/media/kronos-product-luxury-royal-oak.webp";
const sportImage = "/media/kronos-product-sport-carrera.webp";
const classicImage = "/media/kronos-product-classic-datejust.webp";
const smartImage = "/media/kronos-product-smart-apple-watch.webp";

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

const sorts = ["newest", "price-asc", "price-desc", "discount"] as const;

const CATEGORY_ASSET_DIMENSIONS = {
  "kronos-product-luxury-royal-oak.webp": { width: 1122, height: 1402 },
  "kronos-product-sport-carrera.webp": { width: 1122, height: 1402 },
  "kronos-product-classic-datejust.webp": { width: 1122, height: 1402 },
  "kronos-product-smart-apple-watch.webp": { width: 1122, height: 1402 },
} as const;

const CATEGORY_ASSET_URLS: Record<
  keyof typeof CATEGORY_ASSET_DIMENSIONS,
  string
> = {
  "kronos-product-luxury-royal-oak.webp": luxuryImage,
  "kronos-product-sport-carrera.webp": sportImage,
  "kronos-product-classic-datejust.webp": classicImage,
  "kronos-product-smart-apple-watch.webp": smartImage,
};

const categoryImage = (
  id: string,
  fileName: keyof typeof CATEGORY_ASSET_DIMENSIONS,
  alt: string,
) => ({
  type: "image" as const,
  id,
  url: CATEGORY_ASSET_URLS[fileName],
  alt,
  dimensions: CATEGORY_ASSET_DIMENSIONS[fileName],
  sortOrder: 0,
  role: "hero" as const,
});

const category = (
  id: string,
  slug: string,
  label: string,
  english: string,
  intro: string,
  fileName: keyof typeof CATEGORY_ASSET_DIMENSIONS,
): Category => ({
  id,
  slug,
  parentId: "category_shop",
  childIds: [],
  depth: 1,
  title: { default: label, values: { en: english, fa: label } },
  intro: { default: intro },
  heroMedia: categoryImage(`media_${id}_hero`, fileName, `کالکشن ${label}`),
  seo: {
    title: `${label} | KRONOS`,
    description: intro,
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

export const CATALOG_CATEGORIES: readonly Category[] = [
  {
    id: "category_shop",
    slug: "shop",
    childIds: [
      "category_luxury",
      "category_sport",
      "category_classic",
      "category_smart",
    ],
    depth: 0,
    title: { default: "فروشگاه", values: { en: "Shop", fa: "فروشگاه" } },
    intro: { default: "مجموعه ساعت‌های منتخب KRONOS." },
    seo: {
      title: "فروشگاه ساعت | KRONOS",
      description: "ساعت‌ها را بر اساس سبک، برند، مشخصات و قیمت مرور کنید.",
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
  category(
    "category_luxury",
    "luxury",
    "ساعت لوکس",
    "Luxury",
    "ساعت‌های شاخص با طراحی ماندگار، پرداخت دقیق و هویت لوکس.",
    "kronos-product-luxury-royal-oak.webp",
  ),
  category(
    "category_sport",
    "sport",
    "ساعت اسپرت",
    "Sport",
    "ساعت‌های پویا و عملکردمحور برای استایل روزمره و فعال.",
    "kronos-product-sport-carrera.webp",
  ),
  category(
    "category_classic",
    "classic",
    "ساعت کلاسیک",
    "Classic",
    "فرم‌های متعادل و رسمی با جزئیاتی که از مد روز فراتر می‌روند.",
    "kronos-product-classic-datejust.webp",
  ),
  category(
    "category_smart",
    "smart",
    "ساعت هوشمند",
    "Smart",
    "فناوری پوشیدنی با تمرکز بر نمایشگر، سلامت و اتصال روزمره.",
    "kronos-product-smart-apple-watch.webp",
  ),
] as const;

/** Compatibility export for existing imports while the project is migrated. */
export const FIXTURE_CATEGORIES = CATALOG_CATEGORIES;
