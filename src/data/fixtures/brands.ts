import type { Brand } from "../../domain/catalog";
const luxuryImage = "/media/kronos-product-luxury-royal-oak.webp";
const sportImage = "/media/kronos-product-sport-carrera.webp";
const classicImage = "/media/kronos-product-classic-datejust.webp";
const smartImage = "/media/kronos-product-smart-apple-watch.webp";

const BRAND_ASSET_URLS = {
  "kronos-product-luxury-royal-oak.webp": luxuryImage,
  "kronos-product-sport-carrera.webp": sportImage,
  "kronos-product-classic-datejust.webp": classicImage,
  "kronos-product-smart-apple-watch.webp": smartImage,
} as const;

const media = (
  id: string,
  fileName: keyof typeof BRAND_ASSET_URLS,
  role: "logo" | "hero",
  alt: string,
) => ({
  type: "image" as const,
  id,
  url: BRAND_ASSET_URLS[fileName],
  alt,
  dimensions: { width: 1200, height: 1200 },
  sortOrder: 0,
  role,
});

export const CATALOG_BRANDS: readonly Brand[] = [
  {
    id: "brand_audemars_piguet",
    slug: "audemars-piguet",
    name: "Audemars Piguet",
    localizedName: { default: "اودمار پیگه", values: { en: "Audemars Piguet", fa: "اودمار پیگه" } },
    logo: media(
      "media_brand_ap_logo",
      "kronos-product-luxury-royal-oak.webp",
      "logo",
      "Audemars Piguet",
    ),
    originCountryCode: "CH",
    description: { default: "ساعت‌سازی سوئیسی با مجموعه شناخته‌شده Royal Oak." },
    officialStatus: { status: "unverified" },
    seo: {
      title: "Audemars Piguet | KRONOS",
      description: "مشاهده ساعت‌های Audemars Piguet در کاتالوگ KRONOS.",
      canonicalPath: "/brands/audemars-piguet",
      robots: "index,follow",
      structuredDataType: "Brand",
    },
    featured: true,
    productCount: 1,
    relatedArticleIds: [],
  },
  {
    id: "brand_tag_heuer",
    slug: "tag-heuer",
    name: "TAG Heuer",
    localizedName: { default: "تگ هویر", values: { en: "TAG Heuer", fa: "تگ هویر" } },
    logo: media(
      "media_brand_tag_logo",
      "kronos-product-sport-carrera.webp",
      "logo",
      "TAG Heuer",
    ),
    originCountryCode: "CH",
    description: { default: "ساعت‌سازی سوئیسی با پیوند تاریخی با زمان‌سنجی و موتوراسپرت." },
    officialStatus: { status: "unverified" },
    seo: {
      title: "TAG Heuer | KRONOS",
      description: "مشاهده ساعت‌های TAG Heuer در کاتالوگ KRONOS.",
      canonicalPath: "/brands/tag-heuer",
      robots: "index,follow",
      structuredDataType: "Brand",
    },
    featured: true,
    productCount: 1,
    relatedArticleIds: [],
  },
  {
    id: "brand_rolex",
    slug: "rolex",
    name: "Rolex",
    localizedName: { default: "رولکس", values: { en: "Rolex", fa: "رولکس" } },
    logo: media(
      "media_brand_rolex_logo",
      "kronos-product-classic-datejust.webp",
      "logo",
      "Rolex",
    ),
    originCountryCode: "CH",
    description: { default: "ساعت‌سازی سوئیسی با مجموعه‌های شناخته‌شده‌ای مانند Datejust." },
    officialStatus: { status: "unverified" },
    seo: {
      title: "Rolex | KRONOS",
      description: "مشاهده ساعت‌های Rolex در کاتالوگ KRONOS.",
      canonicalPath: "/brands/rolex",
      robots: "index,follow",
      structuredDataType: "Brand",
    },
    featured: true,
    productCount: 1,
    relatedArticleIds: [],
  },
  {
    id: "brand_apple",
    slug: "apple",
    name: "Apple",
    localizedName: { default: "اپل", values: { en: "Apple", fa: "اپل" } },
    logo: media(
      "media_brand_apple_logo",
      "kronos-product-smart-apple-watch.webp",
      "logo",
      "Apple",
    ),
    originCountryCode: "US",
    description: { default: "محصولات پوشیدنی هوشمند با تمرکز بر سلامت، ارتباط و اکوسیستم اپل." },
    officialStatus: { status: "unverified" },
    seo: {
      title: "Apple Watch | KRONOS",
      description: "مشاهده Apple Watch در کاتالوگ KRONOS.",
      canonicalPath: "/brands/apple",
      robots: "index,follow",
      structuredDataType: "Brand",
    },
    featured: true,
    productCount: 1,
    relatedArticleIds: [],
  },
] as const;

/** Compatibility export for existing imports while the project is migrated. */
export const FIXTURE_BRANDS = CATALOG_BRANDS;
