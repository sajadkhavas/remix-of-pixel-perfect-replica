import { Link } from "@tanstack/react-router";

import { ProductCard, type Watch } from "@/components/ui/ProductCard";

export function FeaturedProducts({ watches }: { watches: readonly Watch[] }) {
  if (watches.length === 0) return null;

  return (
    <section
      className="border-b border-border-subtle bg-background-canvas py-16 sm:py-24"
      dir="rtl"
      aria-labelledby="home-featured-title"
    >
      <div className="container-commerce">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent-primary">
              مدل‌های منتخب برای بررسی
            </p>
            <h2
              id="home-featured-title"
              className="mt-4 text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
            >
              چند مدل برای شروع مقایسه
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">
              این بخش فقط مسیر شروع مرور کاتالوگ است؛ رتبه‌بندی فروش، محبوبیت یا پیشنهاد ویژه بدون
              داده معتبر نمایش داده نمی‌شود.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-text-primary underline decoration-border-strong underline-offset-8 transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            مشاهده همه ساعت‌ها
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {watches.slice(0, 4).map((watch) => (
            <ProductCard key={watch.id} watch={watch} />
          ))}
        </div>
      </div>
    </section>
  );
}
