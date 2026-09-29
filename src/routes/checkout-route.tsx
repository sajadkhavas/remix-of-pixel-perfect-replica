import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

import { CheckoutForm } from "@/components/commerce/checkout/checkout-form";
import { CheckoutSummary } from "@/components/commerce/checkout/checkout-summary";
import { PageHero } from "@/components/layout/PageHero";
import { getVisiblePaymentMethods } from "@/components/layout/navigation-model";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";
import {
  checkoutCartIssueMessage,
  validateCheckoutCart,
  type CheckoutCustomerInput,
} from "@/lib/checkout";
import { useStore } from "@/lib/store-context";

export const Route = createFileRoute("/checkout-route")({
  head: () => ({
    meta: [
      { title: "تکمیل خرید | KRONOS" },
      {
        name: "description",
        content:
          "مرور اطلاعات تحویل و سفارش در KRONOS.",
      },
      {
        name: "robots",
        content: "noindex,nofollow",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const settings = usePublicStoreSettings();
  const { cart, hydrated } = useStore();
  const [review, setReview] =
    useState<CheckoutCustomerInput | null>(null);

  const checkoutEnabled =
    settings.features.checkout &&
    settings.environment.capabilities.checkout !==
      "disabled";

  const paymentMethods =
    getVisiblePaymentMethods(settings);

  if (!hydrated) {
    return <CheckoutPending />;
  }

  if (cart.items.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="CHECKOUT"
          title="سبد خرید شما خالی است"
          sub="برای ادامه خرید ابتدا یک محصول به سبد اضافه کنید."
        />

        <section
          className="bg-[#08090B] px-4 py-16 sm:px-6 sm:py-20"
          dir="rtl"
        >
          <div className="mx-auto max-w-md rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-7 text-center">
            <ShoppingBag
              className="mx-auto size-7 text-[#C9A84C]"
              aria-hidden="true"
            />

            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9A84C] px-5 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
            >
              مشاهده فروشگاه
              <ArrowRight
                className="size-4 rotate-180"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>
      </>
    );
  }

  const cartIssues = validateCheckoutCart(
    cart,
    CATALOG_PRODUCTS,
  );

  if (cartIssues.length > 0) {
    const uniqueMessages = [
      ...new Set(
        cartIssues.map(
          checkoutCartIssueMessage,
        ),
      ),
    ];

    return (
      <>
        <PageHero
          eyebrow="CHECKOUT"
          title="سبد خرید نیاز به بررسی دارد"
          sub="پیش از ادامه، موارد مشخص‌شده در سبد خرید را اصلاح کنید."
        />

        <section
          className="bg-[#08090B] px-4 py-12 sm:px-6 sm:py-16"
          dir="rtl"
        >
          <div className="mx-auto max-w-xl rounded-[1.5rem] border border-amber-300/15 bg-[#0D0F11] p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-300/15 bg-amber-300/[0.05]">
                <AlertTriangle
                  className="size-4 text-amber-200"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2 className="text-base font-semibold text-[#F0EDE8]">
                  اصلاح سبد خرید
                </h2>

                <ul className="mt-3 space-y-2 text-xs leading-6 text-[#A9A198]">
                  {uniqueMessages.map((message) => (
                    <li key={message}>
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-5 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
            >
              بازگشت به سبد خرید
            </Link>
          </div>
        </section>
      </>
    );
  }

  if (!checkoutEnabled) {
    return (
      <>
        <PageHero
          eyebrow="CHECKOUT"
          title="تکمیل خرید"
          sub="سبد خرید شما محفوظ است و می‌توانید محصولات را مرور یا ویرایش کنید."
        />

        <section
          className="bg-[#08090B] px-4 py-12 sm:px-6 sm:py-16"
          dir="rtl"
        >
          <div className="mx-auto max-w-xl rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-6 text-center sm:p-8">
            <CreditCard
              className="mx-auto size-7 text-[#C9A84C]"
              aria-hidden="true"
            />

            <h2 className="mt-4 text-lg font-semibold text-[#F0EDE8]">
              ثبت سفارش آنلاین در دسترس نیست
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8F887F]">
              می‌توانید سبد خرید را نگه دارید و
              محصولات انتخاب‌شده را بررسی کنید.
            </p>

            <Link
              to="/cart"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/[0.08] px-5 text-sm font-semibold text-[#D6BE78] transition-colors hover:border-[#C9A84C]/25"
            >
              بازگشت به سبد خرید
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="CHECKOUT"
        title="تکمیل خرید"
        sub="اطلاعات تحویل را بررسی کنید و پیش از ثبت نهایی، خلاصه سفارش را دوباره ببینید."
      />

      <section
        className="bg-[#08090B] px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        dir="rtl"
      >
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <div>
            {!review ? (
              <CheckoutForm
                onReview={setReview}
              />
            ) : (
              <div className="rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.07] text-[#D7BD77]">
                    <Check
                      className="size-4"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="text-lg font-semibold text-[#F0EDE8]">
                      مرور اطلاعات
                    </h2>
                    <p className="mt-1 text-xs text-[#77716A]">
                      مشخصات تحویل را پیش از
                      ادامه کنترل کنید.
                    </p>
                  </div>
                </div>

                <dl className="mt-6 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06] bg-[#090B0D] px-4">
                  <ReviewRow
                    label="گیرنده"
                    value={review.recipientName}
                  />
                  <ReviewRow
                    label="موبایل"
                    value={review.phone}
                  />
                  {review.email ? (
                    <ReviewRow
                      label="ایمیل"
                      value={review.email}
                    />
                  ) : null}
                  <ReviewRow
                    label="شهر"
                    value={`${review.province}، ${review.city}`}
                  />
                  {review.postalCode ? (
                    <ReviewRow
                      label="کد پستی"
                      value={review.postalCode}
                    />
                  ) : null}
                  <ReviewRow
                    label="نشانی"
                    value={review.addressLine}
                  />
                  {review.customerNote ? (
                    <ReviewRow
                      label="توضیحات"
                      value={review.customerNote}
                    />
                  ) : null}
                </dl>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setReview(null)
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] text-sm font-semibold text-[#AAA39A] transition-colors hover:border-[#C9A84C]/25 hover:text-[#D8BE76]"
                  >
                    <MapPin
                      className="size-4"
                      aria-hidden="true"
                    />
                    ویرایش اطلاعات
                  </button>

                  <Link
                    to="/payment-methods"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
                  >
                    <CreditCard
                      className="size-4"
                      aria-hidden="true"
                    />
                    روش‌های پرداخت
                  </Link>
                </div>

                {paymentMethods.length > 0 ? (
                  <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3">
                    <p className="text-[10px] text-[#77716A]">
                      روش‌های پرداخت فعال
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {paymentMethods.map(
                        (method) => (
                          <span
                            key={
                              method.providerId
                            }
                            className="rounded-lg border border-white/[0.07] bg-[#090B0D] px-3 py-2 text-[10px] text-[#B0A99F]"
                          >
                            {
                              method.displayName
                            }
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-xs leading-6 text-[#8F887F]">
                    روش پرداخت فعالی برای سفارش
                    آنلاین ثبت نشده است.
                  </p>
                )}
              </div>
            )}
          </div>

          <CheckoutSummary cart={cart} />
        </div>
      </section>
    </>
  );
}

function CheckoutPending() {
  return (
    <>
      <PageHero
        eyebrow="CHECKOUT"
        title="تکمیل خرید"
      />

      <section
        className="bg-[#08090B] px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        dir="rtl"
        aria-label="در حال آماده‌سازی سفارش"
      >
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="h-[32rem] animate-pulse rounded-[1.5rem] bg-white/[0.035] motion-reduce:animate-none" />
          <div className="h-96 animate-pulse rounded-[1.5rem] bg-white/[0.035] motion-reduce:animate-none" />
        </div>
      </section>
    </>
  );
}

function ReviewRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-3 text-xs sm:text-sm">
      <dt className="text-[#77716A]">
        {label}
      </dt>
      <dd className="leading-7 text-[#D8D1C7]">
        {value}
      </dd>
    </div>
  );
}
