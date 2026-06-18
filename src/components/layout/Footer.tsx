export function Footer() {
  return (
    <footer
      className="bg-[#060606] border-t border-[#1E1E1E] py-16 px-8"
      dir="rtl"
    >
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div>
          <div
            className="text-[#C9A84C] text-xl font-black tracking-[0.15em] uppercase mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            KRONOS
          </div>
          <p className="text-[#8A8A8A] text-xs leading-loose">
            مرجع تخصصی ساعت‌های لوکس، اسپرت و هوشمند در ایران.
          </p>
        </div>

        {[
          { title: "فروشگاه", items: ["محصولات", "برندها", "تخفیف‌ها", "جدیدها"] },
          { title: "پشتیبانی", items: ["ارسال و بازگشت", "ضمانت‌نامه", "سرویس", "تماس"] },
          { title: "درباره ما", items: ["داستان ما", "مجله", "همکاری", "حریم خصوصی"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-[#F0EDE8] text-xs tracking-[0.3em] uppercase mb-5">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.items.map((i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-[#8A8A8A] hover:text-[#C9A84C] text-sm transition-colors"
                  >
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-16 pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[#4A4A4A] text-[10px] tracking-[0.3em] uppercase">
          © ۱۴۰۴ KRONOS · کلیه حقوق محفوظ است
        </span>
        <span
          className="text-[#4A4A4A] text-[10px] tracking-[0.3em]"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          MADE WITH ⌚ IN TEHRAN
        </span>
      </div>
    </footer>
  );
}
