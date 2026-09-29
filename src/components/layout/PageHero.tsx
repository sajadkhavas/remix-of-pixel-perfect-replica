import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  readonly eyebrow?: string;
  readonly title: string;
  readonly sub?: string;
  readonly children?: ReactNode;
}) {
  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#08090B] px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-16"
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[76%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.07),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        {eyebrow ? (
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#C9A84C]" aria-hidden="true" />
            <span
              className="text-[9px] font-semibold tracking-[0.3em] text-[#C9A84C] sm:text-[10px]"
              dir="ltr"
            >
              {eyebrow}
            </span>
          </div>
        ) : null}

        <h1
          className="mt-3 max-w-4xl text-3xl font-semibold leading-[1.4] text-[#F0EDE8] sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
        >
          {title}
        </h1>

        {sub ? (
          <p className="mt-3 max-w-2xl text-sm leading-8 text-[#9B948B] sm:text-base">
            {sub}
          </p>
        ) : null}

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
