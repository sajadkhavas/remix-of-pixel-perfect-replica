import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PackageCheck, RotateCcw, Truck } from "lucide-react";

import {
  ContentPage,
  ContentSection,
  PolicyList,
  SupportLinks,
} from "@/components/content/PolicyPage";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { resolveClaimPresentation } from "@/domain/store-settings";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "ارسال و بازگشت کالا | KRONOS" },
      {
        name: "description",
        content:
          "راهنمای ارسال، تحویل و بازگشت کالا در KRONOS.",
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  const settings = usePublicStoreSettings();
  const shipping = resolveClaimPresentation(settings.shipping.presentationClaim);
  const returns = resolveClaimPresentation(settings.returns.presentationClaim);

  return (
    <ContentPage
      eyebrow="DELIVERY & RETURNS"
      title="ارسال و بازگشت کالا"
      intro="جزئیات هر سفارش بر اساس مقصد، روش تحویل و وضعیت همان محصول مشخص می‌شود. اطلاعات نهایی پیش از تأیید سفارش در اختیار شما قرار می‌گیرد."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <ContentSection title="ارسال">
          <Truck className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            روش ارسال و هزینه آن برای هر سفارش متناسب با مقصد و گزینه‌های در دسترس مشخص می‌شود.
          </p>
        </ContentSection>

        <ContentSection title="تحویل">
          <PackageCheck className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            هنگام دریافت، بسته‌بندی و مشخصات محصول را بررسی کنید و هر مغایرت قابل مشاهده را سریعاً اطلاع دهید.
          </p>
        </ContentSection>

        <ContentSection title="بازگشت">
          <RotateCcw className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            امکان بررسی درخواست بازگشت به وضعیت کالا، شرایط سفارش و اطلاعات درج‌شده برای همان محصول وابسته است.
          </p>
        </ContentSection>
      </div>

      {shipping.kind !== "hidden" ? (
        <ContentSection title="اطلاعات ارسال">
          <p>{shipping.text}</p>
        </ContentSection>
      ) : null}

      {returns.kind !== "hidden" ? (
        <ContentSection title="اطلاعات بازگشت">
          <p>{returns.text}</p>
        </ContentSection>
      ) : null}

      <ContentSection title="پیش از ثبت درخواست">
        <PolicyList
          items={[
            "شماره سفارش و نام محصول را آماده داشته باشید.",
            "در صورت وجود آسیب یا مغایرت ظاهری، تصویر واضح از بسته‌بندی و محصول تهیه کنید.",
            "محصول، متعلقات و بسته‌بندی را تا پایان بررسی نگهداری کنید.",
            "شرایط درج‌شده در صفحه همان محصول و اطلاعات سفارش ملاک بررسی هستند.",
          ]}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/purchase-terms"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
          >
            شرایط خرید
            <ArrowLeft className="size-3.5" aria-hidden="true" />
          </Link>
          <SupportLinks />
        </div>
      </ContentSection>
    </ContentPage>
  );
}
