import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, User, Heart, ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store-context";
import { CATEGORIES } from "@/lib/catalog";

const NAV_ITEMS = [
  { label: "فروشگاه", to: "/shop", sub: CATEGORIES.map((c) => ({ label: c.name, to: `/shop/${c.slug}` })) },
  { label: "برندها", to: "/brands", sub: [] },
  { label: "مجله", to: "/blog", sub: [] },
  { label: "خدمات", to: "/services", sub: [] },
  { label: "درباره", to: "/about", sub: [] },
  { label: "تماس", to: "/contact", sub: [] },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { cart, wishlist } = useStore();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <div className="w-full py-2 text-center text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#8A8A8A] bg-[#080808] border-b border-[#1A1A1A] relative z-50 px-3">
        ارسال رایگان بالای ۵۰ میلیون · ضمانت اصالت
      </div>

      <motion.nav
        className="sticky top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-3 lg:py-4"
        animate={{
          background: scrolled ? "rgba(8,8,8,0.92)" : "rgba(8,8,8,0.6)",
          backdropFilter: "blur(20px)",
        }}
        transition={{ duration: 0.3 }}
        style={{ borderBottom: "1px solid rgba(201,168,76,0.10)" }}
      >
        <div className="container mx-auto flex items-center justify-between gap-4" dir="rtl">
          <Link to="/" className="flex flex-col shrink-0">
            <span className="text-[#C9A84C] text-lg sm:text-xl font-black tracking-[0.15em] uppercase" style={{ fontFamily: "Playfair Display, serif" }}>
              KRONOS
            </span>
            <span className="text-[#4A4A4A] text-[8px] sm:text-[9px] tracking-[0.3em] uppercase hidden sm:block">
              فروشگاه ساعت
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveItem(item.label)}
                onMouseLeave={() => setActiveItem(null)}
              >
                <Link
                  to={item.to}
                  className="text-[#A8A8A8] hover:text-[#F0EDE8] text-xs tracking-[0.2em] uppercase transition-colors block py-2"
                  activeProps={{ className: "text-[#C9A84C]" }}
                >
                  {item.label}
                </Link>
                <AnimatePresence>
                  {activeItem === item.label && item.sub.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full right-0 mt-2 min-w-[180px] border border-[#1E1E1E] bg-[#0C0C0C]/95 backdrop-blur-xl"
                    >
                      {item.sub.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="block px-5 py-3 text-xs text-[#A8A8A8] hover:text-[#C9A84C] hover:bg-[#C9A84C08] transition-colors tracking-wider border-b border-[#1A1A1A] last:border-0"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/shop" aria-label="جستجو" className="p-2 text-[#8A8A8A] hover:text-[#C9A84C] transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/wishlist" aria-label="علاقه‌مندی" className="relative p-2 text-[#8A8A8A] hover:text-[#C9A84C] transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 text-[#080808] text-[9px] rounded-full font-black flex items-center justify-center bg-[#C9A84C]">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/auth" aria-label="حساب" className="hidden sm:block p-2 text-[#8A8A8A] hover:text-[#C9A84C] transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart" aria-label="سبد خرید" className="relative p-2 text-[#8A8A8A] hover:text-[#C9A84C] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 text-[#080808] text-[9px] rounded-full font-black flex items-center justify-center bg-[#C9A84C]">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2 text-[#A8A8A8] hover:text-[#C9A84C]"
              onClick={() => setMenuOpen(true)}
              aria-label="منو"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-[88%] max-w-sm z-[70] border-l border-[#1E1E1E] flex flex-col"
              style={{ background: "#080808" }}
              dir="rtl"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A]">
                <span className="text-[#C9A84C] text-lg font-black tracking-[0.15em] uppercase" style={{ fontFamily: "Playfair Display, serif" }}>
                  KRONOS
                </span>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-[#A8A8A8]" aria-label="بستن">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {NAV_ITEMS.map((item, i) => (
                  <div key={item.label}>
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1, transition: { delay: i * 0.05 } }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between text-[#F0EDE8] text-base font-bold py-4 border-b border-[#1A1A1A] hover:text-[#C9A84C] transition-colors"
                      >
                        {item.label}
                        <ChevronLeft className="w-4 h-4 text-[#4A4A4A]" />
                      </Link>
                    </motion.div>
                    {item.sub.length > 0 && (
                      <div className="pr-3 py-1 -mt-1 mb-2">
                        {item.sub.map((s) => (
                          <Link
                            key={s.to}
                            to={s.to}
                            onClick={() => setMenuOpen(false)}
                            className="block py-2 text-xs text-[#8A8A8A] hover:text-[#C9A84C]"
                          >
                            — {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="mt-6 block w-full py-3 text-center text-[#080808] bg-[#C9A84C] font-bold text-sm tracking-[0.2em] uppercase"
                >
                  ورود / ثبت‌نام
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
