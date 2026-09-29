import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

import { ContentPage } from "@/components/content/PolicyPage";

const FAQS = [
  {
    q: "چطور ساعت مناسب را پیدا کنم؟",
    a: "از فیلترهای فروشگاه برای محدودکردن نتایج بر اساس دسته‌بندی، برند، نوع موتور، اندازه قاب، جنس قاب، رنگ صفحه و سایر مشخصات استفاده کنید.",
  },
  {
    q: "آیا می‌توانم یک محصول را برای بعد ذخیره کنم؟",
    a: "بله. از آیکن قلب روی کارت یا صفحه محصول استفاده کنید تا ساعت در بخش علاقه‌مندی‌ها ذخیره شود.",
  },
  {
    q: "قیمت و موجودی از کجا بررسی می‌شود؟",
    a: "صفحه همان محصول مرجع قیمت، واریانت انتخاب‌شده و وضعیت موجودی قابل نمایش است.",
  },
  {
    q: "چطور مدل‌های یک دسته را ببینم؟",
    a: "از بخش دسته‌بندی‌ها وارد کالکشن لوکس، اسپرت، کلاسیک یا هوشمند شوید؛ هر صفحه فقط محصولات همان دسته را نمایش می‌دهد.",
  },
  {
    q: "شرایط ارسال و بازگشت را کجا ببینم؟",
    a: "صفحه «ارسال و بازگشت کالا» راهنمای اصلی این بخش است و اطلاعات مرتبط با سفارش از همان مسیر قابل پیگیری است.",
  },
  {
    q: "برای بررسی اصالت چه چیزهایی مهم است؟",
    a: "نام مدل، شماره مرجع، مشخصات فنی و مدارک همراه محصول را با اطلاعات قابل بررسی همان سازنده و همان سفارش تطبیق دهید.",
  },
  {
    q: "روش پرداخت چه زمانی مشخص می‌شود؟",
    a: "روش‌های قابل استفاده برای سفارش در مرحله مربوط به پرداخت نمایش داده می‌شوند.",
  },
] as const;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "پرسش‌های متداول | KRONOS" },
      {
        name: "description",
        content: "پاسخ به پرسش‌های متداول درباره خرید و استفاده از فروشگاه KRONOS.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <ContentPage
      eyebrow="FAQ"
      title="پرسش‌های متداول"
      intro="پاسخ سریع به پرسش‌های رایج درباره جستجو، انتخاب محصول، علاقه‌مندی‌ها، سفارش و خدمات خرید."
    >
      <div className="overflow-hidden rounded-[1.4rem] border border-white/[0.07] bg-[#0D0F11]">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="group border-b border-white/[0.06] last:border-b-0"
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-[#F0EDE8] outline-none transition-colors hover:text-[#DCC27C] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C9A84C] sm:px-6">
              <span>{item.q}</span>
              <ChevronDown
                className="size-4 shrink-0 text-[#817B73] transition-transform duration-300 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="px-5 pb-5 text-sm leading-8 text-[#948E85] sm:px-6">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
