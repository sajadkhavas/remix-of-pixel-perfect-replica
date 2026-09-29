import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CircleDot,
  Crown,
  Gem,
  Play,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const heroKronosBg = "/media/hero-kronos-bg.webp";
const watchLuxury = "/media/watch-luxury.png";

const HERO_STATS = [
  { value: "50+", label: "برند معتبر" },
  { value: "1200+", label: "مدل ساعت" },
  { value: "99٪", label: "رضایت کاربران" },
] as const;

const TICKER_ITEMS = [
  { label: "اصالت تضمینی", Icon: ShieldCheck },
  { label: "کالکشن‌های منتخب", Icon: Crown },
  { label: "طراحی ماندگار", Icon: Gem },
  { label: "انتخاب برای هر سبک", Icon: CircleDot },
] as const;

export function HeroSection() {
  return (
    <section
      dir="rtl"
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-[#070809] text-[#F7F2E8]"
    >
      <style>{`
        @keyframes kronos-home-ticker {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      {/* =========================================================
          CINEMATIC HERO BACKGROUND
          Desktop: bright watch atmosphere on the left, clean dark
          negative space on the right for Persian copy.
          Mobile: crop follows the watch area, while a stronger
          vertical overlay keeps the text readable.
         ========================================================= */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={heroKronosBg}
          alt=""
          width={1672}
          height={941}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="
            absolute inset-0 h-full w-full object-cover
            object-[31%_center]
            opacity-[0.88]
            sm:object-[29%_center]
            lg:object-center
            lg:opacity-[0.82]
          "
        />

        {/* Desktop contrast:
            keeps the right side dark so title/body never disappear. */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(7,8,9,0.08)_0%,rgba(7,8,9,0.18)_38%,rgba(7,8,9,0.72)_66%,rgba(7,8,9,0.96)_100%)] lg:block" />

        {/* Desktop vertical shaping */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(7,8,9,0.15)_0%,rgba(7,8,9,0.04)_42%,rgba(7,8,9,0.72)_100%)] lg:block" />

        {/* Mobile:
            top remains rich around the watch, lower section becomes
            progressively darker for headline/buttons/stats. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,9,0.10)_0%,rgba(7,8,9,0.12)_28%,rgba(7,8,9,0.68)_56%,rgba(7,8,9,0.95)_76%,#070809_100%)] lg:hidden" />

        {/* Mobile side vignette keeps the crop elegant */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,9,0.22)_0%,rgba(7,8,9,0.02)_45%,rgba(7,8,9,0.36)_100%)] lg:hidden" />

        {/* Soft brand glow */}
        <div className="absolute -left-[12%] top-[4%] h-[60%] w-[58%] rounded-full bg-[#C9A84C]/[0.07] blur-[90px] lg:h-[72%] lg:w-[60%] lg:blur-[120px]" />

        {/* Top / bottom finishing */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B45D]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070809] to-transparent lg:h-24" />
      </div>

      {/* =========================================================
          HERO BODY
          Desktop RTL:
          foreground watch = left
          copy = right

          Mobile:
          watch first, copy immediately below — same approved layout.
         ========================================================= */}
      <div
        dir="ltr"
        className="
          relative mx-auto grid w-full max-w-[1500px] items-center
          gap-0 px-4 pb-6 pt-3
          sm:px-6 sm:pb-8 sm:pt-5
          lg:min-h-[560px]
          lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]
          lg:gap-7 lg:px-10 lg:pb-7 lg:pt-5
          xl:min-h-[590px] xl:px-14
        "
      >
        {/* Foreground watch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, x: -18 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative order-1 flex min-h-[270px] items-center justify-center
            sm:min-h-[340px]
            lg:min-h-[485px]
          "
        >
          <div className="relative w-full max-w-[680px]">
            {/* Halo behind product */}
            <div
              className="
                absolute left-1/2 top-1/2
                h-[72%] w-[72%]
                -translate-x-1/2 -translate-y-1/2
                rounded-full bg-[#D4AF55]/[0.09]
                blur-[54px]
                sm:blur-[62px]
              "
              aria-hidden="true"
            />

            {/* Fine luxury rings */}
            <div
              className="absolute inset-[12%] rounded-full border border-[#D8B45A]/[0.10]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-[21%] rounded-full border border-white/[0.04]"
              aria-hidden="true"
            />

            <img
              src={watchLuxury}
              alt="ساعت لوکس KRONOS"
              width={1000}
              height={1000}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="
                relative z-10 mx-auto h-auto w-full
                max-w-[560px]
                object-contain
                drop-shadow-[0_42px_68px_rgba(0,0,0,0.78)]
                sm:max-w-[610px]
                lg:max-w-[620px]
              "
            />
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.72,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative z-10 order-2 mx-auto flex w-full max-w-2xl
            flex-col items-center text-center
            lg:mx-0 lg:items-start lg:text-right
          "
        >
          {/* Additional copy veil:
              subtle enough to preserve the image, strong enough to
              protect text contrast on different screens. */}
          <div
            className="
              pointer-events-none absolute
              -inset-x-4 -inset-y-5 -z-10
              rounded-[2rem]
              bg-[radial-gradient(ellipse_at_center,rgba(7,8,9,0.55),rgba(7,8,9,0.20)_58%,transparent_78%)]
              blur-[2px]
              lg:hidden
            "
            aria-hidden="true"
          />

          <div className="flex items-center gap-3">
            <span
              className="h-px w-7 bg-[#D5B45D] sm:w-9"
              aria-hidden="true"
            />

            <span
              className="
                text-[8px] font-semibold tracking-[0.34em]
                text-[#D9BA68]
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]
                sm:text-[10px]
              "
              dir="ltr"
            >
              A TIMELESS LEGACY
            </span>
          </div>

          <h1
            id="home-hero-title"
            className="
              mt-3 max-w-[9ch]
              text-4xl font-semibold leading-[1.22]
              text-[#FFF9EE]
              [text-shadow:0_3px_22px_rgba(0,0,0,0.65)]
              sm:mt-4 sm:text-5xl
              md:text-6xl
              lg:text-[4.35rem]
              xl:text-[4.7rem]
            "
            style={{
              fontFamily:
                "Playfair Display, Vazirmatn Variable, serif",
            }}
          >
            فراتر از زمان
          </h1>

          <p
            className="
              mt-3 max-w-xl
              text-sm leading-7 text-[#E2D9C8]
              [text-shadow:0_2px_14px_rgba(0,0,0,0.72)]
              sm:mt-4 sm:text-base sm:leading-8
              lg:text-[16px]
            "
          >
            در KRONOS هر ساعت انتخابی از هنر، دقت و شخصیت است؛
            برای کسانی که زمان را فقط نمی‌سنجند، بلکه آن را زندگی
            می‌کنند.
          </p>

          {/* CTAs */}
          <div className="mt-5 flex w-full flex-col gap-2.5 sm:mt-6 sm:w-auto sm:flex-row sm:flex-wrap lg:justify-start">
            <Link
              to="/shop"
              className="
                group inline-flex min-h-12 items-center justify-center gap-2
                rounded-lg bg-[#D9B75E] px-6
                text-sm font-semibold text-[#0B0C0E]
                shadow-[0_10px_30px_rgba(201,168,76,0.14)]
                transition-all duration-300
                hover:bg-[#E7CB78]
                hover:shadow-[0_14px_34px_rgba(201,168,76,0.20)]
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#D9B75E]
                focus-visible:ring-offset-2 focus-visible:ring-offset-[#070809]
              "
            >
              مشاهده کالکشن‌ها
              <ArrowLeft
                className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <a
              href="#featured-products"
              className="
                group inline-flex min-h-12 items-center justify-center gap-2
                rounded-lg border border-[#E4D7BB]/[0.18]
                bg-[#070809]/55 px-6
                text-sm font-semibold text-[#F8F2E8]
                shadow-[0_8px_24px_rgba(0,0,0,0.18)]
                backdrop-blur-md
                transition-all duration-300
                hover:border-[#D6B35E]/45
                hover:bg-[#111214]/75
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#C9A84C]
              "
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-[#E4D7BB]/[0.18]">
                <Play
                  className="size-3 fill-current"
                  aria-hidden="true"
                />
              </span>
              محصولات ویژه
            </a>
          </div>

          {/* Stats */}
          <div
            className="
              mt-6 grid w-full grid-cols-3
              border-t border-[#E6D7B5]/[0.10]
              pt-4
              sm:mt-7 sm:pt-5
            "
          >
            {HERO_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={[
                  "min-w-0 px-2 sm:px-4",
                  index !== HERO_STATS.length - 1
                    ? "border-l border-[#E6D7B5]/[0.10]"
                    : "",
                ].join(" ")}
              >
                <strong
                  className="
                    block text-xl font-semibold tracking-[-0.04em]
                    text-[#F8E8BF]
                    [text-shadow:0_2px_12px_rgba(0,0,0,0.65)]
                    sm:text-2xl
                    lg:text-[1.7rem]
                  "
                  dir="ltr"
                  style={{
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {stat.value}
                </strong>

                <span
                  className="
                    mt-1 block truncate
                    text-[8px] text-[#B6AEA1]
                    [text-shadow:0_2px_10px_rgba(0,0,0,0.7)]
                    sm:text-[10px]
                  "
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* =========================================================
          LUXURY TICKER
         ========================================================= */}
      <div
        className="
          relative z-20 overflow-hidden
          border-y border-white/[0.07]
          bg-[#0A0B0D]/95 py-3
          backdrop-blur-xl
          sm:py-3.5
        "
        dir="ltr"
        aria-label="ویژگی‌های KRONOS"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#0A0B0D] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#0A0B0D] to-transparent sm:w-28" />

        <div className="flex w-max animate-[kronos-home-ticker_24s_linear_infinite] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center"
            >
              {TICKER_ITEMS.map(({ label, Icon }) => (
                <div
                  key={`${copy}-${label}`}
                  dir="rtl"
                  className="
                    flex shrink-0 items-center gap-2
                    px-5 text-[10px] text-[#B1A99C]
                    sm:px-8 sm:text-xs
                    lg:px-10
                  "
                >
                  <Icon
                    className="size-3.5 shrink-0 text-[#D0AD55]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <span>{label}</span>

                  <span
                    className="ms-4 size-1 rounded-full bg-[#C9A84C]/35"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
