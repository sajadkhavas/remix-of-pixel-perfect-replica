import { Link } from "@tanstack/react-router";

const CATEGORIES = [
  {
    slug: "luxury",
    name: "ساعت لوکس",
    description: "برای بررسی طراحی، پرداخت و جزئیات فنی مدل‌های این دسته.",
    marker: "01",
  },
  {
    slug: "classic",
    name: "ساعت کلاسیک",
    description: "برای مقایسه تناسب، خوانایی و ویژگی‌های مناسب استفاده روزمره یا رسمی.",
    marker: "02",
  },
  {
    slug: "smart",
    name: "ساعت هوشمند",
    description: "برای بررسی قابلیت‌ها و مشخصات هر مدل بدون فرض درباره سازگاری دستگاه‌ها.",
    marker: "03",
  },
] as const;

export function CategoriesSection() {
  return (
    <section
      className="border-b border-border-subtle bg-background-surface py-16 sm:py-24"
      dir="rtl"
      aria-labelledby="home-categories-title"
    >
      <div className="container-commerce">
        <div className="mb-10 max-w-3xl sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.22em] text-accent-primary">کالکشن‌ها</p>
          <h2
            id="home-categories-title"
            className="mt-4 text-3xl font-semibold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
          >
            ساعت‌ها را بر اساس نوع و کاربرد بررسی کنید
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            هر دسته نقطه شروعی برای مقایسه مشخصات است؛ موجودی، قیمت و جزئیات نهایی در داده همان
            محصول نمایش داده می‌شود.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to="/shop/$category"
              params={{ category: category.slug }}
              className="group relative min-h-72 bg-background-canvas p-6 transition-colors hover:bg-background-elevated focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring sm:p-8"
            >
              <span className="font-mono text-xs text-text-muted" aria-hidden="true">
                {category.marker}
              </span>
              <div className="mt-20">
                <h3 className="text-2xl font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                  {category.name}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-text-secondary">
                  {category.description}
                </p>
                <span className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-accent-primary">
                  بررسی دسته ←
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-text-primary underline decoration-border-strong underline-offset-8 transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            مشاهده همه ساعت‌ها
          </Link>
        </div>
      </div>
    </section>
  );
}
