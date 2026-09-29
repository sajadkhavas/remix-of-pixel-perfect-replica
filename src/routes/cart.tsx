import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { PageHero } from "@/components/layout/PageHero";
import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";
import { calculateCartSubtotal } from "@/domain/commerce";
import {
  isPurchasableVariant,
  type Product,
  type ProductVariant,
} from "@/domain/product";
import type { Money } from "@/domain/shared";
import {
  checkoutCartIssueMessage,
  validateCheckoutCart,
} from "@/lib/checkout";
import { useStore } from "@/lib/store-context";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سبد خرید | KRONOS" },
      {
        name: "robots",
        content: "noindex,nofollow",
      },
    ],
  }),
  component: CartPage,
});

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

function quantityLimits(
  variant: ProductVariant | undefined,
) {
  if (!variant) {
    return {
      min: 1,
      step: 1,
      max: undefined,
    } as const;
  }

  const min = Math.max(
    1,
    Math.trunc(
      variant.inventory.minOrderQuantity,
    ),
  );
  const step = Math.max(
    1,
    Math.trunc(
      variant.inventory.orderIncrement,
    ),
  );

  const limits: number[] = [];

  if (
    variant.inventory.maxOrderQuantity !==
    undefined
  ) {
    limits.push(
      Math.max(
        0,
        Math.trunc(
          variant.inventory.maxOrderQuantity,
        ),
      ),
    );
  }

  if (
    variant.inventory.tracking === "tracked" &&
    (variant.inventory.status === "in-stock" ||
      variant.inventory.status === "low-stock") &&
    variant.inventory.availableQuantity !==
      undefined
  ) {
    limits.push(
      Math.max(
        0,
        Math.trunc(
          variant.inventory.availableQuantity,
        ),
      ),
    );
  }

  return {
    min,
    step,
    max:
      limits.length > 0
        ? Math.min(...limits)
        : undefined,
  } as const;
}

