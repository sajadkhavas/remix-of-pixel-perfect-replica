import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import VanillaTilt from "vanilla-tilt";
import { useStore } from "@/lib/store-context";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(watch.id);

  const accent = CATEGORY_GOLD[watch.category] ?? "#C9A84C";
  const discount = watch.sale_price ? Math.round((1 - watch.sale_price / watch.price) * 100) : null;
  const displayPrice = (watch.sale_price ?? watch.price).toLocaleString("fa-IR");
  const origPrice = watch.price.toLocaleString("fa-IR");

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof window === "undefined" || window.innerWidth < 1024) return;
    VanillaTilt.init(el, { max: 6, speed: 600, glare: true, "max-glare": 0.06, perspective: 1200 });
    return () => {
      const inst = (el as unknown as { vanillaTilt?: { destroy: () => void } }).vanillaTilt;
      inst?.destroy();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden bg-[#111111] border border-[#1E1E1E] hover:border-[#C9A84C33] transition-colors duration-500"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link
        to="/product/$id"
        params={{ id: String(watch.id) }}
        className="block relative overflow-hidden aspect-[3/4] bg-[#0D0D0D]"
      >
        <motion.img
          src={watch.image}
          alt={watch.name}
          width={360}
          height={360}
          className="w-full h-full object-contain p-6 sm:p-8"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5" dir="rtl">
          {watch.isNew && (
            <span
              className="text-[9px] font-bold px-2 py-1 tracking-wider uppercase"
              style={{ background: accent, color: "#080808" }}
            >
              جدید
            </span>
          )}
          {watch.isLimited && (
            <span
              className="text-[9px] font-bold px-2 py-1 tracking-wider uppercase border"
              style={{ borderColor: accent, color: accent, background: `${accent}0d` }}
            >
              محدود
            </span>
          )}
          {discount && (
            <span className="text-[9px] font-bold px-2 py-1 bg-[#8B0000] text-white">
              -{discount}٪
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${watch.stock === 0 ? "bg-red-600" : watch.stock < 3 ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}
          />
          <span className="text-[10px] text-[#8A8A8A]">
            {watch.stock === 0
              ? "ناموجود"
              : watch.stock < 3
                ? "فقط " + watch.stock + " عدد"
                : "موجود"}
          </span>
        </div>
      </Link>

      <button
        className="absolute top-3 left-3 p-2 border border-[#2A2A2A] bg-[#111]/80 backdrop-blur-sm z-10 hover:border-[#C9A84C] transition-colors"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(watch.id);
        }}
        aria-label="افزودن به علاقه‌مندی"
      >
        <Heart
          className="w-4 h-4"
          style={{ color: wished ? "#C9A84C" : "#8A8A8A", fill: wished ? "#C9A84C" : "none" }}
        />
      </button>

      <div className="p-4 sm:p-5" dir="rtl">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8A8A] block mb-1">
          {watch.brand}
        </span>
        <Link to="/product/$id" params={{ id: String(watch.id) }}>
          <h3 className="font-bold text-[#F0EDE8] mb-2 line-clamp-2 group-hover:text-[#C9A84C] transition-colors text-sm sm:text-[0.95rem]">
            {watch.name}
          </h3>
        </Link>

        <div className="flex gap-1.5 flex-wrap my-2.5">
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
          <div className="flex items-center gap-1.5 mb-3">
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

        <div className="flex items-end justify-between mb-3">
          <div>
            <span
              className="text-lg sm:text-xl font-black block"
              style={{ color: accent, fontFamily: "DM Mono, monospace" }}
            >
              {displayPrice}
            </span>
            <span className="text-[10px] text-[#8A8A8A]">تومان</span>
          </div>
          {watch.sale_price && (
            <span className="text-xs text-[#4A4A4A] line-through">{origPrice}</span>
          )}
        </div>

        <motion.button
          disabled={watch.stock === 0}
          whileTap={watch.stock > 0 ? { scale: 0.97 } : {}}
          onClick={() => watch.stock > 0 && addToCart(watch.id)}
          className="w-full py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:cursor-not-allowed"
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
