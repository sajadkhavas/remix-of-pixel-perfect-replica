import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { ContentPage } from "@/components/content/PolicyPage";

const SERVICES = [
  {
    title: "راهنمای اصالت",
    description: "بررسی مدل، شماره مرجع، مشخصات فنی و مدارک همراه محصول.",
    to: "/authenticity" as const,
    Icon: BadgeCheck,
  },
  {
    title: "ضمانت",
    description: "راهنمای شرایط ضمانت و مدارک موردنیاز برای پیگیری.",
    to: "/warranty" as const,
    Icon: ShieldCheck,
  },
  {
    title: "ارسال و بازگشت",
    description: "راهنمای ارسال، تحویل و بررسی درخواست بازگشت کالا.",
    to: "/shipping-returns" as const,
    Icon: RotateCcw,
  },
  {
    title: "روش‌های پرداخت",
    description: "نکات پرداخت و روش‌هایی که برای سفارش قابل استفاده هستند.",
    to: "/payment-methods" as const,
    Icon: CreditCard,
  },
] as const;

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدمات | KRONOS" },
      {
        name: "description",
        content: "راهنماهای خرید و پشتیبانی KRONOS.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <ContentPage
      eyebrow="SERVICES"
      title="راهنماها و خدمات خرید"
      intro="اطلاعات موردنیاز پیش از خرید و مسیرهای اصلی برای پیگیری سفارش را از این بخش در دسترس دارید."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map(({ title, description, to, Icon }) => (
          <Link
            key={to}
            to={to}
            className="group relative overflow-hidden rounded-[1.4rem] border border-white/[0.07] bg-[#0D0F11] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A84C]/28 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-6"
          >
            <div
              className="pointer-events-none absolute -left-12 -top-12 size-40 rounded-full bg-[#C9A84C]/[0.05] blur-3xl"
              aria-hidden="true"
            />

            <div className="relative">
              <span className="inline-flex size-11 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/[0.05] text-[#D6BE78]">
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-5 text-lg font-semibold text-[#F0EDE8] transition-colors group-hover:text-[#DCC27C]">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-7 text-[#8F887F]">
                {description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#CDB46F]">
                مشاهده جزئیات
                <ArrowLeft
                  className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </ContentPage>
  );
}
