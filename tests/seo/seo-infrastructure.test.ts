import { describe, expect, test } from "bun:test";
import {
  MetadataRegistry,
  absoluteUrl,
  adaptProductToSeo,
  brandBreadcrumbs,
  buildCanonicalUrl,
  buildOffer,
  buildProduct,
  buildRobotsPolicy,
  classifyIndexability,
  createMetadataFactory,
  createSitemapCollection,
  detectDuplicateCanonicals,
  normalizeCanonicalSearch,
  normalizePathname,
  serializeJsonLd,
  validateStructuredData,
  type ProductSchemaInput,
} from "../../src/seo";
import type { Brand } from "../../src/domain/catalog";
import type { Product } from "../../src/domain/product";
import type { ImageMedia } from "../../src/domain/shared";

const SITE = { environment: "production" as const, siteUrl: "https://kronos.example" };

const image: ImageMedia = {
  type: "image",
  id: "media-1",
  url: "/assets/watch.jpg",
  alt: "Sample watch",
  dimensions: { width: 1200, height: 1200 },
  sortOrder: 0,
  role: "primary",
};

const brand: Brand = {
  id: "brand-1",
  slug: "sample-brand",
  name: "Sample Brand",
  logo: image,
  description: { default: "Sample brand" },
  officialStatus: { status: "unverified" },
  seo: { title: "Sample Brand", description: "Sample brand description" },
  featured: false,
  relatedArticleIds: [],
};

function product(status: Product["status"] = "active"): Product {
  return {
    schemaVersion: 1,
    identity: {
      id: "product-1",
      slug: "sample-watch",
      productGroupId: "group-1",
      primarySku: "SKU-1",
      mpn: "MPN-1",
    },
    status,
    condition: "new",
    content: {
      name: { default: "Sample Watch" },
      shortDescription: { default: "A factual sample watch description." },
      description: { default: "A longer factual sample watch description." },
      highlights: [],
    },
    media: { assets: [image], primaryMediaId: image.id },
    brandId: brand.id,
    categoryIds: ["category-1"],
    primaryCategoryId: "category-1",
    collectionIds: [],
    audienceKeys: ["men"],
    styleKeys: ["classic"],
    movementKey: "automatic",
    specificationValues: [],
    variants: [
      {
        id: "variant-1",
        productId: "product-1",
        sku: "SKU-1",
        optionValues: [{ optionKey: "dial-color", valueKey: "black", label: { default: "مشکی" } }],
        pricing: {
          listPrice: { amountMinor: 125000000, currency: "IRR", fractionDigits: 0 },
          effectivePrice: { amountMinor: 125000000, currency: "IRR", fractionDigits: 0 },
          taxIncluded: true,
        },
        inventory: {
          tracking: "tracked",
          status: "in-stock",
          availableQuantity: 3,
          backorderable: false,
          minOrderQuantity: 1,
          maxOrderQuantity: 3,
          orderIncrement: 1,
        },
        mediaIds: [image.id],
        status: "active",
        isDefault: true,
      },
    ],
    defaultVariantId: "variant-1",
    badges: [],
    shipping: { shippable: true },
    returns: { returnable: false, policyPagePath: "/shipping-returns" },
    warranty: { type: "none" },
    seo: { title: "Sample Watch", description: "A factual sample watch description." },
    trustEvidenceRefs: [],
    publishedAt: "2026-08-06T00:00:00.000Z",
    createdAt: "2026-08-06T00:00:00.000Z",
    updatedAt: "2026-08-06T00:00:00.000Z",
  };
}

describe("URL normalization and canonical policy", () => {
  test("builds canonical URL and removes tracking", () => {
    expect(
      buildCanonicalUrl(SITE, {
        pathname: "/SHOP/",
        search: "utm_source=x&page=2&fbclid=y",
        retainPage: true,
      }),
    ).toBe("https://kronos.example/shop?page=2");
  });

  test("orders allowed query parameters stably", () => {
    expect(normalizeCanonicalSearch("brand=omega&page=3&a=2&a=1", ["a", "brand"], true)).toBe(
      "a=1&a=2&brand=omega&page=3",
    );
  });

  test("normalizes safe encoded slugs and rejects encoded separators", () => {
    expect(normalizePathname("/product/SAMPLE-WATCH%2D2026/")).toBe(
      "/product/sample-watch-2026",
    );
    expect(() => normalizePathname("/product/bad%2Fslug")).toThrow();
  });

  test("requires explicit production site URL", () => {
    expect(() =>
      buildCanonicalUrl({ environment: "production" }, { pathname: "/shop" }),
    ).toThrow("Production SEO requires an explicit site URL");
  });
});

