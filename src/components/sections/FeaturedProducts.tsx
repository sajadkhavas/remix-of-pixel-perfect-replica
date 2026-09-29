import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { ProductCard } from "@/components/ui/ProductCard";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";

export function FeaturedProducts() {
  const products = CATALOG_PRODUCTS.filter((product) => product.status === "active");

  return (
    <section
      id="featured-products"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#0B0C0E] py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      dir="rtl"
      aria-labelledby="featured-products-title"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[78%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.05),transparent_68%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="mb-6 flex items-end justify-between gap-4 px-3 sm:mb-10 sm:px-0 lg:mb-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#C9A84C] sm:w-7" aria-hidden="true" />
              <span
                className="text-[8px] font-semibold tracking-[0.32em] text-[#C9A84C] sm:text-[10px]"
                dir="ltr"
              >
                FEATURED PRODUCTS
              </span>
            </div>

            <h2
              id="featured-products-title"
              className="mt-2.5 text-2xl font-semibold text-[#F0EDE8] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
            >
              محصولات ویژه
            </h2>

            <p className="mt-3 hidden max-w-xl text-sm leading-7 text-[#918B82] sm:block">
              چهار انتخاب شاخص از کالکشن‌های لوکس، اسپرت، کلاسیک و هوشمند.
            </p>
          </div>

          <Link
            to="/shop"
            className="group inline-flex min-h-10 shrink-0 items-center gap-2 text-[9px] font-medium text-[#D4B96F] transition-colors hover:text-[#E5CB83] sm:text-xs"
          >
            <span className="hidden sm:inline">مشاهده همه محصولات</span>
            <span className="sm:hidden">مشاهده همه</span>
            <ArrowLeft
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-4">
          {products.map((product, index) => (
            <div
              key={product.identity.id}
              className="h-full w-[72vw] max-w-[285px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink"
            >
              <ProductCard product={product} imagePriority={index < 4} />
            </div>
          ))}
        </div>

        <p className="mt-2 text-center text-[9px] text-[#69645E] sm:hidden">
          برای دیدن محصولات بیشتر، کارت‌ها را با انگشت حرکت دهید.
        </p>
      </div>
    </section>
  );
}
