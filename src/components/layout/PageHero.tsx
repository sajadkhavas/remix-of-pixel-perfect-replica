import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 px-5 sm:px-8 border-b border-[#1A1A1A] bg-gradient-to-b from-[#0c0c0c] to-[#080808]" dir="rtl">
      <div className="container mx-auto">
        {eyebrow && (
          <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#C9A84C] block mb-3">{eyebrow}</span>
        )}
        <h1 className="text-3xl sm:text-5xl font-black text-[#F0EDE8]" style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}>
          {title}
        </h1>
        {sub && <p className="text-[#A8A8A8] mt-3 max-w-2xl leading-loose text-sm sm:text-base">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
