import type { ProductCardPriceModel } from "./product-card-model";

export function ProductPrice({ price }: { price: ProductCardPriceModel }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1" dir="rtl">
      <span className="text-base font-bold tabular-nums text-accent-primary sm:text-lg">
        {price.current}
      </span>
      {price.previous ? (
        <span className="text-xs tabular-nums text-text-muted line-through">{price.previous}</span>
      ) : null}
      {price.discountPercent ? (
        <span className="rounded-sm bg-product-sale px-2 py-1 text-[10px] font-bold text-background-canvas">
          {price.discountPercent.toLocaleString("fa-IR")}٪ تخفیف
        </span>
      ) : null}
    </div>
  );
}
