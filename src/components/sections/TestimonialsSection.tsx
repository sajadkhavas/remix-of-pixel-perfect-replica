import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "علی رضایی",
    city: "تهران",
    initials: "ع ر",
    quote:
      "کیفیت ارائه و تجربه خرید دقیق و حرفه‌ای بود. انتخاب محصول، توضیحات و روند سفارش حس یک فروشگاه تخصصی را منتقل می‌کرد.",
  },
  {
    name: "مریم احمدی",
    city: "شیراز",
    initials: "م ا",
    quote:
      "چیزی که بیشتر از همه دوست داشتم، طراحی ساده و لوکس سایت بود. پیدا کردن مدل مناسب سریع و بدون سردرگمی انجام شد.",
  },
  {
    name: "حسین محمدی",
    city: "اصفهان",
    initials: "ح م",
    quote:
      "تنوع مدل‌ها و نحوه نمایش جزئیات باعث شد مقایسه ساعت‌ها راحت باشد. تجربه‌ای مرتب، شفاف و قابل اعتماد.",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#0A0B0D] py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      dir="rtl"
      aria-labelledby="testimonials-title"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[74%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04),transparent_68%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-0">
          <span
            className="text-[9px] font-semibold tracking-[0.34em] text-[#C9A84C] sm:text-[10px]"
            dir="ltr"
          >
            TESTIMONIALS
          </span>

          <h2
            id="testimonials-title"
            className="mt-3 text-3xl font-semibold text-[#F0EDE8] sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "Playfair Display, Vazirmatn Variable, serif",
            }}
          >
            نظر مشتریان ما
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#918B82] sm:text-base">
            تجربه خوب خرید، بخشی از ارزش یک ساعت ماندگار است.
          </p>
        </div>

        {/* Mobile: one horizontal swipe row.
            Desktop/tablet: regular three-column grid. */}
        <div className="mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-10 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 lg:mt-12 lg:gap-4">
          {TESTIMONIALS.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.48,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex min-h-[285px] w-[82vw] max-w-[330px] shrink-0 snap-start flex-col rounded-2xl border border-white/[0.07] bg-[#0E1012] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A84C]/20 sm:min-h-[280px] sm:w-auto sm:max-w-none sm:shrink sm:p-6 lg:min-h-[310px]"
            >
              <div className="flex items-start justify-between gap-4">
                <Quote
                  className="size-8 text-[#C9A84C]/25"
                  strokeWidth={1.3}
                  aria-hidden="true"
                />

                <div className="flex gap-0.5" aria-label="امتیاز ۵ از ۵">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="size-3.5 fill-[#C9A84C] text-[#C9A84C]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <blockquote className="mt-5 text-sm leading-8 text-[#C4BCAF] sm:text-[15px]">
                «{item.quote}»
              </blockquote>

              <div className="mt-auto flex items-center gap-3 border-t border-white/[0.06] pt-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.055] text-[10px] font-semibold text-[#D8BF7B]">
                  {item.initials}
                </div>

                <div className="min-w-0">
                  <strong className="block truncate text-sm font-semibold text-[#F0EDE8]">
                    {item.name}
                  </strong>
                  <span className="mt-0.5 block text-[10px] text-[#746F68]">
                    {item.city}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-2 text-center text-[9px] text-[#68625C] sm:hidden">
          برای دیدن نظرهای بیشتر، کارت‌ها را با انگشت حرکت دهید.
        </p>
      </div>
    </section>
  );
}
