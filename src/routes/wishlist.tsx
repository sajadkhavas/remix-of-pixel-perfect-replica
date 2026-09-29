import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart } from "lucide-react";

import { PageHero } from "@/components/layout/PageHero";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATALOG_PRODUCTS } from "@/data/fixtures/products";
import { useStore } from "@/lib/store-context";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "علاقه‌مندی‌ها | KRONOS" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();

  const items = wishlist.flatMap((saved) => {
    const product = CATALOG_PRODUCTS.find(
      (item) => item.identity.id === saved.productId,
    );

    return product ? [product] : [];
  });

  return (
    <>
      <PageHero
        eyebrow="علاقه‌مندی‌ها"
        title={
          items.length
            ? `${items.length.toLocaleString("fa-IR")} ساعت در لیست شما`
            : "لیست علاقه‌مندی خالی است"
        }
      />

      <section className="bg-[#08090B] px-4 py-10 sm:px-6 sm:py-14 lg:px-8" dir="rtl">
        <div className="mx-auto w-full max-w-[1440px]">
          {items.length === 0 ? (
            <div className="mx-auto max-w-md rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] px-6 py-10 text-center sm:px-10 sm:py-12">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/[0.05]">
                <Heart className="size-7 text-[#C9A84C]/70" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[#F0EDE8]">
                ساعت‌های مورد علاقه‌تان را ذخیره کنید
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#8F8A82]">
                از آیکن قلب روی کارت یا صفحه محصول استفاده کنید تا ساعت برای مراجعه بعدی اینجا بماند.
              </p>

              <Link
                to="/shop"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C9A84C] px-7 text-sm font-semibold text-[#08090B] transition-colors hover:bg-[#DFC36E]"
              >
                مشاهده فروشگاه
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <span
                    className="text-[9px] font-medium tracking-[0.25em] text-[#C9A84C]"
                    dir="ltr"
                  >
                    SAVED WATCHES
                  </span>
                  <h2 className="mt-2 text-xl font-semibold text-[#F0EDE8] sm:text-2xl">
                    انتخاب‌های شما
                  </h2>
                </div>

                <Link
                  to="/shop"
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 text-[10px] text-[#C9A84C] transition-colors hover:text-[#DFC36E] sm:text-xs"
                >
                  فروشگاه
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {items.map((product, index) => (
                  <div key={product.identity.id} className="h-full min-w-0">
                    <ProductCard product={product} imagePriority={index < 4} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
