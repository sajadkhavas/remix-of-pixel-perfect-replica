import { createFileRoute, Link } from "@tanstack/react-router";
import { BRANDS } from "@/lib/catalog";
import { PageHero } from "@/components/layout/PageHero";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "برندها — KRONOS" },
      { name: "description", content: "برترین برندهای ساعت دنیا در کرونوس." },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <>
      <PageHero
        eyebrow="برندها"
        title="معتبرترین خانه‌های ساعت‌سازی"
        sub="از ژنو تا توکیو، انتخاب شما از میان برترین برندهای دنیا."
      />
      <section className="py-10 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {BRANDS.map((b) => (
            <Link
              key={b.slug}
              to="/shop"
              className="group relative aspect-[4/3] border border-[#1E1E1E] hover:border-[#C9A84C44] bg-gradient-to-br from-[#0c0c0c] to-[#080808] flex flex-col items-center justify-center p-5 transition-all hover:-translate-y-1"
            >
              <span
                className="text-xl sm:text-2xl font-black text-[#F0EDE8] group-hover:text-[#C9A84C] transition-colors tracking-[0.1em]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {b.name}
              </span>
              <span className="text-[10px] sm:text-xs text-[#8A8A8A] mt-2 tracking-wider">
                {b.tagline}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
