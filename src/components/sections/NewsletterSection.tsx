import {
  ChevronLeft,
  Crown,
  Mail,
  ShieldCheck,
} from "lucide-react";

import newsletterOmega from "@/assets/kronos-newsletter-omega-speedmaster.webp";

export function NewsletterSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-[#C9A84C]/20 bg-[#090A0C] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
      dir="rtl"
      aria-labelledby="newsletter-title"
    >
      {/* ambient light only — image itself has no frame */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_48%,rgba(201,168,76,0.09),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B45D]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D7B45D]/18 to-transparent" />
      </div>

      <div
        dir="ltr"
        className="relative mx-auto grid w-full max-w-[1440px] items-center gap-6 lg:grid-cols-[1.08fr_0.88fr_1.04fr] lg:gap-8 xl:gap-10"
      >
        {/* =====================================================
            LEFT — three separate bordered blocks
           ===================================================== */}
        <form
          action="/contact"
          method="get"
          className="order-3 grid gap-3 lg:order-1"
          aria-label="درخواست عضویت در خبرنامه"
          dir="rtl"
        >
          <input type="hidden" name="source" value="newsletter" />

          {/* email block */}
          <label className="group flex min-h-[78px] items-center gap-4 rounded-2xl border border-[#C9A84C]/25 bg-[#0C0E10]/85 px-4 transition-colors hover:border-[#C9A84C]/45 sm:px-5">
            <Mail
              className="size-5 shrink-0 text-[#D2AF55]"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[#EAE3D7]">
                آدرس ایمیل
              </span>

              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="ایمیل خود را وارد کنید..."
                className="mt-1 w-full bg-transparent text-xs text-[#D1C9BC] outline-none placeholder:text-[#6F6961] sm:text-sm"
              />
            </span>

            <ChevronLeft
              className="size-4 shrink-0 text-[#C9A84C]"
              aria-hidden="true"
            />
          </label>

          {/* subscribe block */}
          <button
            type="submit"
            className="group flex min-h-[78px] items-center gap-4 rounded-2xl border border-[#E2C06B]/40 bg-[linear-gradient(135deg,#D6B35E,#E5C678)] px-4 text-right text-[#0B0C0E] shadow-[0_14px_36px_rgba(201,168,76,0.12)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(201,168,76,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2C06B] sm:px-5"
          >
            <Crown
              className="size-5 shrink-0"
              strokeWidth={1.6}
              aria-hidden="true"
            />

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold sm:text-base">
                عضویت در خبرنامه
              </span>
              <span className="mt-1 block text-[10px] opacity-70 sm:text-xs">
                به جمع علاقه‌مندان KRONOS بپیوندید.
              </span>
            </span>

            <ChevronLeft
              className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </button>

          {/* privacy block */}
          <div className="flex min-h-[72px] items-center gap-4 rounded-2xl border border-[#C9A84C]/25 bg-[#0C0E10]/85 px-4 sm:px-5">
            <ShieldCheck
              className="size-5 shrink-0 text-[#D2AF55]"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#E4DDD2]">
                بدون اسپم
              </p>
              <p className="mt-1 text-[10px] leading-5 text-[#8D867D] sm:text-xs">
                فقط خبرهای مهم، کالکشن‌ها و پیشنهادهای منتخب KRONOS.
              </p>
            </div>
          </div>
        </form>

        {/* =====================================================
            CENTER — one single fine bordered panel
           ===================================================== */}
        <div
          className="order-2 rounded-[1.6rem] border border-[#C9A84C]/30 bg-[#0B0D0F]/80 px-5 py-8 text-center backdrop-blur-sm sm:px-7 sm:py-10 lg:px-6 lg:py-12"
          dir="rtl"
        >
          <div className="flex items-center justify-center gap-3">
            <span
              className="h-px w-8 bg-[#C9A84C]/80"
              aria-hidden="true"
            />
            <span
              className="text-[9px] font-semibold tracking-[0.34em] text-[#D5B45F]"
              dir="ltr"
            >
              STAY UPDATED
            </span>
            <span
              className="h-px w-8 bg-[#C9A84C]/80"
              aria-hidden="true"
            />
          </div>

          <h2
            id="newsletter-title"
            className="mt-5 text-3xl font-semibold leading-tight text-[#F6F0E6] sm:text-4xl lg:text-[2.65rem]"
            style={{
              fontFamily:
                "Playfair Display, Vazirmatn Variable, serif",
            }}
          >
            در جریان باشید
          </h2>

          <div
            className="mx-auto mt-4 h-px w-8 bg-[#C9A84C]/80"
            aria-hidden="true"
          />

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#B8B0A5] sm:text-base">
            از تازه‌ترین کالکشن‌ها و پیشنهادهای اختصاصی KRONOS
            باخبر شوید.
          </p>
        </div>

        {/* =====================================================
            RIGHT — no border around the image
           ===================================================== */}
        <div className="order-1 relative min-h-[255px] overflow-hidden sm:min-h-[320px] lg:order-3 lg:min-h-[390px]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(201,168,76,0.14),transparent_48%)]"
            aria-hidden="true"
          />

          <img
            src={newsletterOmega}
            alt="ساعت Omega Speedmaster در بخش خبرنامه KRONOS"
            width={1122}
            height={1402}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[50%_44%] sm:object-[50%_42%] lg:object-[50%_45%]"
          />

          {/* dissolve image into section instead of drawing a box */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#090A0C_0%,rgba(9,10,12,0.12)_28%,transparent_58%)] lg:bg-[linear-gradient(90deg,#090A0C_0%,rgba(9,10,12,0.20)_24%,transparent_56%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#090A0C] to-transparent lg:h-24"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
