import type { ProductBadge } from "@/domain/product";

const BADGE_LABELS: Readonly<Record<ProductBadge, string>> = {
  new: "جدید",
  "limited-edition": "نسخه محدود",
  exclusive: "اختصاصی",
  sale: "تخفیف",
  preorder: "پیش‌خرید",
};

export function ProductBadges({ badges }: { badges: readonly ProductBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5" aria-label="ویژگی‌های محصول">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-sm border border-border-default bg-background-elevated px-2 py-1 text-[10px] font-semibold text-text-secondary"
        >
          {BADGE_LABELS[badge]}
        </span>
      ))}
    </div>
  );
}