describe("indexability classifier", () => {
  test("treats /shop as the official catalog", () => {
    expect(classifyIndexability("/shop")).toMatchObject({
      pageType: "shop",
      indexable: true,
      canonicalPath: "/shop",
    });
    expect(classifyIndexability("/shop/automatic", { contentUseful: true })).toMatchObject({
      pageType: "curated-landing",
      indexable: true,
    });
    expect(classifyIndexability("/shop/automatic")).toMatchObject({
      indexable: false,
      reason: "content-not-validated",
    });
  });

  test("prevents the forbidden catalog family", () => {
    expect(classifyIndexability("/watches")).toMatchObject({
      indexable: false,
      canonicalPath: null,
      reason: "forbidden-catalog-family",
    });
  });

  test("marks private routes noindex", () => {
    expect(classifyIndexability("/account/orders/123")).toMatchObject({
      robots: "noindex,nofollow",
      indexable: false,
    });
    expect(classifyIndexability("/cart")).toMatchObject({
      robots: "noindex,follow",
      indexable: false,
    });
  });

  test("classifies filters and sort variants as noindex", () => {
    expect(classifyIndexability("/shop?brand=omega")).toMatchObject({
      indexable: false,
      canonicalPath: "/shop",
      reason: "arbitrary-facet-combination",
    });
    expect(classifyIndexability("/shop?sort=price-asc")).toMatchObject({
      indexable: false,
      canonicalPath: "/shop",
      reason: "sort-or-view-variant",
    });
  });

  test("ignores tracking parameters but keeps clean pagination", () => {
    expect(classifyIndexability("/shop?page=2&utm_campaign=x")).toMatchObject({
      indexable: true,
      canonicalPath: "/shop?page=2",
      reason: "clean-pagination",
    });
  });
});

describe("metadata factory", () => {
  test("creates TanStack-compatible metadata with a title template", () => {
    const factory = createMetadataFactory({
      ...SITE,
      siteName: "KRONOS",
      defaultTitle: "KRONOS",
      titleTemplate: "%s | KRONOS",
      defaultLocale: "fa_IR",
    });
    const result = factory.build({
      pageType: "shop",
      title: "فروشگاه ساعت",
      description: "راهنمای مقایسه و انتخاب ساعت بر اساس مشخصات واقعی.",
      pathname: "/shop",
    });
    expect(result.head.title).toBe("فروشگاه ساعت | KRONOS");
    expect(result.canonical).toBe("https://kronos.example/shop");
    expect(result.head.links).toContainEqual({
      rel: "canonical",
      href: "https://kronos.example/shop",
    });
  });

  test("warns for empty and duplicate descriptions", () => {
    const config = {
      ...SITE,
      siteName: "KRONOS",
      defaultTitle: "KRONOS",
      titleTemplate: "%s | KRONOS",
      defaultDescription: "Default description",
      defaultLocale: "fa_IR",
    };
    const registry = new MetadataRegistry();
    const first = registry.build(config, {
      pageType: "shop",
      title: "Shop",
      description: "Same description",
      pathname: "/shop",
    });
    const second = registry.build(config, {
      pageType: "policy",
      title: "About",
      description: "Same description",
      pathname: "/about",
    });
    const empty = registry.build(config, {
      pageType: "policy",
      title: "Terms",
      description: "",
      pathname: "/terms",
    });
    expect(first.issues).toHaveLength(0);
    expect(second.issues.some((issue) => issue.code === "duplicate-description")).toBe(true);
    expect(empty.issues.some((issue) => issue.code === "metadata-description-empty")).toBe(true);
  });
});

describe("safe structured data", () => {
  test("escapes script termination and HTML-significant sequences", () => {
    const serialized = serializeJsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "</script><script>alert(1)</script>",
    });
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003C/script\\u003E");
  });

  test("rejects circular and non-plain input", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(() => serializeJsonLd(circular)).toThrow("circular references");
    expect(() => serializeJsonLd(new Date())).toThrow("plain objects");
  });

  test("omits rating when no evidence-backed rating is supplied", () => {
    const schema = buildProduct({
      url: "https://kronos.example/product/sample-watch",
      name: "Sample Watch",
      brand: { name: "Sample Brand" },
    });
    expect(schema.aggregateRating).toBeUndefined();
    expect(schema.review).toBeUndefined();
  });

  test("builds a valid product Offer without inventing fields", () => {
    const offer = buildOffer({
      url: "https://kronos.example/product/sample-watch",
      price: "125000000",
      priceCurrency: "IRR",
      availability: "https://schema.org/InStock",
      sku: "SKU-1",
    });
    const schema = buildProduct({
      url: "https://kronos.example/product/sample-watch",
      name: "Sample Watch",
      offer: {
        url: String(offer.url),
        price: String(offer.price),
        priceCurrency: String(offer.priceCurrency),
        availability: String(offer.availability),
        sku: String(offer.sku),
      },
    });
    expect(schema.offers).toMatchObject({
      "@type": "Offer",
      price: "125000000",
      priceCurrency: "IRR",
    });
  });

  test("detects malformed schema input and review without evidence", () => {
    expect(() =>
      buildProduct({ url: "not-a-url", name: "Product" } as ProductSchemaInput),
    ).toThrow();
    const issues = validateStructuredData({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Product",
      review: {
        "@type": "Review",
        author: { "@type": "Person", name: "Unknown" },
        reviewRating: { "@type": "Rating", ratingValue: 5 },
      },
    });
    expect(issues.some((issue) => issue.code === "review-without-evidence")).toBe(true);
  });
});

