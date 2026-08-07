import { describe, expect, test } from "bun:test";

import { legacyWatchToCardViewModel } from "../../src/components/commerce/product-card-model";

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

  test("does not expose ratings unless explicitly enabled", () => {
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
});
