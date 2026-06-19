import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATALOG, CATEGORIES } from "@/lib/catalog";
import { PageHero } from "@/components/layout/PageHero";
import { Search } from "lucide-react";

type Sort = "new" | "price-asc" | "price-desc" | "popular";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "فروشگاه ساعت — KRONOS" },
      { name: "description", content: "همه ساعت‌های موجود در کرونوس با فیلتر دسته، برند و مرتب‌سازی هوشمند." },
      { property: "og:title", content: "فروشگاه — KRONOS" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("new");

  const list = useMemo(() => {
    let arr = CATALOG;
    if (cat !== "all") arr = arr.filter((w) => w.category === cat);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter((w) => w.name.toLowerCase().includes(s) || w.brand.toLowerCase().includes(s));
    }
    const sorted = [...arr];
    if (sort === "price-asc") sorted.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    if (sort === "price-desc") sorted.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    if (sort === "popular") sorted.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
    return sorted;
  }, [q, cat, sort]);

  return (
    <>
      <PageHero eyebrow="فروشگاه" title="کاوش کلکسیون" sub="جستجو در میان برترین ساعت‌های لوکس، اسپرت، هوشمند و کلاسیک." />
      <section className="py-8 sm:py-12 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجوی ساعت یا برند..."
                className="w-full bg-[#0c0c0c] border border-[#1E1E1E] focus:border-[#C9A84C55] outline-none pr-10 pl-4 py-3 text-sm text-[#F0EDE8]"
              />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-[#0c0c0c] border border-[#1E1E1E] px-4 py-3 text-sm text-[#F0EDE8] focus:border-[#C9A84C55] outline-none">
              <option value="new">جدیدترین</option>
              <option value="popular">پرفروش‌ترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {[{ slug: "all", name: "همه" }, ...CATEGORIES].map((c) => (
              <button
                key={c.slug}
                onClick={() => setCat(c.slug)}
                className={`shrink-0 px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
                  cat === c.slug ? "bg-[#C9A84C] text-[#080808] border-[#C9A84C]" : "border-[#1E1E1E] text-[#A8A8A8] hover:border-[#C9A84C44]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="text-center py-20 border border-[#1E1E1E]">
              <p className="text-[#8A8A8A]">محصولی یافت نشد.</p>
              <Link to="/shop" onClick={() => { setQ(""); setCat("all"); }} className="inline-block mt-4 text-[#C9A84C] text-sm border-b border-[#C9A84C44]">پاک کردن فیلترها</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {list.map((w) => <ProductCard key={w.id} watch={w} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
