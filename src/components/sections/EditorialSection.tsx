import { Link } from "@tanstack/react-router";

import editorialImage from "@/assets/watch-7.jpg";

export function EditorialSection() {
  return (
    <section
      className="bg-background-canvas py-16 sm:py-24"
      dir="rtl"
      aria-labelledby="home-editorial-title"
    >
      <div className="container-editorial grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold tracking-[0.22em] text-accent-primary">
            از اینجا شروع کنید
          </p>
          <h2
            id="home-editorial-title"
            className="mt-4 text-3xl font-semibold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
          >
            راهنمای خرید ساعت مچی
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            کاربرد، موتور، اندازه، شیشه، مقاومت آب و شرایط فروش را مرحله‌به‌مرحله بررسی کنید. راهنما
            کمک می‌کند سؤال درست را پیدا کنید؛ مشخصات نهایی هر مدل همچنان در صفحه همان محصول است.
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-accent-primary underline decoration-border-strong underline-offset-8 transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            مشاهده راهنماها ←
          </Link>
        </div>

        <figure className="order-1 lg:order-2">
          <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle bg-background-surface">
            <img
              src={editorialImage}
              alt="نمای ساعت برای مطالعه جزئیات و معیارهای انتخاب"
              width={768}
              height={768}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 text-xs leading-6 text-text-muted">
            تصویر نمونه توسعه؛ معیار انتخاب باید از مشخصات و منبع هر محصول خوانده شود.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
