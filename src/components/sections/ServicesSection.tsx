import { BadgeCheck, Gift, Truck, Wrench } from "lucide-react";

const SERVICES = [
  {
    icon: BadgeCheck,
    title: "اصالت تضمینی",
    description: "بررسی اصالت و مشخصات هر ساعت پیش از ارائه.",
  },
  {
    icon: Wrench,
    title: "خدمات تخصصی",
    description: "پشتیبانی تخصصی برای نگهداری بهتر ساعت.",
  },
  {
    icon: Truck,
    title: "ارسال امن و سریع",
    description: "بسته‌بندی ایمن و ارسال قابل پیگیری سفارش.",
  },
  {
    icon: Gift,
    title: "بسته‌بندی لوکس",
    description: "تجربه‌ای شایسته یک ساعت خاص از انتخاب تا تحویل.",
  },
] as const;

export function ServicesSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#0A0B0D] px-3 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-22"
      dir="rtl"
      aria-labelledby="why-kronos-title"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[80%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04),transparent_68%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="text-[8px] font-semibold tracking-[0.34em] text-[#C9A84C] sm:text-[10px]"
            dir="ltr"
          >
            WHY KRONOS
          </span>

          <h2
            id="why-kronos-title"
            className="mt-2.5 text-2xl font-semibold text-[#F0EDE8] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
          >
            چرا KRONOS؟
          </h2>

          <p className="mt-2.5 text-xs leading-6 text-[#918B82] sm:text-base sm:leading-7">
            تجربه خرید ساعت باید به اندازه خود ساعت دقیق، مطمئن و ماندگار باشد.
          </p>
        </div>

        {/* Mobile: all four benefits in one row, exactly as a compact premium strip */}
        <div className="mt-7 grid grid-cols-4 gap-1.5 sm:hidden">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="flex min-h-[112px] min-w-0 flex-col items-center justify-center rounded-xl border border-white/[0.07] bg-[#0E1012] px-1.5 py-3 text-center"
              >
                <div className="flex size-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.045] text-[#C9A84C]">
                  <Icon className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                </div>

                <h3 className="mt-2.5 text-[9px] font-semibold leading-4 text-[#E8E2D8]">
                  {service.title}
                </h3>
              </article>
            );
          })}
        </div>

        {/* Tablet / desktop */}
        <div className="mt-10 hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative min-h-[220px] bg-[#0D0F11] px-6 py-7 text-center transition-colors hover:bg-[#101214] lg:min-h-[245px] lg:px-7 lg:py-8"
              >
                <div className="mx-auto flex size-13 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/[0.04] text-[#C9A84C] transition-all duration-300 group-hover:border-[#C9A84C]/45 group-hover:bg-[#C9A84C]/[0.075]">
                  <Icon className="size-5" strokeWidth={1.4} aria-hidden="true" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-[#F0EDE8] lg:text-lg">
                  {service.title}
                </h3>

                <p className="mx-auto mt-2.5 max-w-[17rem] text-xs leading-6 text-[#8F8A82] lg:text-sm lg:leading-7">
                  {service.description}
                </p>

                <div
                  className="absolute inset-x-[24%] bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/0 to-transparent transition-all duration-300 group-hover:via-[#C9A84C]/55"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
