import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import {
  completeDiscoveryState,
  discoveryHref,
  patchDiscoveryState,
  validatePublicDiscoverySearch,
} from "../../src/lib/discovery";
import { loadDiscoveryServer } from "../../src/lib/discovery.server";

function source(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

const shopRoute = source("src/routes/shop.tsx");
const categoryRoute = source("src/routes/shop.$category.tsx");
const catalogUi = source("src/components/discovery/discovery-catalog.tsx");
const discoveryServer = source("src/lib/discovery.server.ts");
const discoveryFunctions = source("src/lib/discovery.functions.ts");
const discoveryCard = source("src/components/discovery/discovery-product-card.tsx");

describe("F6 discovery contract", () => {
  test("keeps public sort options truth-safe", () => {
    for (const unsupported of ["popular", "best-rated", "relevance"]) {
      const state = validatePublicDiscoverySearch({ sort: unsupported });
      expect(state.sort).toBe("newest");
    }

    for (const supported of ["newest", "price-asc", "price-desc", "discount"]) {
      const state = validatePublicDiscoverySearch({ sort: supported });
      expect(state.sort).toBe(supported);
    }
  });

  test("normalizes optional route search without making links require search params", () => {
    const state = completeDiscoveryState({});
    expect(state.brand).toEqual([]);
    expect(state.availability).toEqual([]);
    expect(state.sort).toBe("newest");
    expect(state.page).toBe(1);
    expect(state.view).toBe("grid");
  });

  test("serializes stable deep links and resets pagination when filters change", () => {
    const start = completeDiscoveryState({ page: 4, brand: ["seiko"] });
    const next = patchDiscoveryState(start, { discount: true });
    expect(next.page).toBe(1);
    expect(discoveryHref("/shop", next)).toContain("brand=seiko");
    expect(discoveryHref("/shop", next)).toContain("discount=1");
    expect(discoveryHref("/shop", next)).not.toContain("/watches");
  });

  test("uses only accepted top-level F2 category taxonomy", async () => {
    const result = await loadDiscoveryServer({ state: completeDiscoveryState({}) });
    expect(result.data.categories.map((category) => category.slug).sort()).toEqual([
      "classic",
      "luxury",
      "smart",
    ]);
  });

  test("marks query and filter variants noindex while the clean catalog remains indexable", async () => {
    const clean = await loadDiscoveryServer({ state: completeDiscoveryState({}) });
    const queried = await loadDiscoveryServer({
      state: completeDiscoveryState({ q: "ساعت" }),
    });
    const filtered = await loadDiscoveryServer({
      state: completeDiscoveryState({ discount: true }),
    });

    expect(clean.data.seo.robots).toBe("index,follow");
    expect(queried.data.seo.robots).toBe("noindex,follow");
    expect(filtered.data.seo.robots).toBe("noindex,follow");
  });

  test("keeps F6 discovery off the legacy catalog and F7-owned numeric PDP", () => {
    for (const text of [shopRoute, categoryRoute, catalogUi, discoveryServer, discoveryFunctions]) {
      expect(text).not.toContain("@/lib/catalog");
      expect(text).not.toContain("/watches");
    }
    expect(discoveryServer).not.toContain("FixtureSearchRepository");
    expect(discoveryCard).not.toContain("/product/");
    expect(discoveryCard).not.toContain("addToCart");
  });

  test("keeps server data out of the browser with an environment-specific route boundary", () => {
    expect(shopRoute).toContain("getDiscoveryData");
    expect(categoryRoute).toContain("getDiscoveryData");
    expect(discoveryFunctions).toContain("createIsomorphicFn");
    expect(discoveryFunctions).toContain(".server(");
    expect(discoveryFunctions).toContain(".client(");
    expect(shopRoute).toContain("POST:");
    expect(shopRoute).toContain("decodeDiscoveryRequest");
    expect(shopRoute).not.toContain("FIXTURE_PRODUCTS");
    expect(categoryRoute).not.toContain("FIXTURE_CATEGORIES");
  });
});
