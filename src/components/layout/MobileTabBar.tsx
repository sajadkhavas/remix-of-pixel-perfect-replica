import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Heart, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/lib/store-context";

const TABS = [
  { to: "/", label: "خانه", Icon: Home },
  { to: "/shop", label: "فروشگاه", Icon: ShoppingBag },
  { to: "/wishlist", label: "علاقه", Icon: Heart },
  { to: "/cart", label: "سبد", Icon: ShoppingCart },
  { to: "/auth", label: "حساب", Icon: User },
] as const;

export function MobileTabBar() {
  const { cart, wishlist } = useStore();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const counts: Record<string, number> = { "/cart": cartCount, "/wishlist": wishlist.length };

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#1E1E1E] pb-[env(safe-area-inset-bottom)]"
      dir="rtl"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ to, label, Icon }) => {
          const c = counts[to];
          return (
            <li key={to}>
              <Link
                to={to}
                className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[#8A8A8A] hover:text-[#C9A84C] transition-colors min-h-[56px]"
                activeProps={{ className: "text-[#C9A84C]" }}
                activeOptions={{ exact: to === "/" }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {c ? (
                    <span className="absolute -top-1.5 -left-1.5 w-4 h-4 text-[#080808] text-[9px] rounded-full font-black flex items-center justify-center bg-[#C9A84C]">
                      {c}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] tracking-wider">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
