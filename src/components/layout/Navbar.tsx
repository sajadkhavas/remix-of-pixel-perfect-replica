import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, User, Heart } from "lucide-react";

const NAV_ITEMS = [
  { label: "محصولات", href: "#products", sub: ["لوکس", "اسپرت", "هوشمند", "کلاسیک", "زنانه"] },
  { label: "برندها", href: "#brands", sub: ["Rolex", "Omega", "Casio", "Apple", "Garmin"] },
  { label: "مجله", href: "#magazine", sub: [] },
  { label: "سرویس", href: "#services", sub: [] },
  { label: "تماس", href: "#contact", sub: [] },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const cartCount = 0;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <div className="w-full py-2 text-center text-[10px] tracking-[0.3em] uppercase text-[#8A8A8A] bg-[#080808] border-b border-[#1A1A1A] relative z-50">
        ارسال رایگان برای خریدهای بالای ۵۰ میلیون تومان · ضمانت اصالت کالا
      </div>

      <motion.nav
        className="fixed top-7 left-0 right-0 z-50 px-8 py-5"
        animate={{
          background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
        }}
        transition={{ duration: 0.4 }}
        style={{
          borderBottom: scrolled
            ? "1px solid rgba(201,168,76,0.12)"
            : "1px solid transparent",
        }}
      >
        <div className="container mx-auto flex items-center justify-between" dir="rtl">
          <motion.a href="#" className="flex flex-col" whileHover={{ opacity: 0.8 }}>
            <span
              className="text-[#C9A84C] text-xl font-black tracking-[0.15em] uppercase"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              KRONOS
            </span>
            <span className="text-[#4A4A4A] text-[9px] tracking-[0.4em] uppercase">
              فروشگاه ساعت
            </span>
          </motion.a>

          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveItem(item.label)}
                onMouseLeave={() => setActiveItem(null)}
              >
                <a
                  href={item.href}
                  className="text-[#8A8A8A] hover:text-[#F0EDE8] text-xs tracking-[0.2em] uppercase transition-colors relative block py-2"
                >
                  {item.label}
                  <span
                    className="absolute bottom-0 right-0 h-[1px] bg-[#C9A84C] transition-all duration-300"
                    style={{ width: activeItem === item.label ? "100%" : "0" }}
                  />
                </a>

                <AnimatePresence>
                  {activeItem === item.label && item.sub.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 min-w-[160px] border border-[#1E1E1E] bg-[#0C0C0C]/95 backdrop-blur-xl"
                    >
                      {item.sub.map((s) => (
                        <a
                          key={s}
                          href={`#${s}`}
                          className="block px-5 py-3 text-xs text-[#8A8A8A] hover:text-[#C9A84C] hover:bg-[#C9A84C08] transition-colors tracking-wider border-b border-[#1A1A1A] last:border-0"
                        >
                          {s}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {[
              { Icon: Search, key: "search" },
              { Icon: Heart, key: "wishlist" },
              { Icon: User, key: "account" },
            ].map(({ Icon, key }) => (
              <motion.a
                key={key}
                href={`#${key}`}
                whileHover={{ scale: 1.1 }}
                className="p-1.5 text-[#4A4A4A] hover:text-[#C9A84C] transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}

            <motion.a
              href="#cart"
              whileHover={{ scale: 1.1 }}
              className="relative p-1.5 text-[#4A4A4A] hover:text-[#C9A84C] transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -left-1 w-4 h-4 text-[#080808] text-[9px] rounded-full font-black flex items-center justify-center"
                  style={{ background: "#C9A84C" }}
                >
                  {cartCount}
                </span>
              )}
            </motion.a>

            <motion.button
              className="md:hidden p-1.5 text-[#4A4A4A]"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28 }}
            className="fixed inset-y-0 right-0 w-80 z-40 pt-32 px-8 border-l border-[#1E1E1E]"
            style={{ background: "rgba(8,8,8,0.98)", backdropFilter: "blur(24px)" }}
            dir="rtl"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between text-[#F0EDE8] text-lg font-bold py-5 border-b border-[#1A1A1A] hover:text-[#C9A84C] transition-colors"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { delay: i * 0.07 } }}
              >
                {item.label}
                <span className="text-[#4A4A4A] text-sm">←</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
