import { Link } from "@tanstack/react-router";

const TRUST_LINKS = [
  {
    to: "/authenticity" as const,
    eyebrow: "اطلاعات محصول",
    title: "اصالت و منبع اطلاعات",
    description:
      "پیش از تصمیم، ببینید چه نوع اطلاعاتی برای بررسی اصالت و مشخصات محصول قابل ارائه است.",
  },
  {
    to: "/warranty" as const,
    eyebrow: "شرایط فروش",
    title: "وضعیت گارانتی",
    description:
      "شرایط گارانتی فقط زمانی معتبر است که برای همان محصول و منبع فروش به‌صورت روشن ثبت شده باشد.",
  },
  {
    to: "/shipping-returns" as const,
    eyebrow: "پیش از سفارش",
    title: "ارسال و بازگشت",
    description:
      "شرایط ارسال و بازگشت را از صفحه سیاست مربوط بخوانید؛ این صفحه جای وعده زمان یا هزینه نیست.",
  },
] as const;

export function ServicesSection() {
  return (
    <section
      className="border-b border-border-subtle bg-background-surface py-16 sm:py-24"
      dir="rtl"
      aria-labelledby="home-trust-title"
    >
      <div className="container-commerce">
        <div className="mb-10 max-w-3xl sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.22em] text-accent-primary">
            پیش از خرید بررسی کنید
          </p>
          <h2
            id="home-trust-title"
            className="mt-4 text-3xl font-semibold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
          >
            هر ادعا باید پشتوانه قابل‌بررسی داشته باشد
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            قیمت و موجودی از داده عملیاتی، مشخصات از منبع محصول و شرایط فروش از سیاست تأییدشده
            می‌آید. نبود اطلاعات با یک وعده عمومی جایگزین نمی‌شود.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {TRUST_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-lg border border-border-subtle bg-background-canvas p-6 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring sm:p-7"
            >
              <p className="text-xs font-semibold text-text-muted">{item.eyebrow}</p>
              <h3 className="mt-4 text-xl font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{item.description}</p>
              <span className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-accent-primary">
                مشاهده جزئیات ←
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
