import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";

export function CategoriesSection() {
  const categories = CATALOG_CATEGORIES.filter((category) => category.depth === 1);

  return (
    <section
      id="collections"
      className="relative overflow-hidden bg-[#08090B] px-3 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      dir="rtl"
      aria-labelledby="collections-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.016]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="text-[8px] font-semibold tracking-[0.34em] text-[#C9A84C] sm:text-[10px]"
            dir="ltr"
          >
            SHOP BY COLLECTION
          </span>

          <h2
            id="collections-title"
            className="mt-2.5 text-2xl font-semibold text-[#F0EDE8] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
          >
            دسته‌بندی کالکشن‌ها
          </h2>

          <p className="mt-2.5 text-xs leading-6 text-[#918B82] sm:text-base sm:leading-7">
            سبک مورد علاقه خود را انتخاب کنید و سریع‌تر به ساعت مناسب برسید.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-4 gap-1.5 sm:mt-10 sm:gap-4 lg:mt-12 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/shop/$category"
              params={{ category: category.slug }}
              className="group relative block min-w-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0D0F11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] max-sm:aspect-[0.72] sm:aspect-[0.78]"
            >
              {category.heroMedia?.type === "image" ? (
                <img
                  src={category.heroMedia.url}
                  alt={category.heroMedia.alt}
                  width={category.heroMedia.dimensions.width}
                  height={category.heroMedia.dimensions.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.045] motion-reduce:transition-none"
                />
              ) : null}

              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.02)_10%,rgba(8,9,11,0.18)_45%,rgba(8,9,11,0.98)_100%)]"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 z-10 p-2 sm:p-5 lg:p-6">
                <span
                  className="hidden text-[9px] font-medium tracking-[0.24em] text-[#C9A84C] sm:block"
                  dir="ltr"
                >
                  {category.title.values?.en ?? category.slug}
                </span>

                <h3 className="text-center text-[10px] font-semibold text-[#F0EDE8] transition-colors group-hover:text-[#E3C77D] sm:mt-1 sm:text-right sm:text-xl lg:text-2xl">
                  {category.title.default.replace("ساعت ", "")}
                </h3>

                <p className="mt-1 hidden text-xs leading-6 text-[#9A948B] sm:line-clamp-2 sm:block">
                  {category.intro?.default}
                </p>

                <span className="mt-3 hidden items-center gap-2 text-[10px] font-medium text-[#D7BD77] sm:inline-flex">
                  مشاهده کالکشن
                  <ArrowLeft
                    className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
