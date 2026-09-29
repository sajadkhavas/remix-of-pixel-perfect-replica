import { Link } from "@tanstack/react-router";
import {
  Heart,
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";

import { useStore } from "@/lib/store-context";
import { usePublicStoreSettings } from "./store-settings-context";

export function MobileTabBar() {
  const settings = usePublicStoreSettings();
  const { cart, wishlist } = useStore();

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

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
      visible:
        settings.features.auth &&
        settings.environment.capabilities.auth === "configured",
    },
  ].filter((tab) => tab.visible);

  return (
    <nav
      aria-label="ناوبری موبایل"
      className="fixed left-1/2 z-[65] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#0B0C0E]/90 p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent-primary/55 to-transparent"
        aria-hidden="true"
      />

      <ul
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map(({ to, label, Icon, count }) => (
          <li key={to} className="min-w-0">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex min-h-[58px] min-w-0 items-center justify-center rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              {({ isActive }) => (
                <span
                  className={`flex w-full min-w-0 flex-col items-center justify-center gap-1 rounded-[1.15rem] px-1 py-1.5 transition-all duration-300 ${
                    isActive
                      ? "bg-accent-muted text-accent-primary"
                      : "text-text-muted hover:bg-white/[0.03] hover:text-text-primary"
                  }`}
                >
                  <span
                    className={`relative flex size-7 items-center justify-center rounded-full transition-all duration-300 ${
                      isActive ? "bg-accent-primary/10" : ""
                    }`}
                  >
                    <Icon
                      className={isActive ? "size-[19px]" : "size-[18px]"}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      aria-hidden="true"
                    />

                    {count > 0 ? (
                      <span className="absolute -end-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#0B0C0E] bg-accent-primary px-1 text-[8px] font-bold leading-none text-background-canvas">
                        {count.toLocaleString("fa-IR")}
                      </span>
                    ) : null}
                  </span>

                  <span
                    className={`max-w-full truncate text-[9px] transition-colors ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {label}
                  </span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
