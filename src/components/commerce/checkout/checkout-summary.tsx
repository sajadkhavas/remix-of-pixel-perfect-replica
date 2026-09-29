import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";
import type { Cart } from "@/domain/commerce";
import { calculateCartSubtotal } from "@/domain/commerce";
import type { Product } from "@/domain/product";
import type { Money } from "@/domain/shared";

function formatMoney(money: Money | null): string {
  if (!money) return "—";

  const amount =
    money.amountMinor / 10 ** money.fractionDigits;

  try {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: money.currency,
      minimumFractionDigits:
        money.fractionDigits,
      maximumFractionDigits:
        money.fractionDigits,
    }).format(amount);
  } catch {
    return amount.toLocaleString("fa-IR");
  }
}

function productRoute(
  product: Product | undefined,
):
  | Readonly<{
      category: string;
      product: string;
    }>
  | undefined {
  if (!product) return undefined;

  const category = CATALOG_CATEGORIES.find(
    (item) =>
      item.id === product.primaryCategoryId &&
      item.depth === 1,
  );

  if (!category) return undefined;

  return {
    category: category.slug,
    product: product.identity.slug,
  };
}

export function CheckoutSummary({
  cart,
}: {
  readonly cart: Cart;
}) {
  const subtotal = calculateCartSubtotal(cart);
  const quantity = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <aside className="h-fit rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-6 lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span
            className="text-[8px] font-semibold tracking-[0.28em] text-[#C9A84C]"
            dir="ltr"
          >
            ORDER REVIEW
          </span>
          <h2 className="mt-2 text-xl font-semibold text-[#F0EDE8]">
            خلاصه سفارش
          </h2>
        </div>

        <span className="inline-flex size-10 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/[0.05] text-[#D5BC75]">
          <ShoppingBag
            className="size-4"
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="mt-5 max-h-[330px] space-y-3 overflow-y-auto pe-1">
        {cart.items.map((line) => {
          const product = CATALOG_PRODUCTS.find(
            (item) =>
              item.identity.id === line.productId,
          );
          const route = productRoute(product);

          const image = line.productSnapshot.imageUrl ? (
            <img
              src={line.productSnapshot.imageUrl}
              alt={line.productSnapshot.name}
              width={64}
              height={80}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center px-2 text-center text-[9px] text-[#6F6962]">
              تصویر در دسترس نیست
            </span>
          );

          const title = (
            <span className="line-clamp-2 text-xs font-semibold leading-6 text-[#E8E1D8]">
              {line.productSnapshot.name}
            </span>
          );

          return (
            <div
              key={line.lineId}
              className="flex gap-3 rounded-xl border border-white/[0.06] bg-[#090B0D] p-3"
            >
              {route ? (
                <Link
                  to="/shop/$category/$product"
                  params={route}
                  aria-label={`مشاهده ${line.productSnapshot.name}`}
                  className="aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg bg-[#0D0F11]"
                >
                  {image}
                </Link>
              ) : (
                <div className="aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg bg-[#0D0F11]">
                  {image}
                </div>
              )}

              <div className="min-w-0 flex-1">
                {route ? (
                  <Link
                    to="/shop/$category/$product"
                    params={route}
                    className="transition-colors hover:text-[#D7BD77]"
                  >
                    {title}
                  </Link>
                ) : (
                  title
                )}

                {line.productSnapshot.variantLabel ? (
                  <p className="mt-0.5 truncate text-[9px] text-[#6F6962]">
                    {
                      line.productSnapshot
                        .variantLabel
                    }
                  </p>
                ) : null}

                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#817B73]">
                    {line.quantity.toLocaleString(
                      "fa-IR",
                    )}{" "}
                    عدد
                  </span>

                  <span className="text-[10px] font-semibold tabular-nums text-[#CDB46F]">
                    {formatMoney({
                      ...line.unitPriceSnapshot,
                      amountMinor:
                        line.unitPriceSnapshot
                          .amountMinor *
                        line.quantity,
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-3 border-y border-white/[0.06] py-5 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#817B73]">
            تعداد
          </span>
          <span className="text-[#D8D1C7]">
            {quantity.toLocaleString("fa-IR")} عدد
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[#817B73]">
            جمع محصولات
          </span>
          <span className="text-[#D8D1C7]">
            {formatMoney(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[#817B73]">
            ارسال
          </span>
          <span className="text-[#9E978E]">
            پس از انتخاب روش ارسال
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 pt-5">
        <span className="text-xs text-[#8A847C]">
          جمع فعلی
        </span>
        <strong
          className="text-lg tabular-nums text-[#DCC27C]"
          style={{
            fontFamily: "DM Mono, monospace",
          }}
        >
          {formatMoney(subtotal)}
        </strong>
      </div>

      <Link
        to="/cart"
        className="mt-4 flex min-h-10 items-center justify-center text-xs text-[#817B73] transition-colors hover:text-[#D1B970]"
      >
        ویرایش سبد خرید
      </Link>
    </aside>
  );
}
