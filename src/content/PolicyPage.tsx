import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ContentPageProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly intro: string;
  readonly children: ReactNode;
}

export function ContentPage({
  eyebrow,
  title,
  intro,
  children,
}: ContentPageProps) {
  return (
    <main className="bg-[#08090B] text-[#F0EDE8]" dir="rtl">
      <header className="relative overflow-hidden border-b border-white/[0.06] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.08),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-[1100px]">
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#C9A84C]" aria-hidden="true" />
              <span
                className="text-[9px] font-semibold tracking-[0.28em] text-[#C9A84C]"
                dir="ltr"
              >
                {eyebrow}
              </span>
            </div>
          ) : null}

          <h1
            className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.4] text-[#F3EFE8] sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "Playfair Display, Vazirmatn Variable, serif",
            }}
          >
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-8 text-[#9D968D] sm:text-base sm:leading-9">
            {intro}
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1100px] gap-5 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {children}
      </div>
    </main>
  );
}

export function ContentSection({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="rounded-[1.4rem] border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-7">
      <h2
        className="text-lg font-semibold text-[#F0EDE8] sm:text-xl"
        style={{
          fontFamily: "Playfair Display, Vazirmatn Variable, serif",
        }}
      >
        {title}
      </h2>

      <div className="mt-3 space-y-3 text-sm leading-8 text-[#A39C92] sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function PolicyList({
  items,
}: {
  readonly items: readonly string[];
}) {
  return (
    <ul className="grid gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-white/[0.06] bg-[#090B0D] px-4 py-3 text-sm leading-7 text-[#AAA39A]"
        >
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C9A84C]"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SupportLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to="/faq"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm font-semibold text-[#DAD3C9] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
      >
        پرسش‌های متداول
        <ArrowLeft className="size-3.5" aria-hidden="true" />
      </Link>

      <Link
        to="/contact"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm font-semibold text-[#DAD3C9] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
      >
        راه‌های تماس
        <ArrowLeft className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
