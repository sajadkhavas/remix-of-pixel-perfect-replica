import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

function source(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

const routeSource = source("src/routes/index.tsx");
const heroSource = source("src/components/sections/HeroSection.tsx");
const categorySource = source("src/components/sections/CategoriesSection.tsx");
const featuredSource = source("src/components/sections/FeaturedProducts.tsx");
const trustSource = source("src/components/sections/ServicesSection.tsx");
const editorialSource = source("src/components/sections/EditorialSection.tsx");
const handoffSource = source("docs/homepage/F5_HANDOFF.md");
const homepageSource = [
  routeSource,
  heroSource,
  categorySource,
  featuredSource,
  trustSource,
  editorialSource,
].join("\n");

describe("F5 homepage contract", () => {
  test("keeps one focused hero CTA and the approved H1", () => {
    expect(heroSource).toContain("ساعتی متناسب با سبک، کاربرد و بودجه شما");
    expect(heroSource.split('to="/shop"').length - 1).toBe(1);
    expect(heroSource).not.toContain("Swiper");
    expect(heroSource).not.toContain("Typewriter");
    expect(heroSource).not.toContain("Autoplay");
  });

  test("uses the accepted homepage information hierarchy", () => {
    const hero = routeSource.indexOf("<HeroSection");
    const categories = routeSource.indexOf("<CategoriesSection");
    const featured = routeSource.indexOf("<FeaturedProducts");
    const trust = routeSource.indexOf("<ServicesSection");
    const editorial = routeSource.indexOf("<EditorialSection");

    expect(hero).toBeGreaterThan(-1);
    expect(categories).toBeGreaterThan(hero);
    expect(featured).toBeGreaterThan(categories);
    expect(trust).toBeGreaterThan(featured);
    expect(editorial).toBeGreaterThan(trust);
  });

  test("does not reintroduce legacy spectacle dependencies or unsupported homepage claims", () => {
    for (const forbidden of [
      "framer-motion",
      "react-parallax",
      "vanilla-tilt",
      "@/lib/gsap",
      "BrandsMarquee",
      "ضمانت اصالت و ارسال امن",
      "1200+",
      "50+",
      "99%",
      "لایه سازگاری کاتالوگ",
      "normalized",
    ]) {
      expect(homepageSource).not.toContain(forbidden);
    }
  });

  test("links discovery only to currently accepted route families", () => {
    expect(homepageSource).not.toContain("/watches");
    expect(categorySource).toContain('slug: "luxury"');
    expect(categorySource).toContain('slug: "classic"');
    expect(categorySource).toContain('slug: "smart"');
    expect(categorySource).not.toContain('slug: "sport"');
    expect(editorialSource).toContain('to="/blog"');
    expect(trustSource).toContain('to: "/authenticity"');
    expect(trustSource).toContain('to: "/warranty"');
    expect(trustSource).toContain('to: "/shipping-returns"');
  });

  test("documents the legacy product-route compatibility boundary outside rendered copy", () => {
    expect(featuredSource).toContain("type Watch");
    expect(featuredSource).not.toContain("productToCardViewModel");
    expect(handoffSource).toContain("F7 owns Product Experience");
  });
});
