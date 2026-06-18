import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star, Shield } from "lucide-react";
import VanillaTilt from "vanilla-tilt";

export interface Watch {
  id: number;
  name: string;
  brand: string;
  price: number;
  sale_price?: number;
  image: string;
  category: "luxury" | "sport" | "smart" | "classic";
  caseMaterial?: string;
  waterResistance?: string;
  stock: number;
  rating?: number;
  review_count?: number;
  isNew?: boolean;
  isLimited?: boolean;
}

const CATEGORY_GOLD: Record<string, string> = {
  luxury: "#C9A84C",
  sport: "#5A8A3C",
  smart: "#3A7CA8",
  classic: "#8A6A3C",
};

export function ProductCard({ watch }: { watch: Watch }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const accent = CATEGORY_GOLD[watch.category] ?? "#C9A84C";
  const discount = watch.sale_price
    ? Math.round((1 - watch.sale_price / watch.price) * 100)
    : null;
  const displayPrice = (watch.sale_price ?? watch.price).toLocaleString("fa-IR");
  const origPrice = watch.price.toLocaleString("fa-IR");

  useEffect(() => {
    const el = cardRef.current;
    if (!el || window.innerWidth < 768) return;
    VanillaTilt.init(el, {
      max: 8,
      speed: 600,
      glare: true,
      "max-glare": 0.08,
      perspective: 1200,
    });
    return () => {
      const inst = (el as unknown as { vanillaTilt?: { destroy: () => void } }).vanillaTilt;
      inst?.destroy();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden bg-[#111111] border border-[#1E1E1E] hover:border-[#C9A84C33] transition-colors duration-500 cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-[#0D0D0D]">
        <motion.img
          src={watch.image}
          alt={watch.name}
          className="w-full h-full object-contain p-8"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          loading="lazy"
        />

        <div
          className="absolute top-0 left-0 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            borderTop: `1px solid ${accent}`,
            borderLeft: `1px solid ${accent}`,
          }}
        />

        <div className="absolute top-4 right-4 flex flex-col gap-2" dir="rtl">
          {watch.isNew && (
            <span
              className="text-[10px] font-bold px-2 py-1 tracking-wider uppercase"
              style={{ background: accent, color: "#080808" }}
            >
              جدید
            </span>
          )}
          {watch.isLimited && (
            <span
              className="text-[10px] font-bold px-2 py-1 tracking-wider uppercase border"
              style={{ borderColor: accent, color: accent, background: `${accent}0d` }}
            >
              محدود
            </span>
          )}
          {discount && (
            <span
              className="text-[10px] font-bold px-2 py-1"
              style={{ background: "#8B0000", color: "#fff" }}
            >
              -{discount}٪
            </span>
          )}
        </div>

        <motion.button
          className="absolute top-4 left-4 p-2 border border-[#2A2A2A] bg-[#111]/80 backdrop-blur-sm"
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Wishlist"
        >
          <Heart
            className="w-4 h-4"
            style={{
              color: isWishlisted ? "#C9A84C" : "#4A4A4A",
              fill: isWishlisted ? "#C9A84C" : "none",
            }}
          />
        </motion.button>

        <motion.button
          className="absolute bottom-4 inset-x-0 mx-auto w-fit px-6 py-2 text-xs font-bold tracking-wider uppercase flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: accent, color: "#080808" }}
        >
          <Eye className="w-3 h-3" /> مشاهده سریع
        </motion.button>

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              watch.stock === 0
                ? "bg-red-600"
                : watch.stock < 3
                  ? "bg-amber-500 animate-pulse"
                  : "bg-green-500"
            }`}
          />
          <span className="text-[10px] text-[#8A8A8A]">
            {watch.stock === 0
              ? "ناموجود"
              : watch.stock < 3
                ? "فقط " + watch.stock + " عدد"
                : "موجود"}
          </span>
        </div>
      </div>

      <div className="p-5" dir="rtl">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8A8A] block mb-1">
          {watch.brand}
        </span>

        <h3
          className="font-bold text-[#F0EDE8] mb-1 line-clamp-2 group-hover:text-[#C9A84C] transition-colors duration-300"
          style={{ fontSize: "0.95rem" }}
        >
          {watch.name}
        </h3>

        <div className="flex gap-2 flex-wrap my-3">
          {watch.caseMaterial && (
            <span className="text-[10px] text-[#8A8A8A] border border-[#2A2A2A] px-2 py-0.5">
              {watch.caseMaterial}
            </span>
          )}
          {watch.waterResistance && (
            <span className="text-[10px] text-[#8A8A8A] border border-[#2A2A2A] px-2 py-0.5 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> {watch.waterResistance}
            </span>
          )}
        </div>

        {watch.rating && (
          <div className="flex items-center gap-1.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3"
                style={{
                  fill: i < Math.round(watch.rating!) ? "#C9A84C" : "transparent",
                  color: "#C9A84C",
                }}
              />
            ))}
            {watch.review_count && (
              <span className="text-[10px] text-[#8A8A8A]">
                ({watch.review_count.toLocaleString("fa-IR")})
              </span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between mb-4">
          <div>
            <span
              className="text-xl font-black block"
              style={{ color: accent, fontFamily: "DM Mono, monospace" }}
            >
              {displayPrice}
            </span>
            <span className="text-[10px] text-[#8A8A8A]">تومان</span>
          </div>
          {watch.sale_price && (
            <span className="text-sm text-[#4A4A4A] line-through">{origPrice}</span>
          )}
        </div>

        <motion.button
          disabled={watch.stock === 0}
          whileHover={watch.stock > 0 ? { boxShadow: `0 0 20px ${accent}55` } : {}}
          whileTap={watch.stock > 0 ? { scale: 0.98 } : {}}
          className="w-full py-3 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background: watch.stock === 0 ? "#1E1E1E" : accent,
            color: watch.stock === 0 ? "#4A4A4A" : "#080808",
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          {watch.stock === 0 ? "ناموجود" : "افزودن به سبد"}
        </motion.button>
      </div>
    </div>
  );
}
