import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { ProductCard, type Watch } from "@/components/ui/ProductCard";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref}>
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function FeaturedProducts({ watches }: { watches: Watch[] }) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll(".watch-card-wrap");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 80 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 75%" },
      },
    );
  }, [watches]);

  return (
    <section className="py-28 bg-[#0C0C0C]" dir="rtl">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-24 border border-[#1E1E1E]">
          {[
            { value: 1200, label: "مدل ساعت", suffix: "+" },
            { value: 50,   label: "برند معتبر", suffix: "+" },
            { value: 8,    label: "سال تجربه", suffix: "" },
            { value: 99,   label: "درصد رضایت", suffix: "٪" },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center py-10 border-l border-[#1E1E1E] last:border-l-0"
            >
              <div
                className="text-4xl font-black text-[#C9A84C] mb-1"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                <CountUp end={s.value} duration={2.5} suffix={s.suffix} enableScrollSpy scrollSpyOnce />
              </div>
              <p className="text-xs text-[#8A8A8A] tracking-widest uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] block mb-3"
            >
              پیشنهاد ویژه
            </motion.span>
            <h2
              className="text-4xl lg:text-5xl font-black text-[#F0EDE8]"
              style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
            >
              محصولات برگزیده
            </h2>
          </div>
          <a
            href="#products"
            className="text-[#C9A84C] hover:text-[#E8C96C] text-xs tracking-[0.2em] uppercase flex items-center gap-2 border-b border-[#C9A84C44] pb-1 transition-colors"
          >
            مشاهده همه ←
          </a>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
        >
          {watches.map((w) => (
            <div key={w.id} className="watch-card-wrap">
              <ProductCard watch={w} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
