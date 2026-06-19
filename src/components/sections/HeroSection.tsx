import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import Typewriter from "typewriter-effect";
import { gsap } from "@/lib/gsap";
import watchLuxury from "@/assets/watch-luxury.png";
import watchSport from "@/assets/watch-sport.png";
import watchSmart from "@/assets/watch-smart.png";

const ParticlesBackground = lazy(() =>
  import("@/components/ui/ParticlesBackground").then((m) => ({ default: m.ParticlesBackground })),
);

const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: "کلکسیون جدید ۱۴۰۴",
    title: "زمان را\nبه یاد بسپار",
    subtitle: "Rolex · Omega · Patek Philippe",
    badge: "کلکسیون اکسکلوسیو رسید",
    image: watchLuxury,
    bg: "from-[#080808] via-[#0f0a00] to-[#080808]",
    accent: "#C9A84C",
    cta: "کشف کلکسیون",
    ctaSecondary: "درباره برندها",
  },
  {
    id: 2,
    eyebrow: "ساعت اسپرت حرفه‌ای",
    title: "ساخته شده\nبرای ماجرا",
    subtitle: "Casio G-Shock · Seiko · Citizen",
    badge: "مقاوم در برابر آب تا ۲۰۰ متر",
    image: watchSport,
    bg: "from-[#080808] via-[#080f00] to-[#080808]",
    accent: "#5A8A3C",
    cta: "ساعت‌های اسپرت",
    ctaSecondary: "مقایسه مدل‌ها",
  },
  {
    id: 3,
    eyebrow: "هوشمند، متصل، زیبا",
    title: "آینده\nمچ شما",
    subtitle: "Apple Watch · Samsung Galaxy · Garmin",
    badge: "سازگار با iOS و Android",
    image: watchSmart,
    bg: "from-[#080808] via-[#00080f] to-[#080808]",
    accent: "#3A7CA8",
    cta: "ساعت هوشمند",
    ctaSecondary: "مقایسه ویژگی‌ها",
  },
];

export function HeroSection() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current.querySelectorAll(".hero-line"),
      { opacity: 0, y: 60, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.18,
        ease: "power4.out",
        delay: 0.3,
      },
    );
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden grain-overlay">
      <ParticlesBackground />
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <div
        className="absolute top-0 left-0 right-0 h-[1px] z-30"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8C96C 50%, #C9A84C 70%, transparent 100%)",
        }}
      />

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative w-full h-full bg-gradient-to-br ${slide.bg} flex items-center`}
            >
              <div
                className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none"
                style={{ background: slide.accent }}
              />

              <div
                className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-20 relative"
                dir="rtl"
              >
                <div ref={headingRef} className="flex flex-col gap-7">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="hero-line flex items-center gap-3"
                  >
                    <div
                      className="h-[1px] w-10"
                      style={{ background: slide.accent }}
                    />
                    <span
                      className="text-xs tracking-[0.3em] uppercase font-medium"
                      style={{ color: slide.accent }}
                    >
                      {slide.eyebrow}
                    </span>
                  </motion.div>

                  <div className="hero-line">
                    <h1
                      className="text-6xl lg:text-8xl font-black leading-none text-[#F0EDE8] whitespace-pre-line"
                      style={{
                        fontFamily:
                          "Playfair Display, Vazirmatn Variable, serif",
                      }}
                    >
                      {slide.title}
                    </h1>
                    <div
                      className="h-[2px] mt-4 rounded-full"
                      style={{
                        width: "120px",
                        background: `linear-gradient(90deg, ${slide.accent}, transparent)`,
                        animation: "line-draw 1.4s ease-out 0.8s both",
                      }}
                    />
                  </div>

                  <div className="hero-line text-[#8A8A8A] text-base tracking-widest h-6">
                    <Typewriter
                      options={{
                        strings: [slide.subtitle],
                        autoStart: true,
                        loop: false,
                        delay: 55,
                        cursor: "_",
                      }}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="hero-line inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border text-xs tracking-wider"
                    style={{
                      borderColor: `${slide.accent}55`,
                      color: slide.accent,
                      background: `${slide.accent}0d`,
                      animation: "gold-pulse 3s ease-in-out infinite",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: slide.accent }}
                    />
                    {slide.badge}
                  </motion.div>

                  <div className="hero-line flex gap-4 flex-wrap mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative overflow-hidden px-10 py-4 font-bold text-[#080808] text-sm tracking-[0.15em] uppercase group"
                      style={{ background: slide.accent }}
                    >
                      <span className="relative z-10">{slide.cta}</span>
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%)",
                          animation: "gold-shimmer 1.6s ease-in-out infinite",
                        }}
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="px-10 py-4 font-medium text-[#8A8A8A] hover:text-[#F0EDE8] text-sm tracking-[0.15em] uppercase border border-[#2A2A2A] hover:border-[#C9A84C] transition-all duration-300"
                    >
                      {slide.ctaSecondary}
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  className="hidden lg:flex items-center justify-center relative"
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 blur-2xl opacity-30 rounded-full"
                    style={{ background: slide.accent }}
                  />
                  <img
                    src={slide.image}
                    alt={slide.subtitle}
                    width={480}
                    height={480}
                    className="relative z-10 w-full max-w-[480px] drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]"
                    style={{
                      filter: `drop-shadow(0 20px 40px ${slide.accent}55)`,
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="relative w-8 h-8">
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="#C9A84C"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <line
              x1="16"
              y1="16"
              x2="16"
              y2="6"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                transformOrigin: "16px 16px",
                animation: "second-hand 10s linear infinite",
              }}
            />
            <line
              x1="16"
              y1="16"
              x2="21"
              y2="16"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                transformOrigin: "16px 16px",
                animation: "second-hand 120s linear infinite",
              }}
            />
          </svg>
        </div>
        <span className="text-[#8A8A8A] text-[10px] tracking-[0.4em] uppercase">
          اسکرول
        </span>
      </motion.div>
    </section>
  );
}
