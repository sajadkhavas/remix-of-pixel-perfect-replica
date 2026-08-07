import { Link } from "@tanstack/react-router";
import { Heart, Home, ShoppingBag, ShoppingCart, User } from "lucide-react";

import { useStore } from "@/lib/store-context";
import { usePublicStoreSettings } from "./store-settings-context";

export function MobileTabBar() {
  const settings = usePublicStoreSettings();
  const { cart, wishlist } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const tabs = [
    { to: "/" as const, label: "خانه", Icon: Home, count: 0, visible: true },
    { to: "/shop" as const, label: "فروشگاه", Icon: ShoppingBag, count: 0, visible: true },
    {
      to: "/wishlist" as const,
      label: "علاقه",
      Icon: Heart,
      count: wishlist.length,
      visible: settings.features.wishlist,
    },
    {
      to: "/cart" as const,
      label: "سبد",
      Icon: ShoppingCart,
      count: cartCount,
      visible: true,
    },
    {
      to: "/auth" as const,
      label: "حساب",
      Icon: User,
      count: 0,
      visible: settings.features.auth && settings.environment.capabilities.auth === "configured",
    },
  ].filter((tab) => tab.visible);

  return (
    <nav
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-border-subtle bg-background-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-[var(--blur-overlay)] lg:hidden"
      dir="rtl"
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map(({ to, label, Icon, count }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-sm px-1 py-2 text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
              activeProps={{ className: "text-accent-primary" }}
              activeOptions={{ exact: to === "/" }}
            >
              <span className="relative">
                <Icon className="size-5" aria-hidden="true" />
                {count > 0 ? (
                  <span className="absolute -end-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent-primary text-[9px] font-bold text-background-canvas">
                    {count}
                  </span>
                ) : null}
              </span>
              <span className="text-[10px]">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
