import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";

const CATEGORIES = [
  {
    id: 1, name: "ساعت لوکس", slug: "luxury", count: 84,
    icon: "⌚", color: "#C9A84C",
    brands: ["Rolex", "Omega", "Patek"],
    desc: "شاهکارهای ساعت‌سازی سوئیسی",
  },
  {
    id: 2, name: "ساعت اسپرت", slug: "sport", count: 62,
    icon: "🏆", color: "#5A8A3C",
    brands: ["G-Shock", "Seiko", "Citizen"],
    desc: "مقاوم، دقیق، ماجراجو",
  },
  {
    id: 3, name: "ساعت هوشمند", slug: "smart", count: 38,
    icon: "🤖", color: "#3A7CA8",
    brands: ["Apple", "Samsung", "Garmin"],
    desc: "اتصال و سلامتی روی مچت",
  },
  {
    id: 4, name: "ساعت کلاسیک", slug: "classic", count: 47,
    icon: "🕰️", color: "#8A6A3C",
    brands: ["Tissot", "Longines", "Hamilton"],
    desc: "جاودانه و بی‌نقص",
  },
  {
    id: 5, name: "بند و لوازم جانبی", slug: "accessories", count: 120,
    icon: "🔗", color: "#6A4E8A",
    brands: ["بند چرم", "استیل", "سیلیکون"],
    desc: "شخصی‌سازی ساعت شما",
  },
  {
    id: 6, name: "ساعت زنانه", slug: "women", count: 55,
    icon: "💎", color: "#A84C6C",
    brands: ["Cartier", "Chopard", "Piaget"],
    desc: "ظرافت در هر لحظه",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function CategoriesSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.9,
        scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
      },
    );
  }, []);

  return (
    <section className="relative py-28 bg-[#080808] overflow-hidden" dir="rtl">
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1 }}
            className="text-xs font-bold uppercase text-[#C9A84C] mb-6 block"
          >
            دسته‌بندی محصولات
          </motion.span>
          <h2
            ref={titleRef}
            className="text-5xl lg:text-6xl font-black text-[#F0EDE8]"
            style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
          >
            هر لحظه، یک انتخاب
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[1px] w-16 bg-[#C9A84C]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            <div className="h-[1px] w-16 bg-[#C9A84C]" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={`#${cat.slug}`}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden cursor-pointer aspect-[3/4] flex flex-col justify-end"
              style={{ background: "#111111", border: "1px solid #1E1E1E" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, #080808 0%, ${cat.color}10 100%)`,
                }}
              />
              <div
                className="absolute top-0 right-0 w-0 h-0 group-hover:w-12 group-hover:h-12 transition-all duration-500"
                style={{
                  borderTop: `2px solid ${cat.color}`,
                  borderRight: `2px solid ${cat.color}`,
                }}
              />

              <div className="relative z-10 p-6">
                <div
                  className="text-5xl mb-4"
                  style={{
                    filter: `drop-shadow(0 0 12px ${cat.color}55)`,
                    animation: "float-watch 5s ease-in-out infinite",
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {cat.icon}
                </div>

                <h3
                  className="text-xl font-bold text-[#F0EDE8] mb-1 group-hover:text-[#C9A84C] transition-colors duration-300"
                >
                  {cat.name}
                </h3>

                <p className="text-sm text-[#8A8A8A] mb-4">{cat.desc}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {cat.brands.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] px-2 py-0.5 border"
                      style={{
                        borderColor: `${cat.color}33`,
                        color: cat.color,
                        background: `${cat.color}0a`,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8A8A8A]">
                    {cat.count} محصول
                  </span>
                  <motion.span
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ color: cat.color }}
                    className="text-lg"
                  >
                    ←
                  </motion.span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
