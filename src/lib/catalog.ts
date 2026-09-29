import { CATALOG_BRANDS } from "@/data/fixtures/brands";
import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";

export interface Watch {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly sale_price?: number;
  readonly image: string;
  readonly category: string;
  readonly caseMaterial: string;
  readonly waterResistance: string;
  readonly stock: number;
  readonly rating?: number;
  readonly review_count?: number;
  readonly isNew?: boolean;
  readonly isLimited?: boolean;
}

function defaultVariant(product: (typeof CATALOG_PRODUCTS)[number]) {
  return product.variants.find(
    (variant) => variant.id === product.defaultVariantId,
  );
}

function textSpec(
  product: (typeof CATALOG_PRODUCTS)[number],
  key: string,
): string {
  const spec = product.specificationValues.find((item) => item.key === key);
  if (!spec) return "";

  if (spec.value.type === "text") return spec.value.value;
  if (spec.value.type === "number") {
    return `${spec.value.value}${spec.value.unit ?? ""}`;
  }
  if (spec.value.type === "list") return spec.value.values.join(", ");
  return spec.value.value ? "yes" : "no";
}

export const CATALOG: readonly Watch[] = CATALOG_PRODUCTS.map((product) => {
  const variant = defaultVariant(product);
  const brand = CATALOG_BRANDS.find((item) => item.id === product.brandId);
  const category = CATALOG_CATEGORIES.find(
    (item) => item.id === product.primaryCategoryId,
  );
  const primaryImage = product.media.assets.find(
    (asset) =>
      asset.type === "image" &&
      asset.id === product.media.primaryMediaId,
  );

  return {
    id: product.identity.id,
    name: product.content.name.default,
    brand: brand?.name ?? "",
    price: variant?.pricing.listPrice.amountMinor ?? 0,
    sale_price: variant?.pricing.salePrice?.amountMinor,
    image: primaryImage?.type === "image" ? primaryImage.url : "",
    category: category?.slug ?? "",
    caseMaterial: textSpec(product, "case-material"),
    waterResistance: textSpec(product, "water-resistance"),
    stock: variant?.inventory.availableQuantity ?? 0,
    rating: product.reviewSummary?.ratingValue,
    review_count: product.reviewSummary?.reviewCount,
    isNew: product.badges.includes("new"),
    isLimited: product.badges.includes("limited-edition"),
  };
});

export const CATEGORIES = CATALOG_CATEGORIES.filter(
  (category) => category.depth === 1,
).map((category) => ({
  slug: category.slug,
  name: category.title.default,
  desc: category.intro?.default ?? "",
  color: "#C9A84C",
  brands: CATALOG_BRANDS.filter((brand) =>
    CATALOG_PRODUCTS.some(
      (product) =>
        product.brandId === brand.id &&
        product.categoryIds.includes(category.id),
    ),
  ).map((brand) => brand.name),
}));

export const BRANDS = CATALOG_BRANDS.map((brand) => ({
  slug: brand.slug,
  name: brand.name,
  tagline: brand.description.default,
}));

export function getById(id: string | number) {
  const key = String(id);

  return CATALOG.find(
    (watch) =>
      watch.id === key ||
      CATALOG_PRODUCTS.find(
        (product) =>
          product.identity.id === watch.id &&
          product.identity.slug === key,
      ),
  );
}

export function getByCategory(slug: string) {
  return CATALOG.filter((watch) => watch.category === slug);
}

export function getByBrand(slug: string) {
  const brand = CATALOG_BRANDS.find((item) => item.slug === slug);
  if (!brand) return [];

  return CATALOG.filter((watch) => watch.brand === brand.name);
}
