import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import editorialImg from "@/assets/watch-7.jpg";

const POSTS = [
  {
    id: 1,
    title: "تاریخچه ساعت‌سازی سوئیسی",
    excerpt: "از قرن ۱۶ ژنو تا کارگاه‌های مدرن، روایتی از دقت و هنر.",
    date: "۱۴۰۴/۰۱/۱۵",
  },
  {
    id: 2,
    title: "تفاوت ساعت مکانیکال و کوارتز",
    excerpt: "راهنمای کامل انتخاب بین دو نسل از ساعت‌سازی.",
    date: "۱۴۰۴/۰۲/۰۳",
  },
  {
    id: 3,
    title: "ساعت هوشمند یا کلاسیک؟",
    excerpt: "چه ساعتی برای سبک زندگی شما مناسب‌تر است؟",
    date: "۱۴۰۴/۰۲/۲۲",
  },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "مجله کرونوس — KRONOS" },
      { name: "description", content: "مقالات تخصصی درباره ساعت، برندها و تاریخچه ساعت‌سازی." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="مجله"
        title="روایت‌های زمان"
        sub="مقالات تخصصی، نقد و بررسی و راهنمای خرید."
      />
      <section className="py-12 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {POSTS.map((p) => (
            <article
              key={p.id}
              className="border border-[#1E1E1E] hover:border-[#C9A84C44] bg-[#0c0c0c] group cursor-pointer transition-colors"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#080808]">
                <img
                  src={editorialImg}
                  alt={p.title}
                  width={768}
                  height={768}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] text-[#C9A84C] tracking-wider">{p.date}</span>
                <h3 className="text-lg font-bold text-[#F0EDE8] my-2 group-hover:text-[#C9A84C] transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-[#A8A8A8] leading-loose">{p.excerpt}</p>
                <span className="inline-block mt-4 text-xs text-[#C9A84C] tracking-wider border-b border-[#C9A84C44] pb-0.5">
                  ادامه مطلب ←
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
