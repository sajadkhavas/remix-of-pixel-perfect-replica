import type { ProductBadge } from "@/domain/product";

const BADGE_LABELS: Readonly<Record<ProductBadge, string>> = {
  new: "جدید",
  "limited-edition": "نسخه محدود",
  exclusive: "اختصاصی",
  sale: "تخفیف",
  preorder: "پیش‌خرید",
};

export function ProductBadges({ badges }: { readonly badges: readonly ProductBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5" aria-label="ویژگی‌های محصول">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-[#C9A84C]/20 bg-[#090A0C]/80 px-2 py-1 text-[9px] font-semibold text-[#D8C17E] backdrop-blur-md"
        >
          {BADGE_LABELS[badge]}
        </span>
      ))}
    </div>
  );
}