describe("breadcrumbs, sitemap, and robots", () => {
  test("builds absolute breadcrumbs with sequential positions", () => {
    const result = brandBreadcrumbs(SITE, "Sample Brand", "/brands/sample-brand");
    expect(result.items.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(result.items[0]?.url).toBe("https://kronos.example/");
    expect(result.items[2]?.current).toBe(true);
  });

  test("excludes noindex, non-canonical, duplicate, and temporary image entries", () => {
    const collection = createSitemapCollection("products", [
      {
        group: "products",
        pageType: "product",
        url: "https://kronos.example/product/sample-watch",
        canonicalUrl: "https://kronos.example/product/sample-watch",
        indexable: true,
        images: [
          {
            url: "https://kronos.example/assets/temp.jpg",
            productionApproved: false,
          },
        ],
      },
      {
        group: "products",
        pageType: "product",
        url: "https://kronos.example/product/sample-watch?utm_source=x",
        canonicalUrl: "https://kronos.example/product/sample-watch",
        indexable: true,
      },
      {
        group: "products",
        pageType: "search",
        url: "https://kronos.example/search?q=x",
        canonicalUrl: "https://kronos.example/search",
        indexable: false,
      },
      {
        group: "products",
        pageType: "shop",
        url: "https://kronos.example/watches",
        canonicalUrl: "https://kronos.example/watches",
        indexable: true,
      },
    ]);
    expect(collection.entries).toHaveLength(1);
    expect(collection.entries[0]?.images).toBeUndefined();
  });

  test("blocks non-production environments and requires production site URL", () => {
    expect(buildRobotsPolicy({ environment: "preview" }).text).toBe(
      "User-agent: *\nDisallow: /\n",
    );
    expect(
      buildRobotsPolicy({
        environment: "production",
        siteUrl: "https://kronos.example",
      }).sitemapUrl,
    ).toBe("https://kronos.example/sitemap.xml");
    expect(() => buildRobotsPolicy({ environment: "production" })).toThrow();
  });
});

describe("product SEO adapter and validation", () => {
  test("omits unapproved price, rating, media, shipping, and returns", () => {
    const result = adaptProductToSeo(product(), brand, {
      ...SITE,
      flags: {
        offers: false,
        ratings: false,
        reviews: false,
        shipping: false,
        returns: false,
        warranty: false,
        approvedMedia: false,
      },
    });
    expect(result.statusReason).toBe("active");
    expect(result.productSchema?.offer).toBeUndefined();
    expect(result.productSchema?.aggregateRating).toBeUndefined();
    expect(result.productSchema?.images).toBeUndefined();
  });

  test("includes a valid Offer only when explicitly enabled", () => {
    const result = adaptProductToSeo(product(), brand, {
      ...SITE,
      flags: {
        offers: true,
        ratings: false,
        reviews: false,
        shipping: false,
        returns: false,
        warranty: false,
        approvedMedia: false,
      },
    });
    expect(result.productSchema?.offer).toMatchObject({
      price: "125000000",
      priceCurrency: "IRR",
      availability: "https://schema.org/InStock",
    });
  });

  test("keeps discontinued pages self-canonical but removes Offer", () => {
    const result = adaptProductToSeo(product("discontinued"), brand, {
      ...SITE,
      retainDiscontinuedPage: true,
      flags: {
        offers: true,
        ratings: false,
        reviews: false,
        shipping: false,
        returns: false,
        warranty: false,
        approvedMedia: false,
      },
    });
    expect(result).toMatchObject({
      canonicalPath: "/product/sample-watch",
      robots: "index,follow",
      statusReason: "discontinued",
    });
    expect(result.productSchema?.offer).toBeUndefined();
  });

  test("keeps unavailable pages noindex until lifecycle retention is approved", () => {
    const result = adaptProductToSeo(product("unavailable"), brand, {
      ...SITE,
      flags: {
        offers: true,
        ratings: false,
        reviews: false,
        shipping: false,
        returns: false,
        warranty: false,
        approvedMedia: false,
      },
    });
    expect(result).toMatchObject({
      canonicalPath: "/product/sample-watch",
      robots: "noindex,follow",
      statusReason: "unavailable",
    });
  });

  test("uses approved media dimensions instead of invented image values", () => {
    const result = adaptProductToSeo(product(), brand, {
      ...SITE,
      isApprovedMedia: () => true,
      flags: {
        offers: false,
        ratings: false,
        reviews: false,
        shipping: false,
        returns: false,
        warranty: false,
        approvedMedia: true,
      },
    });
    expect(result.metadata?.image).toEqual({
      url: "https://kronos.example/assets/watch.jpg",
      alt: "Sample watch",
      width: 1200,
      height: 1200,
    });
  });

  test("detects duplicate canonicals", () => {
    const issues = detectDuplicateCanonicals([
      { pathname: "/shop", canonical: "https://kronos.example/shop" },
      { pathname: "/shop-copy", canonical: "https://kronos.example/shop" },
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe("duplicate-canonical");
  });

  test("absolute URL helper never guesses the host", () => {
    expect(absoluteUrl("https://kronos.example", "/shop/")).toBe(
      "https://kronos.example/shop",
    );
  });
});
