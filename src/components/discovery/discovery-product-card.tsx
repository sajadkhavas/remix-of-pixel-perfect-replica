import { ProductBadges } from "@/components/commerce/product-badges";
import type { ProductCardViewModel } from "@/components/commerce/product-card-model";
import { ProductPrice } from "@/components/commerce/price";
import { ResponsiveProductImage } from "@/components/commerce/responsive-product-image";
import { cn } from "@/lib/utils";

export function DiscoveryProductCard({
  model,
  view = "grid",
}: {
  readonly model: ProductCardViewModel;
  readonly view?: "grid" | "list";
}) {
  const listView = view === "list";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border border-border-subtle bg-background-surface",
        listView && "grid grid-cols-[7.5rem_minmax(0,1fr)] sm:grid-cols-[11rem_minmax(0,1fr)]",
      )}
      dir="rtl"
      aria-label={`${model.brand} ${model.name}`}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-background-elevated",
          listView ? "min-h-full" : "aspect-square",
        )}
      >
        {model.image ? (
          <ResponsiveProductImage image={model.image} />
        ) : (
          <div className="flex size-full min-h-32 items-center justify-center p-4 text-center text-xs text-text-muted">
            تصویر محصول در دسترس نیست
          </div>
        )}
        <div className="absolute end-3 top-3 max-w-[75%]">
          <ProductBadges badges={model.badges} />
        </div>
      </div>

      <div className={cn("flex flex-col gap-3 p-4", listView && "justify-center sm:p-5")}>
        <div>
          <p className="text-xs text-text-muted">{model.brand}</p>
          <h2 className="mt-1 text-sm font-semibold leading-6 text-text-primary sm:text-base">
            {model.name}
          </h2>
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
          <span className="text-xs font-medium text-text-secondary">
            {model.availability.label}
          </span>
          {model.price ? <ProductPrice price={model.price} /> : null}
        </div>
      </div>
    </article>
  );
}
