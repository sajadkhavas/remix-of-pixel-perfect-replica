import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";
import watchLuxury from "@/assets/watch-luxury.png";
import watchSport from "@/assets/watch-sport.png";
import watchSmart from "@/assets/watch-smart.png";
import watchClassic from "@/assets/watch-7.jpg";

const CATEGORIES = [
  {
    slug: "luxury",
    name: "ساعت لوکس",
    count: 84,
    color: "#C9A84C",
    brands: ["Rolex", "Omega", "Patek"],
    desc: "شاهکارهای ساعت‌سازی سوئیسی",
    image: watchLuxury,
  },
  {
    slug: "sport",
    name: "ساعت اسپرت",
    count: 62,
    color: "#5A8A3C",
    brands: ["G-Shock", "Seiko", "Citizen"],
    desc: "مقاوم، دقیق، ماجراجو",
    image: watchSport,
  },
  {
    slug: "smart",
    name: "ساعت هوشمند",
    count: 38,
    color: "#3A7CA8",
    brands: ["Apple", "Samsung", "Garmin"],
    desc: "اتصال و سلامتی روی مچت",
    image: watchSmart,
  },
  {
    slug: "classic",
    name: "ساعت کلاسیک",
    count: 47,
    color: "#8A6A3C",
    brands: ["Tissot", "Longines"],
    desc: "جاودانه و بی‌نقص",
    image: watchClassic,
  },
];

export function CategoriesSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
      },
    );
  }, []);

  return (
    <section className="relative py-20 sm:py-28 bg-[#080808] overflow-hidden" dir="rtl">
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="container mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] sm:text-xs font-bold uppercase text-[#C9A84C] mb-4 sm:mb-6 block tracking-[0.35em]"
          >
            دسته‌بندی محصولات
          </motion.span>
          <h2
            ref={titleRef}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F0EDE8]"
            style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
          >
            هر لحظه، یک انتخاب
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1px] w-12 bg-[#C9A84C]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            <div className="h-[1px] w-12 bg-[#C9A84C]" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to="/shop/$category"
                params={{ category: cat.slug }}
                className="group relative overflow-hidden block aspect-[3/4] bg-[#111111] border border-[#1E1E1E] hover:border-[#C9A84C44] transition-colors"
              >
                <div className="absolute inset-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, #080808 10%, transparent 60%, ${cat.color}22 100%)`,
                  }}
                />
                <div
                  className="absolute top-0 right-0 w-0 h-0 group-hover:w-12 group-hover:h-12 transition-all duration-500"
                  style={{
                    borderTop: `2px solid ${cat.color}`,
                    borderRight: `2px solid ${cat.color}`,
                  }}
                />
                <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#F0EDE8] mb-1 group-hover:text-[#C9A84C] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A8A8A8] mb-3 line-clamp-2">{cat.desc}</p>
                  <div className="hidden sm:flex flex-wrap gap-1 mb-3">
                    {cat.brands.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] px-2 py-0.5 border tracking-wider"
                        style={{
                          borderColor: `${cat.color}44`,
                          color: cat.color,
                          background: `${cat.color}10`,
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-[#8A8A8A]">{cat.count} محصول</span>
                    <motion.span
                      animate={{ x: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ color: cat.color }}
                      className="text-lg"
                    >
                      ←
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
