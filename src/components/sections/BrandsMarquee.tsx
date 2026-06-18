import { motion } from "framer-motion";

const BRANDS = [
  { name: "ROLEX", color: "#C9A84C" },
  { name: "OMEGA", color: "#8A8A8A" },
  { name: "PATEK PHILIPPE", color: "#C9A84C" },
  { name: "TAG HEUER", color: "#8A8A8A" },
  { name: "G-SHOCK", color: "#5A8A3C" },
  { name: "APPLE WATCH", color: "#3A7CA8" },
  { name: "GARMIN", color: "#3A7CA8" },
  { name: "SEIKO", color: "#8A8A8A" },
  { name: "TISSOT", color: "#8A6A3C" },
  { name: "LONGINES", color: "#C9A84C" },
];

function BrandItem({ brand }: { brand: (typeof BRANDS)[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center justify-center px-12 py-4 shrink-0"
      style={{
        color: brand.color,
        fontFamily: "Playfair Display, serif",
        letterSpacing: "0.3em",
        fontWeight: 700,
        fontSize: "1.05rem",
        opacity: 0.6,
      }}
    >
      {brand.name}
    </motion.div>
  );
}

export function BrandsMarquee() {
  return (
    <section className="py-6 bg-[#080808] overflow-hidden border-y border-[#1E1E1E]">
      <div className="relative">
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #080808, transparent)",
          }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #080808, transparent)",
          }}
        />

        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
            <BrandItem key={i} brand={brand} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
