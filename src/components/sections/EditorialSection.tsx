import ReactParallax from "react-parallax";
import { motion } from "framer-motion";
import editorialImg from "@/assets/watch-7.jpg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Parallax: any = (ReactParallax as any).Parallax ?? (ReactParallax as any);

export function EditorialSection() {
  return (
    <Parallax bgImage={editorialImg} strength={400} bgImageStyle={{ opacity: 0.35 }}>
      <section className="relative min-h-[600px] flex items-center" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/60 to-[#080808]/95" />
        <div className="container mx-auto px-8 relative z-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] block mb-6">
              مجله کرونوس
            </span>
            <h2
              className="text-4xl lg:text-6xl font-black text-[#F0EDE8] leading-tight mb-6"
              style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
            >
              هنر ساعت‌سازی،
              <br />
              میراث قرون
            </h2>
            <p className="text-[#D4C9B0] text-lg leading-loose mb-8">
              از کارگاه‌های ژنو تا مچ شما — داستان هر ساعت، روایت دقتی است که
              نسل‌ها برای رسیدن به آن تلاش کرده‌اند.
            </p>
            <motion.a
              href="#magazine"
              whileHover={{ x: -6 }}
              className="inline-flex items-center gap-3 text-[#C9A84C] text-sm tracking-[0.2em] uppercase border-b border-[#C9A84C44] pb-1"
            >
              خواندن مقاله ←
            </motion.a>
          </motion.div>
        </div>
      </section>
    </Parallax>
  );
}
