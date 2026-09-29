import type { Product, ProductPricing, ProductVariant } from "../../domain/product";

import type { Money } from "../../domain/shared";

import luxuryImage from "../../assets/kronos-product-luxury-royal-oak.webp";

import sportImage from "../../assets/kronos-product-sport-carrera.webp";

import classicImage from "../../assets/kronos-product-classic-datejust.webp";

import smartImage from "../../assets/kronos-product-smart-apple-watch.webp";



const usd = (amount: number): Money => ({

  amountMinor: Math.round(amount * 100),

  currency: "USD",

  fractionDigits: 2,

});



const price = (list: number, sale?: number): ProductPricing => ({

  listPrice: usd(list),

  salePrice: sale === undefined ? undefined : usd(sale),

  effectivePrice: usd(sale ?? list),

  taxIncluded: false,

});



const ASSET_DIMENSIONS = {

  "kronos-product-luxury-royal-oak.webp": { width: 1122, height: 1402 },

  "kronos-product-sport-carrera.webp": { width: 1122, height: 1402 },

  "kronos-product-classic-datejust.webp": { width: 1122, height: 1402 },

  "kronos-product-smart-apple-watch.webp": { width: 1122, height: 1402 },

} as const;



const ASSET_URLS: Record<keyof typeof ASSET_DIMENSIONS, string> = {

  "kronos-product-luxury-royal-oak.webp": luxuryImage,

  "kronos-product-sport-carrera.webp": sportImage,

  "kronos-product-classic-datejust.webp": classicImage,

  "kronos-product-smart-apple-watch.webp": smartImage,

};



const image = (

  productId: string,

  fileName: keyof typeof ASSET_DIMENSIONS,

  alt: string,

  sortOrder = 0,

  role: "primary" | "gallery" = sortOrder === 0 ? "primary" : "gallery",

) => ({

  type: "image" as const,

  id: `media_${productId}_${sortOrder}`,

  url: ASSET_URLS[fileName],

  alt,

  dimensions: ASSET_DIMENSIONS[fileName],

  sortOrder,

  role,

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

  isDefault?: boolean;

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

      backorderable: false,

      minOrderQuantity: 1,

      maxOrderQuantity: args.quantity,

      orderIncrement: 1,

    },

    mediaIds: [`media_${args.productId}_0`],

    status: args.stock === "out-of-stock" ? "unavailable" : "active",

    isDefault: args.isDefault ?? true,

  };

}



