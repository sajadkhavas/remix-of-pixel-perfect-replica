import type { ProductCardPriceModel } from "./product-card-model";

export function ProductPrice({ price }: { readonly price: ProductCardPriceModel }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1" dir="rtl">
      <span
        className="text-sm font-bold tabular-nums text-[#D8BC6E] sm:text-base lg:text-lg"
        style={{ fontFamily: "DM Mono, Vazirmatn Variable, monospace" }}
      >
        {price.current}
      </span>

      {price.previous ? (
        <span className="text-[10px] tabular-nums text-[#77716A] line-through sm:text-xs">
          {price.previous}
        </span>
      ) : null}

      {price.discountPercent ? (
        <span className="rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.08] px-2 py-1 text-[9px] font-bold text-[#D9C076]">
          {price.discountPercent.toLocaleString("fa-IR")}٪
        </span>
      ) : null}
    </div>
  );
}