function CartPage() {
  const {
    cart,
    hydrated,
    setQty,
    removeFromCart,
    clearCart,
  } = useStore();

  if (!hydrated) {
    return <CartPending />;
  }

  const items = cart.items.map((line) => {
    const product = CATALOG_PRODUCTS.find(
      (item) =>
        item.identity.id === line.productId,
    );

    const variant = product?.variants.find(
      (item) => item.id === line.variantId,
    );

    return {
      line,
      product,
      variant,
      route: productRoute(product),
    };
  });

  const issues = validateCheckoutCart(
    cart,
    CATALOG_PRODUCTS,
  );
  const issueByLine = new Map(
    issues.map((issue) => [
      issue.lineId,
      issue,
    ]),
  );

  const subtotal = calculateCartSubtotal(cart);
  const totalQuantity = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="سبد خرید"
          title="سبد شما خالی است"
        />

        <section
          className="bg-[#08090B] px-4 py-16 sm:px-6 sm:py-20"
          dir="rtl"
        >
          <div className="mx-auto max-w-md rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/[0.05]">
              <ShoppingBag
                className="size-7 text-[#C9A84C]/70"
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#F0EDE8]">
              هنوز محصولی انتخاب نکرده‌اید
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#8F8A82]">
              ساعت موردنظر خود را از فروشگاه انتخاب و
              به سبد اضافه کنید.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C9A84C] px-7 text-sm font-semibold text-[#08090B] transition-colors hover:bg-[#DFC36E]"
            >
              مشاهده فروشگاه
              <ArrowLeft
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="سبد خرید"
        title={`${totalQuantity.toLocaleString(
          "fa-IR",
        )} محصول در سبد شما`}
      />

      <section
        className="bg-[#08090B] px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        dir="rtl"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="space-y-3">
            {items.map(
              ({
                line,
                product,
                variant,
                route,
              }) => {
                const { min, step, max } =
                  quantityLimits(variant);

                const issue =
                  issueByLine.get(line.lineId);

                const lineTotal: Money = {
                  ...line.unitPriceSnapshot,
                  amountMinor:
                    line.unitPriceSnapshot
                      .amountMinor * line.quantity,
                };

                const image = line.productSnapshot
                  .imageUrl ? (
                  <img
                    src={
                      line.productSnapshot.imageUrl
                    }
                    alt={
                      line.productSnapshot.name
                    }
                    width={128}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center p-2 text-center text-[10px] text-[#77716A]">
                    تصویر در دسترس نیست
                  </div>
                );

                const quantityEditable = Boolean(
                  product &&
                    product.status === "active" &&
                    variant &&
                    isPurchasableVariant(variant),
                );

                const canDecrease =
                  quantityEditable &&
                  line.quantity > min;

                const canIncrease =
                  quantityEditable &&
                  (max === undefined ||
                    line.quantity + step <= max);

                return (
                  <article
                    key={line.lineId}
                    className="flex gap-3 rounded-xl border border-white/[0.07] bg-[#0D0F11] p-3 sm:gap-5 sm:p-4"
                  >
                    {route ? (
                      <Link
                        to="/shop/$category/$product"
                        params={route}
                        aria-label={`مشاهده ${line.productSnapshot.name}`}
                        className="relative aspect-[4/5] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#090A0C] sm:w-32"
                      >
                        {image}
                      </Link>
                    ) : (
                      <div className="relative aspect-[4/5] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#090A0C] sm:w-32">
                        {image}
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[8px] font-medium tracking-[0.18em] text-[#7E7972] sm:text-[9px]">
                        {product?.identity
                          .primarySku ??
                          line.productSnapshot.sku}
                      </span>

                      {route ? (
                        <Link
                          to="/shop/$category/$product"
                          params={route}
                          className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#F0EDE8] transition-colors hover:text-[#C9A84C] sm:text-base"
                        >
                          {
                            line.productSnapshot
                              .name
                          }
                        </Link>
                      ) : (
                        <span className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#F0EDE8] sm:text-base">
                          {
                            line.productSnapshot
                              .name
                          }
                        </span>
                      )}

                      {line.productSnapshot
                        .variantLabel ? (
                        <span className="mt-1 text-[10px] text-[#77716A]">
                          {
                            line.productSnapshot
                              .variantLabel
                          }
                        </span>
                      ) : null}

                      <span
                        className="mt-1.5 text-sm font-semibold tabular-nums text-[#D5BB78] sm:text-base"
                        style={{
                          fontFamily:
                            "DM Mono, monospace",
                        }}
                      >
                        {formatMoney(lineTotal)}
                      </span>

                      {issue ? (
                        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2.5">
                          <AlertTriangle
                            className="mt-0.5 size-3.5 shrink-0 text-amber-200"
                            aria-hidden="true"
                          />
                          <p className="text-[10px] leading-5 text-amber-100/80 sm:text-[11px]">
                            {checkoutCartIssueMessage(
                              issue,
                            )}
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                        <div className="flex h-9 items-center overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.015]">
                          <button
                            type="button"
                            onClick={() =>
                              setQty(
                                line.lineId,
                                Math.max(
                                  min,
                                  line.quantity -
                                    step,
                                ),
                              )
                            }
                            disabled={!canDecrease}
                            className="flex size-9 items-center justify-center text-[#99938A] transition-colors hover:text-[#C9A84C] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="کاهش تعداد"
                          >
                            <Minus
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </button>

                          <span className="min-w-7 text-center text-xs tabular-nums text-[#F0EDE8]">
                            {line.quantity.toLocaleString(
                              "fa-IR",
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setQty(
                                line.lineId,
                                max === undefined
                                  ? line.quantity +
                                      step
                                  : Math.min(
                                      max,
                                      line.quantity +
                                        step,
                                    ),
                              )
                            }
                            disabled={!canIncrease}
                            className="flex size-9 items-center justify-center text-[#99938A] transition-colors hover:text-[#C9A84C] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="افزایش تعداد"
                          >
                            <Plus
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              line.lineId,
                            )
                          }
                          className="flex size-9 items-center justify-center rounded-lg text-[#77716A] transition-colors hover:bg-red-500/10 hover:text-red-400"
                          aria-label={`حذف ${line.productSnapshot.name}`}
                        >
                          <Trash2
                            className="size-4"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              },
            )}

            <button
              type="button"
              onClick={clearCart}
              className="inline-flex min-h-10 items-center text-xs text-[#77716A] transition-colors hover:text-red-400"
            >
              پاک کردن همه محصولات
            </button>
          </div>

          <aside className="h-fit rounded-2xl border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-6 lg:sticky lg:top-28">
            <span
              className="text-[9px] font-medium tracking-[0.24em] text-[#C9A84C]"
              dir="ltr"
            >
              ORDER SUMMARY
            </span>

            <h2 className="mt-2 text-xl font-semibold text-[#F0EDE8]">
              خلاصه سفارش
            </h2>

            <div className="mt-5 space-y-3 border-y border-white/[0.07] py-5">
              <SummaryRow
                label="تعداد محصولات"
                value={`${totalQuantity.toLocaleString(
                  "fa-IR",
                )} عدد`}
              />
              <SummaryRow
                label="جمع محصولات"
                value={formatMoney(subtotal)}
              />
              <SummaryRow
                label="ارسال"
                value="پس از انتخاب روش ارسال"
              />
            </div>

            <div className="flex items-end justify-between gap-4 py-5">
              <span className="text-xs text-[#8E887F]">
                جمع فعلی
              </span>
              <span
                className="text-xl font-semibold tabular-nums text-[#DCC27C]"
                style={{
                  fontFamily:
                    "DM Mono, monospace",
                }}
              >
                {formatMoney(subtotal)}
              </span>
            </div>

            {issues.length === 0 ? (
              <Link
                to="/checkout"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#08090B] transition-colors hover:bg-[#DFC36E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              >
                <ShoppingBag
                  className="size-4"
                  aria-hidden="true"
                />
                تکمیل خرید
              </Link>
            ) : (
              <div
                className="rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-center text-xs leading-6 text-amber-100/80"
                role="status"
              >
                برای ادامه، موارد مشخص‌شده در
                سبد را بررسی کنید.
              </div>
            )}

            <Link
              to="/shop"
              className="mt-3 flex min-h-10 items-center justify-center gap-2 text-xs text-[#888279] transition-colors hover:text-[#C9A84C]"
            >
              ادامه خرید
              <ArrowLeft
                className="size-3.5"
                aria-hidden="true"
              />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

function CartPending() {
  return (
    <>
      <PageHero
        eyebrow="سبد خرید"
        title="سبد خرید"
      />
      <section
        className="bg-[#08090B] px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        dir="rtl"
        aria-label="در حال آماده‌سازی سبد خرید"
      >
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-44 animate-pulse rounded-xl bg-white/[0.035] motion-reduce:animate-none" />
          <div className="h-72 animate-pulse rounded-2xl bg-white/[0.035] motion-reduce:animate-none" />
        </div>
      </section>
    </>
  );
}

function SummaryRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
      <span className="text-[#858078]">
        {label}
      </span>
      <span className="text-left text-[#E2DDD4]">
        {value}
      </span>
    </div>
  );
}
