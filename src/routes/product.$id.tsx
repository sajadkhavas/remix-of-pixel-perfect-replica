import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getById, CATALOG } from "@/lib/catalog";
import { useStore } from "@/lib/store-context";
import { ProductCard } from "@/components/ui/ProductCard";
import { Heart, ShoppingCart, Minus, Plus, Shield, Truck, RotateCcw, Award, Star } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const w = getById(Number(params.id));
    if (!w) throw notFound();
    return { watch: w };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.watch.name} — KRONOS` },
      { name: "description", content: `${loaderData.watch.brand} · ${loaderData.watch.name}` },
      { property: "og:image", content: loaderData.watch.image },
    ] : [{ title: "محصول — KRONOS" }],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto py-32 text-center" dir="rtl">
      <h2 className="text-2xl text-[#F0EDE8] mb-4">محصول پیدا نشد</h2>
      <Link to="/shop" className="text-[#C9A84C] border-b border-[#C9A84C44]">بازگشت به فروشگاه</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { watch: w } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const wished = isWishlisted(w.id);
  const price = (w.sale_price ?? w.price).toLocaleString("fa-IR");
  const orig = w.price.toLocaleString("fa-IR");
  const related = CATALOG.filter((x) => x.category === w.category && x.id !== w.id).slice(0, 4);

  return (
    <section className="py-8 sm:py-12 px-5 sm:px-8" dir="rtl">
      <div className="container mx-auto">
        <nav className="text-xs text-[#8A8A8A] mb-6 flex gap-1.5">
          <Link to="/" className="hover:text-[#C9A84C]">خانه</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C9A84C]">فروشگاه</Link>
          <span>/</span>
          <Link to="/shop/$category" params={{ category: w.category }} className="hover:text-[#C9A84C]">{w.category}</Link>
          <span>/</span>
          <span className="text-[#A8A8A8] truncate">{w.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-[#0c0c0c] border border-[#1E1E1E] aspect-square flex items-center justify-center p-8 sm:p-16">
            <img src={w.image} alt={w.name} className="max-w-full max-h-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]" />
          </div>

          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">{w.brand}</span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#F0EDE8] mt-2 mb-4" style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}>
              {w.name}
            </h1>

            {w.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ fill: i < Math.round(w.rating!) ? "#C9A84C" : "transparent", color: "#C9A84C" }} />
                  ))}
                </div>
                {w.review_count && <span className="text-xs text-[#8A8A8A]">({w.review_count.toLocaleString("fa-IR")} نظر)</span>}
              </div>
            )}

            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-[#1A1A1A]">
              <span className="text-3xl sm:text-4xl font-black text-[#C9A84C]" style={{ fontFamily: "DM Mono, monospace" }}>{price}</span>
              <span className="text-sm text-[#8A8A8A] mb-1">تومان</span>
              {w.sale_price && <span className="text-base text-[#4A4A4A] line-through mb-1 mr-auto">{orig}</span>}
            </div>

            <p className="text-[#A8A8A8] leading-loose mb-6 text-sm sm:text-base">
              {w.brand} با مدل {w.name}، نمونه‌ای از طراحی دقیق و مهندسی ساعت‌سازی. مناسب برای علاقه‌مندان به ساعت‌های با کیفیت و طراحی منحصربه‌فرد.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {w.caseMaterial && <Spec k="جنس قاب" v={w.caseMaterial} />}
              {w.waterResistance && <Spec k="ضد آب" v={w.waterResistance} />}
              <Spec k="دسته" v={w.category} />
              <Spec k="وضعیت" v={w.stock === 0 ? "ناموجود" : w.stock < 3 ? `فقط ${w.stock} عدد` : "موجود"} />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-[#1E1E1E]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-[#A8A8A8] hover:text-[#C9A84C]" aria-label="کم">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-[#F0EDE8] min-w-[2.5rem] text-center">{qty.toLocaleString("fa-IR")}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 text-[#A8A8A8] hover:text-[#C9A84C]" aria-label="زیاد">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                disabled={w.stock === 0}
                onClick={() => { for (let i = 0; i < qty; i++) addToCart(w.id); }}
                className="flex-1 py-3 sm:py-4 bg-[#C9A84C] text-[#080808] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#E8C96C] transition-colors disabled:bg-[#1E1E1E] disabled:text-[#4A4A4A] disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {w.stock === 0 ? "ناموجود" : "افزودن به سبد"}
              </button>
              <button onClick={() => toggleWishlist(w.id)} className="p-3 sm:p-4 border border-[#2A2A2A] hover:border-[#C9A84C] transition-colors" aria-label="علاقه‌مندی">
                <Heart className="w-5 h-5" style={{ color: wished ? "#C9A84C" : "#A8A8A8", fill: wished ? "#C9A84C" : "none" }} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-6 border-t border-[#1A1A1A] text-xs">
              {[
                { I: Shield, t: "اصالت تضمینی" },
                { I: Truck, t: "ارسال امن" },
                { I: RotateCcw, t: "بازگشت ۷ روزه" },
                { I: Award, t: "گارانتی" },
              ].map(({ I, t }) => (
                <div key={t} className="flex items-center gap-2 text-[#A8A8A8]">
                  <I className="w-4 h-4 text-[#C9A84C] shrink-0" /><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <h2 className="text-2xl sm:text-3xl font-black text-[#F0EDE8] mb-6" style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}>
              محصولات مشابه
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((r) => <ProductCard key={r.id} watch={r} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-[#1E1E1E] px-3 py-2">
      <div className="text-[10px] text-[#8A8A8A] uppercase tracking-wider mb-0.5">{k}</div>
      <div className="text-[#F0EDE8]">{v}</div>
    </div>
  );
}
