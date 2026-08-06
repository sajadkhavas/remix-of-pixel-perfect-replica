import type { Product, ProductPricing, ProductVariant } from "../../domain/product";
import type { Money } from "../../domain/shared";

const irr = (amountMinor: number): Money => ({ amountMinor, currency: "IRR", fractionDigits: 0 });
const price = (list: number, sale?: number): ProductPricing => ({
  listPrice: irr(list),
  salePrice: sale === undefined ? undefined : irr(sale),
  effectivePrice: irr(sale ?? list),
  taxIncluded: true,
});
const image = (productId: string, fileName: string) => ({
  type: "image" as const,
  id: `media_${productId}_primary`,
  url: new URL(`../../assets/${fileName}`, import.meta.url).href,
  alt: `تصویر fixture ${productId}`,
  dimensions: { width: 768, height: 768 },
  sortOrder: 0,
  role: "primary" as const,
});
const option = (key: string, valueKey: string, label: string) => ({
  optionKey: key,
  valueKey,
  label: { default: label },
});

function variant(args: {
  id: string;
  productId: string;
  sku: string;
  pricing: ProductPricing;
  stock: ProductVariant["inventory"]["status"];
  quantity?: number;
  optionValues: ProductVariant["optionValues"];
  isDefault: boolean;
}): ProductVariant {
  return {
    id: args.id,
    productId: args.productId,
    sku: args.sku,
    optionValues: args.optionValues,
    pricing: args.pricing,
    inventory: {
      tracking: args.quantity === undefined ? "not-tracked" : "tracked",
      status: args.stock,
      availableQuantity: args.quantity,
      reservedQuantity: args.quantity === undefined ? undefined : 0,
      backorderable: args.stock === "backorder",
      minOrderQuantity: 1,
      maxOrderQuantity: args.quantity,
      orderIncrement: 1,
    },
    mediaIds: [`media_${args.productId}_primary`],
    status: args.stock === "out-of-stock" ? "unavailable" : "active",
    isDefault: args.isDefault,
  };
}

