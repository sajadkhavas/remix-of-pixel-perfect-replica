import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { PageHero } from "@/components/layout/PageHero";
import { CATALOG_BRANDS } from "@/data/fixtures/brands";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "برندها | KRONOS" },
      {
        name: "description",
        content: "برندهای موجود در کاتالوگ KRONOS را مرور کنید.",
      },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <>
      <PageHero
        eyebrow="برندها"
        title="خانه‌های ساعت‌سازی منتخب"
        sub="برندهای حاضر در کالکشن KRONOS را یک‌جا مرور کنید."
      />

      <section
        className="bg-[#08090B] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
        dir="rtl"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {CATALOG_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              to="/shop"
              search={{ brand: [brand.slug] }}
              resetScroll
              viewTransition
              preload="intent"
              className="group relative min-h-[150px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(145deg,#0D0F11,#090A0C)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A84C]/28 hover:shadow-[0_22px_55px_rgba(0,0,0,0.28)] sm:min-h-[190px] sm:p-5"
            >
              <div
                className="pointer-events-none absolute -left-10 -top-10 size-36 rounded-full bg-[#C9A84C]/[0.05] blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col">
                <span
                  className="text-[8px] font-semibold tracking-[0.26em] text-[#C9A84C]"
                  dir="ltr"
                >
                  {brand.originCountryCode ?? "BRAND"}
                </span>

                <h2
                  className="mt-4 text-base font-semibold leading-7 text-[#F0EDE8] transition-colors group-hover:text-[#E3C77D] sm:text-xl"
                  style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
                >
                  {brand.name}
                </h2>

                <p className="mt-2 line-clamp-3 text-[10px] leading-5 text-[#8E887F] sm:text-xs sm:leading-6">
                  {brand.description.default}
                </p>

                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[9px] font-medium text-[#CDB46F] sm:text-xs">
                  مشاهده محصولات
                  <ArrowLeft
                    className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
