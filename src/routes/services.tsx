import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Shield, Wrench, Truck, Award, Clock, BadgeCheck } from "lucide-react";

const SERVICES = [
  { Icon: Shield, name: "اصالت‌سنجی", desc: "بررسی تخصصی و گواهی اصالت برای هر ساعت", time: "همان روز" },
  { Icon: Wrench, name: "سرویس و تعمیر", desc: "تعمیر ساعت‌های مکانیکال، کوارتز و هوشمند", time: "۱–۵ روز" },
  { Icon: Truck, name: "ارسال امن", desc: "بسته‌بندی ضد ضربه با بیمه کامل و ردیابی", time: "۱–۳ روز" },
  { Icon: Award, name: "گارانتی", desc: "گارانتی رسمی همراه با کارت اصلی برند", time: "۲ سال" },
  { Icon: Clock, name: "تنظیم بند", desc: "تنظیم رایگان بند فلزی یا چرمی هنگام خرید", time: "۳۰ دقیقه" },
  { Icon: BadgeCheck, name: "خرید قسطی", desc: "امکان خرید اقساطی برای ساعت‌های لوکس", time: "تا ۱۲ ماه" },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدمات — KRONOS" },
      { name: "description", content: "خدمات تخصصی کرونوس: اصالت‌سنجی، تعمیر، گارانتی، ارسال امن." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="خدمات" title="فراتر از یک فروشگاه" sub="ما تجربه‌ای کامل از مشاوره تا سرویس و پشتیبانی ارائه می‌دهیم." />
      <section className="py-12 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICES.map(({ Icon, name, desc, time }) => (
            <div key={name} className="border border-[#1E1E1E] hover:border-[#C9A84C44] p-6 bg-[#0c0c0c] transition-colors">
              <Icon className="w-8 h-8 text-[#C9A84C] mb-4" />
              <h3 className="text-xl font-bold text-[#F0EDE8] mb-2">{name}</h3>
              <p className="text-sm text-[#A8A8A8] leading-loose mb-4">{desc}</p>
              <div className="text-xs text-[#C9A84C] tracking-wider border-t border-[#1A1A1A] pt-3">⏱ {time}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