/** Products, brands, descriptions and claims below are explicitly fictional development data. */
export const FIXTURE_PRODUCTS: readonly Product[] = [
  {
    schemaVersion: 1,
    identity: {
      id: "product_aurelius_aurora",
      slug: "aurelius-aurora-automatic-40",
      productGroupId: "AURORA-AUTO",
      primarySku: "AUR-AUTO-40-BLU",
    },
    status: "active",
    condition: "new",
    content: {
      name: {
        default: "اورلیوس آرورا اتوماتیک ۴۰",
        values: { en: "Aurelius Aurora Automatic 40", fa: "اورلیوس آرورا اتوماتیک ۴۰" },
      },
      shortDescription: { default: "ساعت مکانیکی خیالی با دو variant صفحه." },
      description: { default: "محصول fixture برای توسعه مدل variant، قیمت و موجودی." },
      highlights: [{ default: "موتور اتوماتیک" }, { default: "شیشه سافایر" }],
    },
    media: {
      primaryMediaId: "media_product_aurelius_aurora_primary",
      assets: [image("product_aurelius_aurora", "watch-1.jpg")],
    },
    brandId: "brand_aurelius",
    categoryIds: ["category_shop", "category_luxury"],
    primaryCategoryId: "category_luxury",
    collectionIds: ["collection_aurora"],
    audienceKeys: ["unisex"],
    styleKeys: ["luxury", "classic"],
    movementKey: "automatic",
    specificationValues: [
      {
        key: "case-diameter",
        label: { default: "قطر قاب" },
        value: { type: "number", value: 40, unit: "mm" },
        group: "dimensions",
        filterValueKeys: ["40"],
        sortOrder: 1,
      },
      {
        key: "case-material",
        label: { default: "جنس قاب" },
        value: { type: "text", value: "stainless-steel" },
        group: "case",
        filterValueKeys: ["stainless-steel"],
        sortOrder: 2,
      },
      {
        key: "water-resistance",
        label: { default: "مقاومت آب" },
        value: { type: "number", value: 100, unit: "m" },
        group: "case",
        filterValueKeys: ["100m"],
        sortOrder: 3,
      },
    ],
    variants: [
      variant({
        id: "variant_aurelius_aurora_blue",
        productId: "product_aurelius_aurora",
        sku: "AUR-AUTO-40-BLU",
        pricing: price(48000000000, 44500000000),
        stock: "low-stock",
        quantity: 2,
        optionValues: [option("dial-color", "blue", "آبی")],
        isDefault: true,
      }),
      variant({
        id: "variant_aurelius_aurora_black",
        productId: "product_aurelius_aurora",
        sku: "AUR-AUTO-40-BLK",
        pricing: price(48000000000),
        stock: "out-of-stock",
        quantity: 0,
        optionValues: [option("dial-color", "black", "مشکی")],
        isDefault: false,
      }),
    ],
    defaultVariantId: "variant_aurelius_aurora_blue",
    badges: ["sale", "limited-edition"],
    reviewSummary: {
      ratingValue: 4.7,
      ratingCount: 34,
      reviewCount: 28,
      bestRating: 5,
      worstRating: 1,
    },
    shipping: { shippable: true, dispatchEstimateDays: { min: 1, max: 3 } },
    returns: { returnable: true, windowDays: 7, policyPagePath: "/shipping-returns" },
    warranty: {
      type: "seller",
      durationMonths: 24,
      providerName: "KRONOS Fixture Warranty",
      policyPagePath: "/warranty",
    },
    seo: {
      title: "اورلیوس آرورا اتوماتیک ۴۰ | KRONOS",
      description: "صفحه fixture محصول.",
      canonicalPath: "/product/aurelius-aurora-automatic-40",
      robots: "noindex,follow",
      structuredDataType: "ProductGroup",
    },
    trustEvidenceRefs: [],
    releasedAt: "2026-04-10T00:00:00Z",
    publishedAt: "2026-04-15T00:00:00Z",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-07-20T00:00:00Z",
  },
  {
    schemaVersion: 1,
    identity: {
      id: "product_kavian_heritage",
      slug: "kavian-heritage-mechanical-38",
      productGroupId: "KAV-HERITAGE",
      primarySku: "KAV-MECH-38-CRM",
    },
    status: "unavailable",
    condition: "new",
    content: {
      name: { default: "کاویان هریتیج مکانیکی ۳۸" },
      shortDescription: { default: "fixture برای وضعیت ناموجود و داده اختیاری ناقص." },
      description: { default: "این محصول صرفاً داده توسعه است." },
      highlights: [{ default: "کوک دستی" }],
    },
    media: {
      primaryMediaId: "media_product_kavian_heritage_primary",
      assets: [image("product_kavian_heritage", "watch-5.jpg")],
    },
    brandId: "brand_kavian",
    categoryIds: ["category_shop", "category_classic"],
    primaryCategoryId: "category_classic",
    collectionIds: [],
    audienceKeys: ["unisex"],
    styleKeys: ["classic"],
    movementKey: "mechanical",
    specificationValues: [
      {
        key: "case-diameter",
        label: { default: "قطر قاب" },
        value: { type: "number", value: 38, unit: "mm" },
        group: "dimensions",
        filterValueKeys: ["38"],
        sortOrder: 1,
      },
    ],
    variants: [
      variant({
        id: "variant_kavian_heritage_cream",
        productId: "product_kavian_heritage",
        sku: "KAV-MECH-38-CRM",
        pricing: price(980000000),
        stock: "out-of-stock",
        quantity: 0,
        optionValues: [option("dial-color", "cream", "کرم")],
        isDefault: true,
      }),
    ],
    defaultVariantId: "variant_kavian_heritage_cream",
    badges: [],
    shipping: { shippable: true },
    returns: { returnable: false, policyPagePath: "/shipping-returns" },
    warranty: { type: "none" },
    seo: {
      title: "کاویان هریتیج مکانیکی ۳۸ | KRONOS",
      description: "محصول fixture ناموجود.",
      canonicalPath: "/product/kavian-heritage-mechanical-38",
      robots: "noindex,follow",
      structuredDataType: "Product",
    },
    trustEvidenceRefs: [],
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    schemaVersion: 1,
    identity: {
      id: "product_orion_pulse_x",
      slug: "orion-pulse-x-smartwatch",
      productGroupId: "ORION-PULSE-X",
      primarySku: "ORX-46-BLK",
    },
    status: "active",
    condition: "new",
    content: {
      name: { default: "اوریون پالس X" },
      shortDescription: { default: "fixture ساعت هوشمند با موجودی untracked." },
      description: { default: "داده توسعه برای compatibility و موجودی." },
      highlights: [{ default: "سازگاری iOS و Android" }],
    },
    media: {
      primaryMediaId: "media_product_orion_pulse_x_primary",
      assets: [image("product_orion_pulse_x", "watch-6.jpg")],
    },
    brandId: "brand_orion",
    categoryIds: ["category_shop", "category_smart"],
    primaryCategoryId: "category_smart",
    collectionIds: [],
    audienceKeys: ["unisex"],
    styleKeys: ["smart", "sport"],
    movementKey: "digital-smart",
    specificationValues: [
      {
        key: "compatibility",
        label: { default: "سازگاری" },
        value: { type: "list", values: ["ios", "android"] },
        group: "compatibility",
        filterValueKeys: ["ios", "android"],
        sortOrder: 1,
      },
    ],
    variants: [
      variant({
        id: "variant_orion_pulse_x_black",
        productId: "product_orion_pulse_x",
        sku: "ORX-46-BLK",
        pricing: price(620000000),
        stock: "not-tracked",
        optionValues: [option("case-color", "black", "مشکی")],
        isDefault: true,
      }),
    ],
    defaultVariantId: "variant_orion_pulse_x_black",
    badges: ["new"],
    shipping: { shippable: true, dispatchEstimateDays: { min: 1, max: 2 } },
    returns: { returnable: true, windowDays: 7, policyPagePath: "/shipping-returns" },
    warranty: { type: "seller", durationMonths: 12, policyPagePath: "/warranty" },
    seo: {
      title: "اوریون پالس X | KRONOS",
      description: "محصول fixture ساعت هوشمند.",
      canonicalPath: "/product/orion-pulse-x-smartwatch",
      robots: "noindex,follow",
      structuredDataType: "Product",
    },
    trustEvidenceRefs: [],
    releasedAt: "2026-07-01T00:00:00Z",
    publishedAt: "2026-07-01T00:00:00Z",
    createdAt: "2026-06-20T00:00:00Z",
    updatedAt: "2026-07-22T00:00:00Z",
  },
] as const;
