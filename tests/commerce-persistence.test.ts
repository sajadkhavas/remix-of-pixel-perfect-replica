import { describe, expect, test } from "bun:test";
import {
  clampQuantity,
  parsePersistedCommerce,
  type PersistedCommerceEnvelopeV1,
} from "../src/domain/commerce";

const NOW = "2026-08-06T00:00:00.000Z";

function createValidEnvelope(): PersistedCommerceEnvelopeV1 {
  return {
    schema: "kronos-commerce",
    version: 1,
    state: {
      version: 1,
      cart: {
        currency: "IRR",
        updatedAt: NOW,
        items: [
          {
            lineId: "product-1::variant-1",
            productId: "product-1",
            variantId: "variant-1",
            quantity: 2,
            unitPriceSnapshot: {
              amountMinor: 1_000_000,
              currency: "IRR",
              fractionDigits: 0,
            },
            productSnapshot: {
              productId: "product-1",
              variantId: "variant-1",
              productSlug: "sample-watch",
              name: "Sample Watch",
              sku: "SKU-1",
            },
            addedAt: NOW,
            updatedAt: NOW,
          },
        ],
      },
      wishlist: [
        {
          productId: "product-1",
          preferredVariantId: "variant-1",
          addedAt: NOW,
        },
      ],
      compare: [{ productId: "product-1", variantId: "variant-1", addedAt: NOW }],
      recentlyViewed: [{ productId: "product-1", variantId: "variant-1", viewedAt: NOW }],
      coupon: {
        status: "valid",
        code: "SAVE10",
        discountMinor: 100_000,
        message: "Validated test coupon",
      },
      checkoutDraft: {
        email: "buyer@example.com",
        address: {
          recipientName: "Test Buyer",
          countryCode: "IR",
          city: "Tehran",
        },
        shipping: {
          methodId: "shipping-standard",
          labelSnapshot: "Standard",
          priceSnapshot: {
            amountMinor: 50_000,
            currency: "IRR",
            fractionDigits: 0,
          },
          selectedAt: NOW,
        },
        acceptedPurchaseTerms: false,
        updatedAt: NOW,
      },
      updatedAt: NOW,
    },
  };
}

describe("parsePersistedCommerce", () => {
  test("accepts a fully valid versioned envelope", () => {
    const envelope = createValidEnvelope();

    expect(parsePersistedCommerce(JSON.stringify(envelope))).toEqual(envelope);
  });

  test("rejects malformed JSON", () => {
    expect(parsePersistedCommerce("{invalid-json")).toBeNull();
  });

  test("rejects malformed wishlist, compare, and recently-viewed entries", () => {
    const malformedWishlist = createValidEnvelope() as unknown as {
      state: { wishlist: unknown[] };
    };
    malformedWishlist.state.wishlist = [{ productId: 12, addedAt: NOW }];

    expect(parsePersistedCommerce(JSON.stringify(malformedWishlist))).toBeNull();

    const malformedCompare = createValidEnvelope() as unknown as {
      state: { compare: unknown[] };
    };
    malformedCompare.state.compare = [{ productId: "product-1", addedAt: null }];

    expect(parsePersistedCommerce(JSON.stringify(malformedCompare))).toBeNull();

    const malformedRecent = createValidEnvelope() as unknown as {
      state: { recentlyViewed: unknown[] };
    };
    malformedRecent.state.recentlyViewed = [{ productId: "product-1" }];

    expect(parsePersistedCommerce(JSON.stringify(malformedRecent))).toBeNull();
  });

  test("rejects invalid coupon and checkout shapes", () => {
    const malformedCoupon = createValidEnvelope() as unknown as {
      state: { coupon: unknown };
    };
    malformedCoupon.state.coupon = {
      status: "valid",
      code: "SAVE10",
      discountMinor: -1,
    };

    expect(parsePersistedCommerce(JSON.stringify(malformedCoupon))).toBeNull();

    const malformedCheckout = createValidEnvelope() as unknown as {
      state: { checkoutDraft: unknown };
    };
    malformedCheckout.state.checkoutDraft = {
      address: [],
      acceptedPurchaseTerms: "yes",
      updatedAt: NOW,
    };

    expect(parsePersistedCommerce(JSON.stringify(malformedCheckout))).toBeNull();
  });

  test("rejects duplicate cart line IDs and currency mismatches", () => {
    const duplicateLine = createValidEnvelope();
    const duplicated = {
      ...duplicateLine,
      state: {
        ...duplicateLine.state,
        cart: {
          ...duplicateLine.state.cart,
          items: [duplicateLine.state.cart.items[0], duplicateLine.state.cart.items[0]],
        },
      },
    };

    expect(parsePersistedCommerce(JSON.stringify(duplicated))).toBeNull();

    const currencyMismatch = createValidEnvelope();
    const mismatched = {
      ...currencyMismatch,
      state: {
        ...currencyMismatch.state,
        cart: {
          ...currencyMismatch.state.cart,
          items: [
            {
              ...currencyMismatch.state.cart.items[0],
              unitPriceSnapshot: {
                ...currencyMismatch.state.cart.items[0].unitPriceSnapshot,
                currency: "USD",
              },
            },
          ],
        },
      },
    };

    expect(parsePersistedCommerce(JSON.stringify(mismatched))).toBeNull();
  });
});

describe("clampQuantity", () => {
  test("aligns to increments and respects available stock", () => {
    expect(clampQuantity(8, { min: 1, max: 10, increment: 2 }, 6)).toBe(5);
    expect(clampQuantity(20, { min: 1, max: 10, increment: 1 }, 6)).toBe(6);
  });

  test("rejects invalid rules rather than dividing by zero", () => {
    expect(() => clampQuantity(2, { min: 1, increment: 0 })).toThrow(RangeError);
    expect(() => clampQuantity(2, { min: 0, increment: 1 })).toThrow(RangeError);
  });
});