export const CATALOG_PRODUCTS: readonly Product[] = [

  {

    schemaVersion: 1,

    identity: {

      id: "product_ap_royal_oak_15510st",

      slug: "audemars-piguet-royal-oak-15510st",

      productGroupId: "AP-ROYAL-OAK-15510ST",

      primarySku: "15510ST.OO.1320ST.01",

      mpn: "15510ST.OO.1320ST.01",

    },

    status: "active",

    condition: "new",

    content: {

      name: {

        default: "اودمار پیگه Royal Oak Selfwinding 41",

        values: {

          en: "Audemars Piguet Royal Oak Selfwinding 41",

          fa: "اودمار پیگه Royal Oak Selfwinding 41",

        },

      },

      shortDescription: {

        default: "Royal Oak استیل ۴۱ میلی‌متری با صفحه آبی Grande Tapisserie و کالیبر خودکوک 4302.",

      },

      description: {

        default:

          "Royal Oak Selfwinding با قاب و بریسلت استیل، صفحه آبی Grande Tapisserie، شیشه سافایر و موتور خودکوک Calibre 4302؛ ترکیبی از فرم هشت‌ضلعی شناخته‌شده و پرداخت دقیق.",

      },

      highlights: [

        { default: "قاب استیل ۴۱ میلی‌متری" },

        { default: "کالیبر خودکوک 4302" },

        { default: "ذخیره انرژی ۷۰ ساعت" },

        { default: "مقاومت آب ۵۰ متر" },

      ],

    },

    media: {

      primaryMediaId: "media_product_ap_royal_oak_15510st_0",

      assets: [

        image(

          "product_ap_royal_oak_15510st",

          "kronos-product-luxury-royal-oak.webp",

          "Audemars Piguet Royal Oak Selfwinding با صفحه آبی",

        ),

      ],

    },

    brandId: "brand_audemars_piguet",

    categoryIds: ["category_shop", "category_luxury"],

    primaryCategoryId: "category_luxury",

    collectionIds: ["collection_royal_oak"],

    audienceKeys: ["unisex"],

    styleKeys: ["luxury", "classic"],

    movementKey: "automatic",

    specificationValues: [

      {

        key: "case-diameter",

        label: { default: "قطر قاب" },

        value: { type: "number", value: 41, unit: "mm" },

        group: "dimensions",

        filterValueKeys: ["41"],

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

        key: "strap-material",

        label: { default: "جنس بند" },

        value: { type: "text", value: "stainless-steel" },

        group: "strap",

        filterValueKeys: ["stainless-steel"],

        sortOrder: 3,

      },

      {

        key: "water-resistance",

        label: { default: "مقاومت آب" },

        value: { type: "number", value: 50, unit: "m" },

        group: "case",

        filterValueKeys: ["50m"],

        sortOrder: 4,

      },

      {

        key: "power-reserve",

        label: { default: "ذخیره انرژی" },

        value: { type: "number", value: 70, unit: "h" },

        group: "movement",

        sortOrder: 5,

      },

    ],

    variants: [

      variant({

        id: "variant_ap_royal_oak_blue",

        productId: "product_ap_royal_oak_15510st",

        sku: "15510ST.OO.1320ST.01",

        pricing: price(31900),

        stock: "in-stock",

        quantity: 4,

        optionValues: [option("dial-color", "blue", "آبی")],

      }),

    ],

    defaultVariantId: "variant_ap_royal_oak_blue",

    badges: [],

    shipping: { shippable: true },

    returns: { returnable: false, policyPagePath: "/shipping-returns" },

    warranty: { type: "none", policyPagePath: "/warranty" },

    seo: {

      title: "Audemars Piguet Royal Oak Selfwinding 41 | KRONOS",

      description: "مشخصات Royal Oak Selfwinding 41 با کالیبر 4302 و صفحه آبی.",

      canonicalPath: "/shop/luxury/audemars-piguet-royal-oak-15510st",

      robots: "index,follow",

      structuredDataType: "Product",

    },

    trustEvidenceRefs: [],

    releasedAt: "2022-01-01T00:00:00Z",

    publishedAt: "2026-09-28T00:00:00Z",

    createdAt: "2026-09-28T00:00:00Z",

    updatedAt: "2026-09-28T00:00:00Z",

  },

  {

    schemaVersion: 1,

    identity: {

      id: "product_tag_carrera_cbs2210",

      slug: "tag-heuer-carrera-cbs2210",

      productGroupId: "TAG-CARRERA-CBS2210",

      primarySku: "CBS2210.BA0048",

      mpn: "CBS2210.BA0048",

    },

    status: "active",

    condition: "new",

    content: {

      name: {

        default: "TAG Heuer Carrera Chronograph 39",

        values: { en: "TAG Heuer Carrera Chronograph 39", fa: "TAG Heuer Carrera Chronograph 39" },

      },

      shortDescription: {

        default: "کرونوگراف اتوماتیک ۳۹ میلی‌متری با کالیبر TH20-00، صفحه مشکی و بریسلت استیل.",

      },

      description: {

        default:

          "Carrera Chronograph با قاب استیل ۳۹ میلی‌متری، شیشه سافایر گنبدی، صفحه مشکی reverse tricompax و کالیبر اتوماتیک TH20-00 با ذخیره انرژی ۸۰ ساعت.",

      },

      highlights: [

        { default: "کرونوگراف اتوماتیک TH20-00" },

        { default: "قاب استیل ۳۹ میلی‌متری" },

        { default: "ذخیره انرژی ۸۰ ساعت" },

        { default: "مقاومت آب ۱۰۰ متر" },

      ],

    },

    media: {

      primaryMediaId: "media_product_tag_carrera_cbs2210_0",

      assets: [

        image(

          "product_tag_carrera_cbs2210",

          "kronos-product-sport-carrera.webp",

          "TAG Heuer Carrera Chronograph با صفحه مشکی",

        ),

      ],

    },

    brandId: "brand_tag_heuer",

    categoryIds: ["category_shop", "category_sport"],

    primaryCategoryId: "category_sport",

    collectionIds: ["collection_carrera"],

    audienceKeys: ["unisex"],

    styleKeys: ["sport", "classic"],

    movementKey: "automatic",

    specificationValues: [

      {

        key: "case-diameter",

        label: { default: "قطر قاب" },

        value: { type: "number", value: 39, unit: "mm" },

        group: "dimensions",

        filterValueKeys: ["39"],

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

        key: "strap-material",

        label: { default: "جنس بند" },

        value: { type: "text", value: "stainless-steel" },

        group: "strap",

        filterValueKeys: ["stainless-steel"],

        sortOrder: 3,

      },

      {

        key: "water-resistance",

        label: { default: "مقاومت آب" },

        value: { type: "number", value: 100, unit: "m" },

        group: "case",

        filterValueKeys: ["100m"],

        sortOrder: 4,

      },

      {

        key: "power-reserve",

        label: { default: "ذخیره انرژی" },

        value: { type: "number", value: 80, unit: "h" },

        group: "movement",

        sortOrder: 5,

      },

    ],

    variants: [

      variant({

        id: "variant_tag_carrera_black",

        productId: "product_tag_carrera_cbs2210",

        sku: "CBS2210.BA0048",

        pricing: price(7550),

        stock: "in-stock",

        quantity: 7,

        optionValues: [option("dial-color", "black", "مشکی")],

      }),

    ],

    defaultVariantId: "variant_tag_carrera_black",

    badges: [],

    shipping: { shippable: true },

    returns: { returnable: false, policyPagePath: "/shipping-returns" },

    warranty: { type: "none", policyPagePath: "/warranty" },

    seo: {

      title: "TAG Heuer Carrera Chronograph 39 | KRONOS",

      description: "مشخصات Carrera Chronograph 39 با کالیبر TH20-00.",

      canonicalPath: "/shop/sport/tag-heuer-carrera-cbs2210",

      robots: "index,follow",

      structuredDataType: "Product",

    },

    trustEvidenceRefs: [],

    releasedAt: "2024-01-01T00:00:00Z",

    publishedAt: "2026-09-28T00:00:00Z",

    createdAt: "2026-09-28T00:00:00Z",

    updatedAt: "2026-09-28T00:00:00Z",

  },

  {

    schemaVersion: 1,

    identity: {

      id: "product_rolex_datejust_126233_0018",

      slug: "rolex-datejust-36-126233-0018",

      productGroupId: "ROLEX-DATEJUST-126233",

      primarySku: "126233-0018",

      mpn: "126233-0018",

    },

    status: "active",

    condition: "new",

    content: {

      name: {

        default: "Rolex Datejust 36",

        values: { en: "Rolex Datejust 36", fa: "Rolex Datejust 36" },

      },

      shortDescription: {

        default: "Datejust 36 دو رنگ با قاب Oystersteel و طلای زرد، صفحه شامپاینی و بریسلت Oyster.",

      },

      description: {

        default:

          "Rolex Datejust 36 Reference 126233 با ساختار Yellow Rolesor، بزل شیاردار طلایی، صفحه شامپاینی، بریسلت Oyster و موتور خودکوک Calibre 3235؛ یک فرم کلاسیک با مقاومت آب تا ۱۰۰ متر.",

      },

      highlights: [

        { default: "قاب ۳۶ میلی‌متری Yellow Rolesor" },

        { default: "کالیبر خودکوک 3235" },

        { default: "ذخیره انرژی حدود ۷۰ ساعت" },

        { default: "مقاومت آب ۱۰۰ متر" },

      ],

    },

    media: {

      primaryMediaId: "media_product_rolex_datejust_126233_0018_0",

      assets: [

        image(

          "product_rolex_datejust_126233_0018",

          "kronos-product-classic-datejust.webp",

          "Rolex Datejust 36 دو رنگ با صفحه شامپاینی",

        ),

      ],

    },

    brandId: "brand_rolex",

    categoryIds: ["category_shop", "category_classic"],

    primaryCategoryId: "category_classic",

    collectionIds: ["collection_datejust"],

    audienceKeys: ["unisex"],

    styleKeys: ["classic", "luxury"],

    movementKey: "automatic",

    specificationValues: [

      {

        key: "case-diameter",

        label: { default: "قطر قاب" },

        value: { type: "number", value: 36, unit: "mm" },

        group: "dimensions",

        filterValueKeys: ["36"],

        sortOrder: 1,

      },

      {

        key: "case-material",

        label: { default: "جنس قاب" },

        value: { type: "text", value: "yellow-rolesor" },

        group: "case",

        filterValueKeys: ["yellow-rolesor"],

        sortOrder: 2,

      },

      {

        key: "strap-material",

        label: { default: "جنس بند" },

        value: { type: "text", value: "yellow-rolesor" },

        group: "strap",

        filterValueKeys: ["yellow-rolesor"],

        sortOrder: 3,

      },

      {

        key: "water-resistance",

        label: { default: "مقاومت آب" },

        value: { type: "number", value: 100, unit: "m" },

        group: "case",

        filterValueKeys: ["100m"],

        sortOrder: 4,

      },

      {

        key: "power-reserve",

        label: { default: "ذخیره انرژی" },

        value: { type: "number", value: 70, unit: "h" },

        group: "movement",

        sortOrder: 5,

      },

    ],

    variants: [

      variant({

        id: "variant_rolex_datejust_champagne",

        productId: "product_rolex_datejust_126233_0018",

        sku: "126233-0018",

        pricing: price(17250),

        stock: "low-stock",

        quantity: 3,

        optionValues: [option("dial-color", "champagne", "شامپاینی")],

      }),

    ],

    defaultVariantId: "variant_rolex_datejust_champagne",

    badges: [],

    shipping: { shippable: true },

    returns: { returnable: false, policyPagePath: "/shipping-returns" },

    warranty: { type: "none", policyPagePath: "/warranty" },

    seo: {

      title: "Rolex Datejust 36 Reference 126233 | KRONOS",

      description: "مشخصات Rolex Datejust 36 با Yellow Rolesor، کالیبر 3235 و مقاومت آب ۱۰۰ متر.",

      canonicalPath: "/shop/classic/rolex-datejust-36-126233-0018",

      robots: "index,follow",

      structuredDataType: "Product",

    },

    trustEvidenceRefs: [],

    publishedAt: "2026-09-28T00:00:00Z",

    createdAt: "2026-09-28T00:00:00Z",

    updatedAt: "2026-09-28T00:00:00Z",

  },

  {

    schemaVersion: 1,

    identity: {

      id: "product_apple_watch_series_12_46",

      slug: "apple-watch-series-12-46mm",

      productGroupId: "APPLE-WATCH-S12",

      primarySku: "APPLE-WATCH-S12-46-GPS",

    },

    status: "active",

    condition: "new",

    content: {

      name: {

        default: "Apple Watch Series 12 46mm",

        values: { en: "Apple Watch Series 12 46mm", fa: "Apple Watch Series 12 46mm" },

      },

      shortDescription: {

        default: "مدل ۴۶ میلی‌متری با بدنه آلومینیومی، نمایشگر Always-On Retina و تراشه S11.",

      },

      description: {

        default:

          "Apple Watch Series 12 در اندازه ۴۶ میلی‌متر با نمایشگر Always-On Retina، تراشه S11، GPS دقیق و مجموعه حسگرهای سلامت نسل جدید؛ مناسب استفاده روزمره، ورزش و پایش فعالیت.",

      },

      highlights: [

        { default: "نمایشگر Always-On Retina" },

        { default: "تراشه S11" },

        { default: "روشنایی تا ۲۰۰۰ نیت" },

        { default: "مقاومت آب ۵۰ متر" },

      ],

    },

    media: {

      primaryMediaId: "media_product_apple_watch_series_12_46_0",

      assets: [

        image(

          "product_apple_watch_series_12_46",

          "kronos-product-smart-apple-watch.webp",

          "Apple Watch Series 12 46mm",

        ),

      ],

    },

    brandId: "brand_apple",

    categoryIds: ["category_shop", "category_smart"],

    primaryCategoryId: "category_smart",

    collectionIds: ["collection_apple_watch_series_12"],

    audienceKeys: ["unisex"],

    styleKeys: ["smart", "sport"],

    movementKey: "digital-smart",

    specificationValues: [

      {

        key: "case-diameter",

        label: { default: "اندازه قاب" },

        value: { type: "number", value: 46, unit: "mm" },

        group: "dimensions",

        filterValueKeys: ["46"],

        sortOrder: 1,

      },

      {

        key: "case-material",

        label: { default: "جنس قاب" },

        value: { type: "text", value: "aluminum" },

        group: "case",

        filterValueKeys: ["aluminum"],

        sortOrder: 2,

      },

      {

        key: "strap-material",

        label: { default: "جنس بند" },

        value: { type: "text", value: "silicone" },

        group: "strap",

        filterValueKeys: ["silicone"],

        sortOrder: 3,

      },

      {

        key: "water-resistance",

        label: { default: "مقاومت آب" },

        value: { type: "number", value: 50, unit: "m" },

        group: "features",

        filterValueKeys: ["50m"],

        sortOrder: 4,

      },

      {

        key: "display",

        label: { default: "نمایشگر" },

        value: { type: "text", value: "always-on-retina" },

        group: "features",

        sortOrder: 5,

      },

      {

        key: "compatibility",

        label: { default: "سازگاری" },

        value: { type: "list", values: ["iphone-11-or-later", "ios-27-or-later"] },

        group: "compatibility",

        sortOrder: 6,

      },

    ],

    variants: [

      variant({

        id: "variant_apple_watch_s12_46_space_gray",

        productId: "product_apple_watch_series_12_46",

        sku: "APPLE-WATCH-S12-46-GPS-SG",

        pricing: price(449),

        stock: "in-stock",

        quantity: 12,

        optionValues: [

          option("case-color", "space-gray", "خاکستری فضایی"),

          option("dial-color", "black", "مشکی"),

        ],

      }),

    ],

    defaultVariantId: "variant_apple_watch_s12_46_space_gray",

    badges: ["new"],

    shipping: { shippable: true },

    returns: { returnable: false, policyPagePath: "/shipping-returns" },

    warranty: { type: "none", policyPagePath: "/warranty" },

    seo: {

      title: "Apple Watch Series 12 46mm | KRONOS",

      description: "مشخصات Apple Watch Series 12 سایز ۴۶ میلی‌متر.",

      canonicalPath: "/shop/smart/apple-watch-series-12-46mm",

      robots: "index,follow",

      structuredDataType: "Product",

    },

    trustEvidenceRefs: [],

    releasedAt: "2026-09-18T00:00:00Z",

    publishedAt: "2026-09-28T00:00:00Z",

    createdAt: "2026-09-28T00:00:00Z",

    updatedAt: "2026-09-28T00:00:00Z",

  },

] as const;



export const HOME_FEATURED_PRODUCT_IDS = CATALOG_PRODUCTS.map((product) => product.identity.id);




export const FIXTURE_PRODUCTS = CATALOG_PRODUCTS;
