import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Award, Users, Clock, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "درباره ما — KRONOS" },
      { name: "description", content: "داستان کرونوس، فروشگاه تخصصی ساعت لوکس." },
      { property: "og:title", content: "درباره ما — KRONOS" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const stats = [
    { Icon: Clock, v: "۸+", t: "سال تجربه" },
    { Icon: Users, v: "۱۲ هزار+", t: "مشتری وفادار" },
    { Icon: Award, v: "۵۰+", t: "برند رسمی" },
    { Icon: Heart, v: "۹۹٪", t: "رضایت" },
  ];
  return (
    <>
      <PageHero eyebrow="درباره ما" title="کرونوس، روایت زمان" sub="ما بیش از یک فروشگاه هستیم — مجموعه‌ای از علاقه‌مندان حرفه‌ای ساعت که در پی ارائه بهترین تجربه خرید برای شما هستیم." />
      <section className="py-12 sm:py-16 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {stats.map(({ Icon, v, t }) => (
            <div key={t} className="border border-[#1E1E1E] p-5 text-center bg-[#0c0c0c]">
              <Icon className="w-6 h-6 text-[#C9A84C] mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-[#C9A84C]" style={{ fontFamily: "DM Mono, monospace" }}>{v}</div>
              <div className="text-xs text-[#8A8A8A] mt-1">{t}</div>
            </div>
          ))}
        </div>
        <div className="container mx-auto max-w-3xl space-y-6 text-[#A8A8A8] leading-loose">
          <p>کرونوس از سال ۱۳۹۵ با هدف ساده‌ای آغاز شد: ارائه ساعت‌های اصل با ضمانت کامل اصالت. امروز ما افتخار همکاری با بیش از ۵۰ برند معتبر دنیا را داریم.</p>
          <p>تمام محصولات ما با کارت گارانتی رسمی، جعبه اورجینال و سریال قابل استعلام ارائه می‌شوند. تیم متخصص ما در همه مراحل خرید، از مشاوره تا سرویس، در کنار شماست.</p>
          <Link to="/contact" className="inline-block mt-4 px-6 py-3 bg-[#C9A84C] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase">با ما در ارتباط باشید</Link>
        </div>
      </section>
    </>
  );
}
