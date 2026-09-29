import { memo, type MouseEvent, type ReactNode } from "react";
import { ArrowLeft, Heart, ShoppingBag, Star } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

import { ProductBadges } from "@/components/commerce/product-badges";
import {
  type ProductCardViewModel,
} from "@/components/commerce/product-card-model";
import { productToCardViewModel } from "@/components/commerce/product-card-product-adapter";
import { ProductPrice } from "@/components/commerce/price";
import { ResponsiveProductImage } from "@/components/commerce/responsive-product-image";
import { CATALOG_BRANDS } from "@/data/fixtures/brands";
import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";
import type { Product } from "@/domain/product";
import type { Money } from "@/domain/shared";
import { useStore } from "@/lib/store-context";
import { cn } from "@/lib/utils";

function formatMoney(money: Money): string | null {
  if (!Number.isSafeInteger(money.amountMinor) || money.amountMinor < 0) {
    return null;
  }

  const amount = money.amountMinor / 10 ** money.fractionDigits;

  try {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: money.currency,
      minimumFractionDigits: money.fractionDigits,
      maximumFractionDigits: money.fractionDigits,
    }).format(amount);
  } catch {
    return amount.toLocaleString("fa-IR");
  }
}

function resolveProductHref(model: ProductCardViewModel): string {
  const product = CATALOG_PRODUCTS.find(
    (item) =>
      item.identity.id === model.id ||
      item.identity.slug === model.routeId,
  );

  const category = product
    ? CATALOG_CATEGORIES.find(
        (item) =>
          item.id === product.primaryCategoryId &&
          item.depth === 1,
      ) ??
      CATALOG_CATEGORIES.find(
        (item) =>
          item.depth === 1 &&
          product.categoryIds.includes(item.id),
      )
    : undefined;

  if (!category) return "/shop";

  return `/shop/${category.slug}/${model.routeId}`;
}

function ProductRouteLink({
  href,
  className,
  ariaLabel,
  children,
}: {
  readonly href: string;
  readonly className?: string;
  readonly ariaLabel?: string;
  readonly children: ReactNode;
}) {
  const router = useRouter();

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    void router.navigate({
      href,
      resetScroll: true,
      viewTransition: true,
    });
  };

  return (
    <a
      href={href}
      onClick={navigate}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}

export interface ProductCardViewProps {
  readonly model: ProductCardViewModel;
  readonly view?: "grid" | "list";
  readonly wishlistEnabled?: boolean;
  readonly imagePriority?: boolean;
}

