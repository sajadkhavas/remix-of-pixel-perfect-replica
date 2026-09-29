import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import {
  ContentPage,
  ContentSection,
  PolicyList,
} from "@/components/content/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "شرایط استفاده | KRONOS" },
      {
        name: "description",
        content: "شرایط عمومی استفاده از وب‌سایت KRONOS.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <ContentPage
      eyebrow="TERMS"
      title="شرایط استفاده"
      intro="استفاده از سایت به معنی پذیرش قواعد عمومی استفاده از صفحات، اطلاعات محصولات و قابلیت‌های فروشگاه است."
    >
      <ContentSection title="استفاده از محتوا و خدمات">
        <PolicyList
          items={[
            "از سایت برای مشاهده، جستجو و انتخاب محصولات در چارچوب استفاده عادی استفاده کنید.",
            "برای ایجاد اختلال، دسترسی غیرمجاز یا دورزدن محدودیت‌های فنی تلاش نکنید.",
            "اطلاعات ثبت‌شده هنگام سفارش باید صحیح و متعلق به همان سفارش‌دهنده یا گیرنده مجاز باشد.",
          ]}
        />
      </ContentSection>

      <ContentSection title="اطلاعات محصول">
        <p>
          نام مدل، مشخصات، تصاویر، قیمت و وضعیت موجودی ممکن است با تغییر اطلاعات همان محصول به‌روزرسانی شوند.
          پیش از ثبت سفارش، صفحه محصول و خلاصه سفارش را بررسی کنید.
        </p>
      </ContentSection>

      <ContentSection title="خرید">
        <p>
          شرایط مرتبط با ثبت سفارش، پرداخت، ارسال و بازگشت در صفحات اختصاصی همان بخش توضیح داده می‌شوند.
        </p>

        <Link
          to="/purchase-terms"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
        >
          شرایط خرید
          <ArrowLeft className="size-3.5" aria-hidden="true" />
        </Link>
      </ContentSection>
    </ContentPage>
  );
}
