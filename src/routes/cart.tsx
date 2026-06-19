import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store-context";
import { getById } from "@/lib/catalog";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "سبد خرید — KRONOS" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeFromCart, clearCart } = useStore();
  const items = cart.map((c) => ({ ...c, watch: getById(c.id)! })).filter((x) => x.watch);
  const total = items.reduce((s, i) => s + (i.watch.sale_price ?? i.watch.price) * i.qty, 0);

  if (items.length === 0) {
    return (
      <>
        <PageHero eyebrow="سبد خرید" title="سبد شما خالی است" />
        <div className="container mx-auto py-16 px-5 text-center" dir="rtl">
          <ShoppingBag className="w-16 h-16 text-[#2A2A2A] mx-auto mb-4" />
          <p className="text-[#8A8A8A] mb-6">هنوز ساعتی به سبد اضافه نکرده‌اید.</p>
          <Link to="/shop" className="inline-block px-8 py-3 bg-[#C9A84C] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase">مشاهده فروشگاه</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="سبد خرید" title={`${items.length.toLocaleString("fa-IR")} محصول در سبد شما`} />
      <section className="py-10 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ watch, qty }) => (
              <div key={watch.id} className="border border-[#1E1E1E] bg-[#0c0c0c] p-4 flex gap-4">
                <Link to="/product/$id" params={{ id: String(watch.id) }} className="w-20 sm:w-28 aspect-square bg-[#080808] shrink-0">
                  <img src={watch.image} alt={watch.name} className="w-full h-full object-contain p-2" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-[10px] tracking-wider text-[#8A8A8A] uppercase">{watch.brand}</span>
                  <Link to="/product/$id" params={{ id: String(watch.id) }} className="font-bold text-[#F0EDE8] hover:text-[#C9A84C] truncate text-sm sm:text-base">{watch.name}</Link>
                  <span className="text-[#C9A84C] font-black mt-1 text-sm sm:text-base" style={{ fontFamily: "DM Mono, monospace" }}>
                    {((watch.sale_price ?? watch.price) * qty).toLocaleString("fa-IR")} تومان
                  </span>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center border border-[#1E1E1E]">
                      <button onClick={() => setQty(watch.id, qty - 1)} className="p-1.5 text-[#A8A8A8] hover:text-[#C9A84C]" aria-label="کم"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="px-3 text-sm text-[#F0EDE8]">{qty.toLocaleString("fa-IR")}</span>
                      <button onClick={() => setQty(watch.id, qty + 1)} className="p-1.5 text-[#A8A8A8] hover:text-[#C9A84C]" aria-label="زیاد"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <button onClick={() => removeFromCart(watch.id)} className="text-[#8A8A8A] hover:text-red-500 p-1.5" aria-label="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-xs text-[#8A8A8A] hover:text-red-500 tracking-wider">پاک کردن سبد</button>
          </div>

          <aside className="border border-[#1E1E1E] bg-[#0c0c0c] p-5 h-fit sticky top-24">
            <h3 className="text-lg font-bold text-[#F0EDE8] mb-4">خلاصه سفارش</h3>
            <div className="space-y-2 text-sm pb-4 border-b border-[#1A1A1A]">
              <Row k="جمع کل" v={`${total.toLocaleString("fa-IR")} تومان`} />
              <Row k="ارسال" v="رایگان" highlight />
            </div>
            <div className="flex items-end justify-between py-4">
              <span className="text-[#8A8A8A] text-sm">مبلغ قابل پرداخت</span>
              <span className="text-[#C9A84C] text-xl font-black" style={{ fontFamily: "DM Mono, monospace" }}>{total.toLocaleString("fa-IR")}</span>
            </div>
            <button className="w-full py-3 bg-[#C9A84C] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#E8C96C] transition-colors">
              تکمیل خرید
            </button>
            <Link to="/shop" className="block text-center mt-3 text-xs text-[#8A8A8A] hover:text-[#C9A84C]">ادامه خرید</Link>
          </aside>
        </div>
      </section>
    </>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#8A8A8A]">{k}</span>
      <span className={highlight ? "text-green-500" : "text-[#F0EDE8]"}>{v}</span>
    </div>
  );
}