export function ProductCardView({
  model,
  view = "grid",
  wishlistEnabled = true,
  imagePriority = false,
}: ProductCardViewProps) {
  const { addToCart, isWishlisted, toggleWishlist } = useStore();
  const listView = view === "list";
  const wishlisted = isWishlisted(model.id);
  const canAdd = Boolean(
    model.availability.purchasable && model.commerce,
  );
  const productHref = resolveProductHref(model);

  const addCurrentToCart = () => {
    if (!model.commerce) return;

    addToCart({
      productId: model.commerce.productId,
      variantId: model.commerce.variantId,
      productSlug: model.commerce.productSlug,
      name: model.name,
      variantLabel: model.commerce.variantLabel,
      sku: model.commerce.sku,
      imageUrl: model.image?.src,
      unitPrice: model.commerce.unitPrice,
      quantity: model.commerce.minQuantity,
      minQuantity: model.commerce.minQuantity,
      maxQuantity: model.commerce.maxQuantity,
      increment: model.commerce.increment,
      availableQuantity: model.commerce.availableQuantity,
    });
  };

  return (
    <article
      className={cn(
        "group relative h-full min-w-0 overflow-hidden rounded-[1.15rem] border border-white/[0.07] bg-[#0F1113] transition-[border-color,transform,box-shadow,background-color] duration-300",
        "hover:-translate-y-1 hover:border-[#C9A84C]/25 hover:bg-[#111315] hover:shadow-[0_24px_55px_rgba(0,0,0,0.28)]",
        listView &&
          "grid min-h-[166px] grid-cols-[7.75rem_minmax(0,1fr)] hover:-translate-y-0 sm:min-h-[204px] sm:grid-cols-[12rem_minmax(0,1fr)]",
      )}
      dir="rtl"
      aria-label={`${model.brand} ${model.name}`}
    >
      <div
        className={cn(
          "relative min-w-0 overflow-hidden bg-[#0B0D0F]",
          listView
            ? "h-full"
            : "aspect-[4/5] w-full",
        )}
      >
        <ProductRouteLink
          href={productHref}
          ariaLabel={`مشاهده ${model.name}`}
          className="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C9A84C]"
        >
          <ResponsiveProductImage
            image={model.image}
            eager={imagePriority}
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#0F1113]/75 to-transparent"
            aria-hidden="true"
          />
        </ProductRouteLink>

        {model.badges.length > 0 ? (
          <div className="pointer-events-none absolute end-2 top-2 z-20 max-w-[72%] sm:end-3 sm:top-3">
            <ProductBadges badges={model.badges} />
          </div>
        ) : null}

        {wishlistEnabled ? (
          <button
            type="button"
            aria-label={
              wishlisted
                ? "حذف از علاقه‌مندی‌ها"
                : "افزودن به علاقه‌مندی‌ها"
            }
            aria-pressed={wishlisted}
            onClick={() =>
              toggleWishlist(
                model.id,
                model.commerce?.variantId,
              )
            }
            className="absolute start-2 top-2 z-20 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-[#090A0C]/82 text-[#CBC5BA] backdrop-blur-md transition-all duration-300 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
          >
            <Heart
              className={cn(
                "size-4",
                wishlisted &&
                  "fill-[#C9A84C] text-[#C9A84C]",
              )}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          listView
            ? "justify-center p-3 sm:p-5"
            : "p-3 sm:p-4 lg:p-5",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p
            className="min-w-0 truncate text-[8px] font-semibold tracking-[0.17em] text-[#817B73] sm:text-[9px] sm:tracking-[0.2em]"
            dir="ltr"
          >
            {model.brand.toUpperCase()}
          </p>

          {model.rating ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[9px] tabular-nums text-[#A49D93]">
              <Star
                className="size-3 fill-[#C9A84C] text-[#C9A84C]"
                aria-hidden="true"
              />
              {model.rating.value.toLocaleString("fa-IR")}
            </span>
          ) : null}
        </div>

        <ProductRouteLink
          href={productHref}
          className="mt-1.5 block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
        >
          <h2
            className={cn(
              "line-clamp-2 font-semibold text-[#F0EDE8] transition-colors duration-300 group-hover:text-[#E3C77D]",
              listView
                ? "text-sm leading-6 sm:text-lg sm:leading-7"
                : "min-h-[2.7rem] text-[12px] leading-[1.75] sm:min-h-[3.2rem] sm:text-[15px]",
            )}
          >
            {model.name}
          </h2>
        </ProductRouteLink>

        <div
          className={cn(
            "mt-2",
            !listView && "min-h-6 sm:min-h-7",
          )}
        >
          {model.specs.length > 0 ? (
            <ul
              className="flex min-w-0 flex-wrap gap-1"
              aria-label="مشخصات کلیدی"
            >
              {model.specs
                .slice(0, listView ? 3 : 2)
                .map((spec) => (
                  <li
                    key={spec}
                    className="max-w-full truncate rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1 text-[8px] text-[#99938A] sm:text-[9px]"
                  >
                    {spec}
                  </li>
                ))}
            </ul>
          ) : null}
        </div>

        <div
          className="my-3 h-px w-full bg-white/[0.06]"
          aria-hidden="true"
        />

        <div className="flex min-h-5 items-center gap-2">
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              model.availability.purchasable
                ? model.availability.status === "low-stock"
                  ? "bg-[#D0A44D]"
                  : "bg-[#7EAE87]"
                : "bg-[#77716A]",
            )}
            aria-hidden="true"
          />

          <span className="truncate text-[9px] text-[#8D877F] sm:text-[10px]">
            {model.availability.label}
          </span>
        </div>

        <div
          className={cn(
            "mt-2",
            !listView && "min-h-[3.4rem]",
          )}
        >
          {model.price ? (
            <ProductPrice price={model.price} />
          ) : (
            <span className="text-xs text-[#77716A]">
              قیمت ثبت نشده
            </span>
          )}
        </div>

        <div
          className={cn(
            "mt-auto grid gap-2",
            listView
              ? "pt-3 sm:max-w-[300px]"
              : "pt-2",
          )}
        >
          <button
            type="button"
            disabled={!canAdd}
            onClick={addCurrentToCart}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#D5B257] px-3 text-[10px] font-semibold text-[#0B0C0E] transition-all duration-300 hover:bg-[#E0C16B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] disabled:cursor-not-allowed disabled:bg-white/[0.055] disabled:text-[#696969] sm:min-h-11 sm:text-[11px]"
          >
            <ShoppingBag
              className="size-3.5 shrink-0"
              aria-hidden="true"
            />
            {canAdd
              ? "افزودن به سبد"
              : model.availability.label}
          </button>

          {listView ? (
            <ProductRouteLink
              href={productHref}
              className="flex min-h-10 items-center justify-between rounded-lg border border-white/[0.07] px-3 text-[10px] text-[#AAA49A] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C]"
            >
              مشاهده جزئیات
              <ArrowLeft
                className="size-3.5"
                aria-hidden="true"
              />
            </ProductRouteLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(function ProductCard({
  product,
  showRatings = false,
  wishlistEnabled = true,
  imagePriority = false,
}: {
  readonly product: Product;
  readonly showRatings?: boolean;
  readonly wishlistEnabled?: boolean;
  readonly imagePriority?: boolean;
}) {
  const brand = CATALOG_BRANDS.find(
    (item) => item.id === product.brandId,
  );

  const model = productToCardViewModel(
    product,
    brand?.localizedName?.default ??
      brand?.name ??
      "—",
    formatMoney,
    { includeRatings: showRatings },
  );

  return (
    <ProductCardView
      model={model}
      wishlistEnabled={wishlistEnabled}
      imagePriority={imagePriority}
    />
  );
});
