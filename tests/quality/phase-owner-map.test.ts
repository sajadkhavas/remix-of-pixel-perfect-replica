import { describe, expect, test } from "bun:test";

import { ownerForFile } from "../../scripts/quality/common.mjs";

describe("quality phase ownership", () => {
  test("maps accepted feature surfaces to their governing phases", () => {
    expect(ownerForFile("src/routes/__root.tsx")).toBe("F4");
    expect(ownerForFile("src/components/layout/Footer.tsx")).toBe("F4");
    expect(ownerForFile("src/routes/index.tsx")).toBe("F5");
    expect(ownerForFile("src/components/sections/FeaturedProducts.tsx")).toBe("F5");
    expect(ownerForFile("src/components/sections/CategoriesSection.tsx")).toBe("F5/F6");
    expect(ownerForFile("src/lib/catalog.ts")).toBe("F6");
    expect(ownerForFile("src/routes/product/$id.tsx")).toBe("F7");
    expect(ownerForFile("src/components/ui/ProductCard.tsx")).toBe("F8");
    expect(ownerForFile("src/components/commerce/product-card-model.ts")).toBe("F8");
    expect(ownerForFile("src/routes/cart.tsx")).toBe("F9");
    expect(ownerForFile("src/lib/store-context.tsx")).toBe("F9");
    expect(ownerForFile("src/routes/auth.tsx")).toBe("F10");
    expect(ownerForFile("src/routes/contact.tsx")).toBe("F11");
    expect(ownerForFile("src/components/ui/button.tsx")).toBe("F3B");
    expect(ownerForFile("src/seo/indexability.ts")).toBe("F13A");
    expect(ownerForFile("src/config/store-settings.ts")).toBe("F12");
  });

  test("does not silently dump unknown files into a feature phase", () => {
    expect(ownerForFile("src/unknown/future-surface.ts")).toBe("UNASSIGNED");
  });
});
