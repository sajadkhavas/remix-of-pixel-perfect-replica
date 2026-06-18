import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const SERVICES = [
  {
    id: 1, icon: "🔒", name: "اصالت تضمینی",
    desc: "تمام ساعت‌های ما دارای گواهی اصالت و سریال معتبر هستند.",
    points: ["کارت گارانتی اصل", "جعبه اورجینال", "سریال قابل استعلام"],
    color: "#C9A84C", time: "همیشه",
  },
  {
    id: 2, icon: "⚙️", name: "سرویس و تعمیر",
    desc: "تعمیر تخصصی ساعت‌های مکانیکال، کوارتز و هوشمند توسط متخصص.",
    points: ["تعمیر ساعت مکانیکال", "تنظیم بند", "تعویض باتری"],
    color: "#8A6A3C", time: "۱–۵ روز",
  },
  {
    id: 3, icon: "🚚", name: "ارسال امن",
    desc: "بسته‌بندی ضد ضربه با بیمه کامل و ردیابی آنلاین سفارش.",
    points: ["بسته‌بندی لوکس", "بیمه کامل محموله", "ردیابی آنلاین"],
    color: "#3A7CA8", time: "۱–۳ روز",
  },
];

function ServiceCard({ s, i }: { s: (typeof SERVICES)[0]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-80, 80], [5, -5]);
  const rotY = useTransform(mx, [-80, 80], [-5, 5]);

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={(e) => {
        const r = cardRef.current!.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width / 2);
        my.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0, transition: { delay: i * 0.14, duration: 0.8 } }}
      viewport={{ once: true }}
      className="group relative p-8 border border-[#1E1E1E] hover:border-[#C9A84C33] bg-[#111111] cursor-default transition-colors duration-500"
    >
      <div
        className="absolute top-0 right-0 h-[1px] w-0 group-hover:w-full transition-all duration-700"
        style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
      />

      <div style={{ transform: "translateZ(20px)" }}>
        <div
          className="text-5xl mb-6"
          style={{ filter: `drop-shadow(0 4px 12px ${s.color}55)` }}
        >
          {s.icon}
        </div>

        <h3
          className="text-2xl font-black text-[#F0EDE8] mb-3"
          style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
        >
          {s.name}
        </h3>

        <p className="text-[#8A8A8A] mb-6 leading-relaxed text-sm">{s.desc}</p>

        <ul className="space-y-2 mb-8">
          {s.points.map((p, j) => (
            <li key={j} className="flex items-center gap-2 text-sm text-[#D4C9B0]">
              <span style={{ color: s.color, fontFamily: "DM Mono, monospace" }}>
                —
              </span>{" "}
              {p}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-[#1E1E1E] pt-5">
          <span className="text-xs text-[#8A8A8A] tracking-wider">{s.time}</span>
          <motion.a
            href="#services"
            whileHover={{ x: -4 }}
            className="text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-2 transition-colors"
            style={{ color: s.color }}
          >
            بیشتر بدانید ←
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section className="py-28 bg-[#080808]" dir="rtl">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] block mb-5"
          >
            چرا ما
          </motion.span>
          <h2
            className="text-4xl lg:text-5xl font-black text-[#F0EDE8]"
            style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
          >
            تجربه‌ای فراتر از خرید
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
