import { describe, expect, test } from "bun:test";

import { legacyWatchToCardViewModel } from "../../src/components/commerce/product-card-model";
import { productToCardViewModel } from "../../src/components/commerce/product-card-product-adapter";
import type { Product, ProductInventory, ProductVariant } from "../../src/domain/product";
import type { Money } from "../../src/domain/shared";

const NOW = "2026-08-07T00:00:00.000Z";

function formatMoney(money: Money): string {
  return `${money.amountMinor.toLocaleString("fa-IR")} ${money.currency}`;
}

function createProduct(
  options: Readonly<{
    status?: Product["status"];
    variantStatus?: ProductVariant["status"];
    variantProductId?: string;
    inventoryStatus?: ProductInventory["status"];
    inventoryTracking?: ProductInventory["tracking"];
    backorderable?: boolean;
    invalidPricing?: boolean;
  }> = {},
): Product {
  const listPrice = {
    amountMinor: 10_000_000,
    currency: "IRR",
    fractionDigits: 0,
  } as const;
  const effectivePrice = options.invalidPricing
    ? { amountMinor: 12_000_000, currency: "IRR", fractionDigits: 0 }
    : { amountMinor: 8_000_000, currency: "IRR", fractionDigits: 0 };

  return {
    schemaVersion: 1,
    identity: {
      id: "product-42",
      slug: "sample-watch",
      productGroupId: "group-42",
      primarySku: "SKU-42",
    },
    status: options.status ?? "active",
    condition: "new",
    content: {
      name: { default: "نمونه ساعت" },
      shortDescription: { default: "شرح کوتاه" },
      description: { default: "شرح محصول" },
      highlights: [],
    },
    media: {
      primaryMediaId: "media-42",
      assets: [
        {
          type: "image",
          id: "media-42",
          url: "/watch.jpg",
          alt: "نمونه ساعت",
          dimensions: { width: 800, height: 800 },
          sortOrder: 0,
          role: "primary",
        },
      ],
    },
    brandId: "brand-kronos",
    categoryIds: ["category-classic"],
    primaryCategoryId: "category-classic",
    collectionIds: [],
    audienceKeys: ["men"],
    styleKeys: ["classic"],
    movementKey: "automatic",
    specificationValues: [
      {
        key: "case-material",
        label: { default: "جنس قاب" },
        value: { type: "text", value: "استیل" },
        group: "case",
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: "variant-42",
        productId: options.variantProductId ?? "product-42",
        sku: "SKU-42",
        optionValues: [],
        pricing: {
          listPrice,
          salePrice: { amountMinor: 8_000_000, currency: "IRR", fractionDigits: 0 },
          effectivePrice,
          taxIncluded: true,
        },
        inventory: {
          tracking: options.inventoryTracking ?? "tracked",
          status: options.inventoryStatus ?? "in-stock",
          availableQuantity: options.inventoryStatus === "out-of-stock" ? 0 : 4,
          backorderable: options.backorderable ?? false,
          minOrderQuantity: 1,
          maxOrderQuantity: 4,
          orderIncrement: 1,
        },
        mediaIds: ["media-42"],
        status: options.variantStatus ?? "active",
        isDefault: true,
      },
    ],
    defaultVariantId: "variant-42",
    badges: ["sale"],
    reviewSummary: {
      ratingValue: 5,
      ratingCount: 99,
      reviewCount: 99,
      bestRating: 5,
      worstRating: 1,
    },
    shipping: { shippable: true },
    returns: { returnable: false, policyPagePath: "/shipping-returns" },
    warranty: { type: "none" },
    seo: { title: "نمونه ساعت", description: "شرح محصول" },
    trustEvidenceRefs: [],
    createdAt: NOW,
    updatedAt: NOW,
  };
}

describe("F8 product card model", () => {
  const watch = {
    id: 42,
    name: "نمونه ساعت",
    brand: "KRONOS",
    price: 10_000_000,
    sale_price: 8_000_000,
    image: "/watch.jpg",
    category: "classic" as const,
    caseMaterial: "استیل",
    waterResistance: "50m",
    stock: 1,
    rating: 5,
    review_count: 99,
    isNew: true,
  };

  test("does not expose legacy ratings unless explicitly enabled", () => {
    expect(legacyWatchToCardViewModel(watch).rating).toBeUndefined();
    expect(legacyWatchToCardViewModel(watch, { includeRatings: true }).rating).toEqual({
      value: 5,
      count: 99,
    });
  });

  test("normalizes legacy stock and price without exposing exact low-stock counts", () => {
    const model = legacyWatchToCardViewModel(watch);
    expect(model.availability).toEqual({
      status: "low-stock",
      label: "موجودی محدود",
      purchasable: true,
    });
    expect(model.price?.discountPercent).toBe(20);
    expect(model.badges).toContain("sale");
  });

  test("adapts normalized Product data and keeps ratings opt-in", () => {
    const product = createProduct();
    const hiddenRating = productToCardViewModel(product, "KRONOS", formatMoney);
    const visibleRating = productToCardViewModel(product, "KRONOS", formatMoney, {
      includeRatings: true,
    });

    expect(hiddenRating.availability.purchasable).toBe(true);
    expect(hiddenRating.price?.discountPercent).toBe(20);
    expect(hiddenRating.rating).toBeUndefined();
    expect(visibleRating.rating).toEqual({ value: 5, count: 99 });
  });

  test("fails closed for inactive products and invalid pricing", () => {
    const inactive = productToCardViewModel(
      createProduct({ status: "unavailable" }),
      "KRONOS",
      formatMoney,
    );
    expect(inactive.availability).toEqual({
      status: "unknown",
      label: "ناموجود",
      purchasable: false,
    });

    const invalidPricing = productToCardViewModel(
      createProduct({ invalidPricing: true }),
      "KRONOS",
      formatMoney,
    );
    expect(invalidPricing.price).toBeUndefined();
    expect(invalidPricing.availability.purchasable).toBe(false);
  });

  test("fails closed for inactive or mismatched default variants", () => {
    const inactiveVariant = productToCardViewModel(
      createProduct({ variantStatus: "unavailable" }),
      "KRONOS",
      formatMoney,
    );
    expect(inactiveVariant.availability).toEqual({
      status: "unknown",
      label: "ناموجود",
      purchasable: false,
    });

    const mismatchedVariant = productToCardViewModel(
      createProduct({ variantProductId: "another-product" }),
      "KRONOS",
      formatMoney,
    );
    expect(mismatchedVariant.price).toBeUndefined();
    expect(mismatchedVariant.availability.purchasable).toBe(false);
  });

  test("allows explicit backorders but rejects contradictory backorder state", () => {
    const allowed = productToCardViewModel(
      createProduct({ inventoryStatus: "out-of-stock", backorderable: true }),
      "KRONOS",
      formatMoney,
    );
    expect(allowed.availability).toEqual({
      status: "out-of-stock",
      label: "قابل سفارش",
      purchasable: true,
    });

    const rejected = productToCardViewModel(
      createProduct({ inventoryStatus: "backorder", backorderable: false }),
      "KRONOS",
      formatMoney,
    );
    expect(rejected.availability).toEqual({
      status: "backorder",
      label: "ناموجود",
      purchasable: false,
    });
  });

  test("rejects contradictory tracking and inventory status", () => {
    const contradictory = productToCardViewModel(
      createProduct({ inventoryTracking: "not-tracked", inventoryStatus: "in-stock" }),
      "KRONOS",
      formatMoney,
    );
    expect(contradictory.availability).toEqual({
      status: "unknown",
      label: "ناموجود",
      purchasable: false,
    });
  });
});
