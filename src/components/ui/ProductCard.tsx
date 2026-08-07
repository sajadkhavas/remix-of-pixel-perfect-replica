import { memo } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { useStore } from "@/lib/store-context";
import { ProductBadges } from "@/components/commerce/product-badges";
import { ProductPrice } from "@/components/commerce/price";
import { ResponsiveProductImage } from "@/components/commerce/responsive-product-image";
import {
  legacyWatchToCardViewModel,
  type LegacyWatchModel,
  type ProductCardViewModel,
} from "@/components/commerce/product-card-model";

export type Watch = LegacyWatchModel;

export interface ProductCardViewProps {
  readonly model: ProductCardViewModel;
  readonly wishlistEnabled?: boolean;
  readonly wishlisted?: boolean;
  readonly onToggleWishlist?: () => void;
  readonly onAddToCart?: () => void;
}

export function ProductCardView({
  model,
  wishlistEnabled = false,
  wishlisted = false,
  onToggleWishlist,
  onAddToCart,
}: ProductCardViewProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border-subtle bg-background-surface transition-colors hover:border-border-default">
      <div className="relative">
        <Link
          to="/product/$id"
          params={{ id: model.routeId }}
          className="block aspect-square overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
        >
          <ResponsiveProductImage image={model.image} />
        </Link>

        <div className="absolute end-3 top-3 max-w-[70%]">
          <ProductBadges badges={model.badges} />
        </div>

        {wishlistEnabled && onToggleWishlist ? (
          <div className="absolute start-3 top-3">
            <button
              type="button"
              aria-label={wishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              aria-pressed={wishlisted}
              onClick={onToggleWishlist}
              className="inline-flex size-11 items-center justify-center rounded-md border border-border-subtle bg-background-elevated text-text-secondary transition-colors hover:border-border-default hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <Heart className={wishlisted ? "size-5 fill-current" : "size-5"} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 p-4 sm:p-5" dir="rtl">
        <div>
          <p className="text-xs text-text-muted">{model.brand}</p>
          <Link
            to="/product/$id"
            params={{ id: model.routeId }}
            className="mt-1 block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <h2 className="line-clamp-2 text-sm font-semibold leading-6 text-text-primary transition-colors group-hover:text-accent-primary sm:text-base">
              {model.name}
            </h2>
          </Link>
        </div>

        {model.specs.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="مشخصات کلیدی">
            {model.specs.map((spec) => (
              <li
                key={spec}
                className="rounded-sm border border-border-subtle px-2 py-1 text-[10px] text-text-secondary"
              >
                {spec}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
          <span className="text-xs font-medium text-text-secondary">
            {model.availability.label}
          </span>
          {model.rating ? (
            <span
              className="inline-flex items-center gap-1 text-xs text-text-secondary"
              aria-label={`امتیاز ${model.rating.value} از ۵، ${model.rating.count} نظر`}
            >
              <Star className="size-4 text-accent-primary" aria-hidden="true" />
              {model.rating.value.toLocaleString("fa-IR")}
              <span className="text-text-muted">
                ({model.rating.count.toLocaleString("fa-IR")})
              </span>
            </span>
          ) : null}
        </div>

        {model.price ? <ProductPrice price={model.price} /> : null}

        <button
          type="button"
          disabled={!model.availability.purchasable || !onAddToCart}
          onClick={onAddToCart}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-background-canvas transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="size-4" aria-hidden="true" />
          {model.availability.purchasable ? "افزودن به سبد" : model.availability.label}
        </button>
      </div>
    </article>
  );
}

export const ProductCard = memo(function ProductCard({
  watch,
  showRatings = false,
  wishlistEnabled = true,
}: {
  watch: Watch;
  showRatings?: boolean;
  wishlistEnabled?: boolean;
}) {
  const { addToCart, isWishlisted, toggleWishlist } = useStore();
  const model = legacyWatchToCardViewModel(watch, { includeRatings: showRatings });
  const wishlisted = wishlistEnabled && isWishlisted(watch.id);

  return (
    <ProductCardView
      model={model}
      wishlistEnabled={wishlistEnabled}
      wishlisted={wishlisted}
      onToggleWishlist={wishlistEnabled ? () => toggleWishlist(watch.id) : undefined}
      onAddToCart={model.availability.purchasable ? () => addToCart(watch.id) : undefined}
    />
  );
});
