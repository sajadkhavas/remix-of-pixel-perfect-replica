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

const shopLayoutRoute = source("src/routes/shop.tsx");
const shopIndexRoute = source("src/routes/shop.index.tsx");
const categoryLayoutRoute = source("src/routes/shop.$category.tsx");
const categoryIndexRoute = source("src/routes/shop.$category.index.tsx");
const catalogUi = source("src/components/discovery/discovery-catalog.tsx");
const discoveryServer = source("src/lib/discovery.server.ts");
const discoveryFunctions = source("src/lib/discovery.functions.ts");
const discoveryCard = source("src/components/discovery/discovery-product-card.tsx");

describe("F6 discovery contract", () => {
  test("keeps public sort options truth-safe", () => {
    for (const unsupported of ["popular", "best-rated", "relevance"]) {
      const validated = validatePublicDiscoverySearch({ sort: unsupported });

      expect(validated.sort).toBeUndefined();
      expect(completeDiscoveryState(validated).sort).toBe("newest");
    }

    for (const supported of ["newest", "price-asc", "price-desc", "discount"]) {
      const validated = validatePublicDiscoverySearch({ sort: supported });

      if (supported === "newest") {
        expect(validated.sort).toBeUndefined();
      } else {
        expect(validated.sort).toBe(supported);
      }

      expect(completeDiscoveryState(validated).sort).toBe(supported);
    }
  });

  test("normalizes optional route search without emitting default values", () => {
    const validated = validatePublicDiscoverySearch({
      category: [],
      brand: [],
      audience: [],
      style: [],
      movement: [],
      caseSize: [],
      caseMaterial: [],
      strapMaterial: [],
      dialColor: [],
      waterResistance: [],
      availability: [],
      discount: false,
      sort: "newest",
      page: 1,
      view: "grid",
    });

    expect(validated).toEqual({});

    const state = completeDiscoveryState(validated);

    expect(state.category).toEqual([]);
    expect(state.brand).toEqual([]);
    expect(state.availability).toEqual([]);
    expect(state.sort).toBe("newest");
    expect(state.page).toBe(1);
    expect(state.view).toBe("grid");
  });

  test("preserves multi-select category state and stable deep links", () => {
    const start = completeDiscoveryState({
      category: ["luxury"],
      page: 4,
      brand: ["rolex"],
    });

    const next = patchDiscoveryState(start, {
      category: ["classic", "luxury", "sport"],
      discount: true,
    });

    expect(next.page).toBe(1);

    const href = discoveryHref("/shop", next);
    const url = new URL(`https://kronos.test${href}`);

    expect(url.pathname).toBe("/shop");
    expect(url.searchParams.get("category")).toBe("classic,luxury,sport");
    expect(url.searchParams.get("brand")).toBe("rolex");
    expect(url.searchParams.get("discount")).toBe("1");
  });

  test("uses the complete top-level storefront category taxonomy", async () => {
    const result = await loadDiscoveryServer({
      state: completeDiscoveryState({}),
    });

    expect(
      result.data.categories.map((category) => category.slug).sort(),
    ).toEqual(["classic", "luxury", "smart", "sport"]);
  });

  test("treats selected categories as OR while combining filter groups as AND", async () => {
    const twoCategories = await loadDiscoveryServer({
      state: completeDiscoveryState({
        category: ["luxury", "sport"],
      }),
    });

    expect(twoCategories.data.totalItems).toBe(2);

    const categoryAndMovement = await loadDiscoveryServer({
      state: completeDiscoveryState({
        category: ["luxury", "sport"],
        movement: ["automatic"],
      }),
    });

    expect(categoryAndMovement.data.totalItems).toBe(2);

    const categoryAndSmartMovement = await loadDiscoveryServer({
      state: completeDiscoveryState({
        category: ["luxury", "sport"],
        movement: ["digital-smart"],
      }),
    });

    expect(categoryAndSmartMovement.data.totalItems).toBe(0);
  });

  test("locks dedicated category routes to their own category scope", async () => {
    const result = await loadDiscoveryServer({
      state: completeDiscoveryState({
        category: ["sport"],
      }),
      categorySlug: "luxury",
    });

    expect(result.category?.slug).toBe("luxury");
    expect(result.data.totalItems).toBe(1);
  });

  test("marks query and facet variants noindex while clean catalog remains indexable", async () => {
    const clean = await loadDiscoveryServer({
      state: completeDiscoveryState({}),
    });

    const queried = await loadDiscoveryServer({
      state: completeDiscoveryState({ q: "ساعت" }),
    });

    const filtered = await loadDiscoveryServer({
      state: completeDiscoveryState({
        category: ["luxury", "sport"],
      }),
    });

    expect(clean.data.seo.robots).toBe("index,follow");
    expect(queried.data.seo.robots).toBe("noindex,follow");
    expect(filtered.data.seo.robots).toBe("noindex,follow");
  });

  test("keeps shop, category and product routes separated by responsibility", () => {
    expect(shopLayoutRoute).toContain("<Outlet");
    expect(categoryLayoutRoute).toContain("<Outlet");

    expect(shopIndexRoute).toContain('createFileRoute("/shop/")');
    expect(shopIndexRoute).toContain("getDiscoveryData");
    expect(shopIndexRoute).toContain("Route.useNavigate");

    expect(categoryIndexRoute).toContain(
      'createFileRoute("/shop/$category/")',
    );
    expect(categoryIndexRoute).toContain("getDiscoveryData");
    expect(categoryIndexRoute).toContain("lockedCategorySlug");
    expect(categoryIndexRoute).toContain("Route.useNavigate");

    expect(catalogUi).not.toContain("@/lib/catalog");
    expect(discoveryServer).not.toContain("@/lib/catalog");
    expect(discoveryCard).not.toContain("/product/");
  });

  test("uses route-owned structured search state instead of manual filter href construction", () => {
    expect(catalogUi).toContain("onStateChange");
    expect(catalogUi).toContain('aria-pressed={selected}');
    expect(catalogUi).not.toContain("discoveryHref");

    expect(shopIndexRoute).toContain("search: () =>");
    expect(categoryIndexRoute).toContain("search: () =>");

    expect(discoveryFunctions).toContain("createServerFn");
    expect(discoveryFunctions).toContain("inputValidator");
    expect(discoveryFunctions).not.toContain('fetch("/shop"');
  });
});
