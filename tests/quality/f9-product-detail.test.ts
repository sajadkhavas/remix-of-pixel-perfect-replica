import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { CATALOG_PRODUCTS } from "../../src/data/fixtures/products";
import { loadProductDetailServer } from "../../src/lib/product-detail.server";

function source(path: string): string {
  return readFileSync(
    new URL(`../../${path}`, import.meta.url),
    "utf8",
  );
}

const productRoute = source(
  "src/routes/shop.$category.$product.tsx",
);
const productFunctions = source(
  "src/lib/product-detail.functions.ts",
);

describe("F9 product detail contract", () => {
  test("uses server functions instead of route-coupled product POST fetches", () => {
    expect(productFunctions).toContain("createServerFn");
    expect(productFunctions).toContain("inputValidator");
    expect(productFunctions).not.toContain('fetch(`/product/');
    expect(productRoute).not.toContain("server: {");
  });

  test("keeps every product canonical inside its category route", () => {
    expect(
      CATALOG_PRODUCTS.map(
        (product) => product.seo.canonicalPath,
      ),
    ).toEqual([
      "/shop/luxury/audemars-piguet-royal-oak-15510st",
      "/shop/sport/tag-heuer-carrera-cbs2210",
      "/shop/classic/rolex-datejust-36-126233-0018",
      "/shop/smart/apple-watch-series-12-46mm",
    ]);
  });

  test("keeps the requested Carrera public slug", () => {
    const carrera = CATALOG_PRODUCTS.find(
      (product) =>
        product.identity.id ===
        "product_tag_carrera_cbs2210",
    );

    expect(carrera?.identity.slug).toBe(
      "tag-heuer-carrera-cbs2210",
    );
  });

  test("resolves the previous Carrera slug to the canonical product", async () => {
    const result = await loadProductDetailServer({
      id: "tag-heuer-carrera-chronograph-cbs2210",
    });

    expect(result?.product.identity.slug).toBe(
      "tag-heuer-carrera-cbs2210",
    );
    expect(result?.category?.slug).toBe("sport");
  });

  test("never returns the current product as related", async () => {
    const result = await loadProductDetailServer({
      id: "audemars-piguet-royal-oak-15510st",
    });

    expect(result).not.toBeNull();
    expect(
      result?.relatedCards.some(
        (card) =>
          card.id ===
          "product_ap_royal_oak_15510st",
      ),
    ).toBe(false);
  });

  test("redirects non-canonical identifiers to the canonical nested route", () => {
    expect(productRoute).toContain(
      'to: "/shop/$category/$product"',
    );
    expect(productRoute).toContain(
      "params.product !== data.product.identity.slug",
    );
    expect(productRoute).toContain("replace: true");
  });

  test("does not expose exact low-stock quantity", () => {
    expect(productRoute).toContain(
      'case "low-stock":',
    );
    expect(productRoute).toContain(
      'return "موجودی محدود";',
    );
    expect(productRoute).not.toContain(
      "موجودی محدود —",
    );
  });
});
