import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

function source(path: string): string {
  return readFileSync(
    new URL(`../../${path}`, import.meta.url),
    "utf8",
  );
}

const checkoutForm = source(
  "src/components/commerce/checkout/checkout-form.tsx",
);

describe("checkout form event safety", () => {
  test("snapshots event values before deferred state updater callbacks", () => {
    expect(checkoutForm).not.toMatch(
      /addressLine:\s*event\.currentTarget\.value/,
    );
    expect(checkoutForm).not.toMatch(
      /customerNote:\s*event\.currentTarget\.value/,
    );
    expect(checkoutForm).not.toMatch(
      /acceptedPurchaseTerms:\s*event\.currentTarget\.checked/,
    );

    expect(checkoutForm).toContain(
      "const value = event.currentTarget.value;",
    );
    expect(checkoutForm).toContain(
      "event.currentTarget.checked;",
    );
  });
});
