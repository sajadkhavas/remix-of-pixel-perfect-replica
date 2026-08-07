import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store-context";
import { getById } from "@/lib/catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { Heart } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "علاقه‌مندی‌ها — KRONOS" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map((id) => getById(id)).filter(Boolean) as ReturnType<typeof getById>[];

  return (
    <>
      <PageHero
        eyebrow="علاقه‌مندی"
        title={
          items.length
            ? `${items.length.toLocaleString("fa-IR")} ساعت در لیست شما`
            : "لیست علاقه‌مندی خالی است"
        }
      />
      <section className="py-10 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-[#2A2A2A] mx-auto mb-4" />
              <p className="text-[#8A8A8A] mb-6">
                روی آیکن قلب در کارت محصول کلیک کنید تا اینجا ذخیره شود.
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-[#C9A84C] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase"
              >
                مشاهده فروشگاه
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((w) => w && <ProductCard key={w.id} watch={w} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
