import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Twitter, Send, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const COLS = [
  {
    title: "فروشگاه",
    items: [
      { label: "همه محصولات", to: "/shop" },
      { label: "ساعت لوکس", to: "/shop/luxury" },
      { label: "ساعت اسپرت", to: "/shop/sport" },
      { label: "ساعت هوشمند", to: "/shop/smart" },
      { label: "ساعت کلاسیک", to: "/shop/classic" },
    ],
  },
  {
    title: "پشتیبانی",
    items: [
      { label: "خدمات", to: "/services" },
      { label: "سوالات متداول", to: "/faq" },
      { label: "تماس با ما", to: "/contact" },
      { label: "علاقه‌مندی‌ها", to: "/wishlist" },
      { label: "سبد خرید", to: "/cart" },
    ],
  },
  {
    title: "درباره",
    items: [
      { label: "داستان ما", to: "/about" },
      { label: "برندها", to: "/brands" },
      { label: "مجله", to: "/blog" },
      { label: "ورود / ثبت‌نام", to: "/auth" },
    ],
  },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-[#060606] border-t border-[#1E1E1E] pt-14 pb-24 lg:pb-10 px-5 sm:px-8 mt-10" dir="rtl">
      <div className="container mx-auto grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="col-span-2">
          <Link to="/" className="block mb-3">
            <span className="text-[#C9A84C] text-2xl font-black tracking-[0.15em] uppercase" style={{ fontFamily: "Playfair Display, serif" }}>
              KRONOS
            </span>
          </Link>
          <p className="text-[#8A8A8A] text-xs sm:text-sm leading-loose mb-5 max-w-sm">
            مرجع تخصصی ساعت‌های لوکس، اسپرت و هوشمند در ایران. ضمانت اصالت، ارسال امن و سرویس تخصصی.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) return toast.error("ایمیل معتبر وارد کنید");
              toast.success("به خبرنامه پیوستید ✓");
              setEmail("");
            }}
            className="flex items-stretch gap-0 border border-[#1E1E1E] focus-within:border-[#C9A84C55] transition-colors max-w-sm"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل شما"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-[#F0EDE8] placeholder-[#4A4A4A] outline-none min-w-0"
            />
            <button type="submit" className="px-4 bg-[#C9A84C] text-[#080808] hover:bg-[#E8C96C] transition-colors shrink-0" aria-label="عضویت">
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex gap-3 mt-5">
            {[Instagram, Twitter, Send].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 border border-[#1E1E1E] hover:border-[#C9A84C] hover:text-[#C9A84C] text-[#8A8A8A] flex items-center justify-center transition-colors" aria-label="social">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-[#F0EDE8] text-xs tracking-[0.3em] uppercase mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.items.map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="text-[#8A8A8A] hover:text-[#C9A84C] text-sm transition-colors">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-10 pt-6 border-t border-[#1A1A1A] grid gap-4 md:grid-cols-3 items-center">
        <div className="flex flex-col gap-1.5 text-xs text-[#8A8A8A]">
          <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#C9A84C]" /> ۰۲۱-۰۰۰۰۰۰۰۰</span>
          <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#C9A84C]" /> hello@kronos.shop</span>
          <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#C9A84C]" /> تهران، خیابان ولیعصر</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-[10px] text-[#4A4A4A]">
          <span className="px-2 py-1 border border-[#1E1E1E]">VISA</span>
          <span className="px-2 py-1 border border-[#1E1E1E]">شاپرک</span>
          <span className="px-2 py-1 border border-[#1E1E1E]">زرین‌پال</span>
        </div>
        <span className="text-[#4A4A4A] text-[10px] tracking-[0.3em] uppercase md:text-left text-center">
          © ۱۴۰۴ KRONOS · کلیه حقوق محفوظ است
        </span>
      </div>
    </footer>
  );
}
