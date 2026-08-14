import { Link } from "@tanstack/react-router";

import watchHero from "@/assets/watch-1.jpg";

export function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden border-b border-border-subtle bg-background-canvas"
      dir="rtl"
      aria-labelledby="home-hero-title"
    >
      <div className="container-commerce grid min-h-[calc(100svh-5rem)] items-center gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.82fr)] lg:gap-16 lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-accent-primary">
            راهنمای انتخاب و خرید ساعت
          </p>
          <h1
            id="home-hero-title"
            className="max-w-[14ch] text-balance text-4xl font-semibold leading-[1.22] text-text-primary sm:text-5xl lg:text-7xl"
          >
            ساعتی متناسب با سبک، کاربرد و بودجه شما
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
            مدل‌ها را بر اساس نوع موتور، طراحی، ابعاد و ویژگی‌های فنی بررسی کنید و تفاوت‌ها را روشن
            ببینید.
          </p>

          <div className="mt-9">
            <Link
              to="/shop"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent-primary px-6 py-3 text-sm font-semibold text-background-canvas transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-canvas"
            >
              مشاهده ساعت‌ها
            </Link>
          </div>

          <ul
            className="mt-10 grid max-w-xl gap-3 text-sm text-text-muted sm:grid-cols-3"
            aria-label="روش بررسی محصولات"
          >
            <li className="border-s border-border-subtle ps-3">مشخصات روشن</li>
            <li className="border-s border-border-subtle ps-3">مقایسه کاربردی</li>
            <li className="border-s border-border-subtle ps-3">راهنماهای تخصصی</li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border-subtle bg-background-surface">
            <img
              src={watchHero}
              alt="نمای نزدیک یک ساعت برای بررسی جزئیات طراحی"
              width={768}
              height={768}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background-canvas/70 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
          <p className="mt-3 text-xs leading-6 text-text-muted">
            تصویر فعلی نمونه توسعه است؛ اطلاعات نهایی هر مدل از صفحه همان محصول خوانده می‌شود.
          </p>
        </div>
      </div>
    </section>
  );
}
