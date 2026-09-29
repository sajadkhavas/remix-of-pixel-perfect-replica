import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import {
  ContentPage,
  ContentSection,
  PolicyList,
} from "@/components/content/PolicyPage";

export const Route = createFileRoute("/purchase-terms")({
  head: () => ({
    meta: [
      { title: "شرایط خرید | KRONOS" },
      {
        name: "description",
        content: "شرایط عمومی ثبت و پیگیری سفارش در KRONOS.",
      },
    ],
  }),
  component: PurchaseTermsPage,
});

function PurchaseTermsPage() {
  return (
    <ContentPage
      eyebrow="PURCHASE TERMS"
      title="شرایط خرید"
      intro="پیش از تأیید سفارش، مشخصات محصول، مدل انتخابی، تعداد، مبلغ و اطلاعات تحویل را با دقت بررسی کنید."
    >
      <ContentSection title="ثبت سفارش">
        <PolicyList
          items={[
            "اطلاعات سفارش باید کامل و صحیح وارد شوند.",
            "مدل، واریانت و تعداد انتخاب‌شده در خلاصه سفارش ملاک پردازش هستند.",
            "قیمت نهایی و هزینه‌های قابل اعمال پیش از تأیید سفارش نمایش داده می‌شوند.",
            "در صورت تغییر وضعیت موجودی پیش از تأیید نهایی، وضعیت جدید سفارش مبنا قرار می‌گیرد.",
          ]}
        />
      </ContentSection>

      <ContentSection title="محصول و مشخصات">
        <p>
          مشخصات فنی، تصاویر، شماره مرجع و اطلاعات هر محصول را پیش از خرید بررسی کنید.
          در صورت وجود چند واریانت، انتخاب ثبت‌شده در سفارش ملاک است.
        </p>
      </ContentSection>

      <ContentSection title="پرداخت، ارسال و بازگشت">
        <p>
          روش پرداخت، شیوه ارسال و شرایط بررسی درخواست بازگشت می‌توانند برای هر سفارش متفاوت باشند.
          صفحات مرتبط را پیش از تأیید سفارش مطالعه کنید.
        </p>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/payment-methods"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] px-4 text-sm font-semibold text-[#DAD3C9] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C]"
          >
            روش‌های پرداخت
            <ArrowLeft className="size-3.5" aria-hidden="true" />
          </Link>

          <Link
            to="/shipping-returns"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] px-4 text-sm font-semibold text-[#DAD3C9] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C]"
          >
            ارسال و بازگشت
            <ArrowLeft className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
