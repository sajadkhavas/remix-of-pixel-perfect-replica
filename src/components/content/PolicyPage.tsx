import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface ContentPageProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly intro: string;
  readonly children: ReactNode;
}

export function ContentPage({ eyebrow, title, intro, children }: ContentPageProps) {
  return (
    <div className="bg-background-canvas" dir="rtl">
      <header className="border-b border-border-subtle px-5 py-12 sm:px-8 sm:py-16">
        <div className="container mx-auto max-w-5xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-accent-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-bold leading-tight text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-text-secondary sm:text-base">
            {intro}
          </p>
        </div>
      </header>
      <div className="container mx-auto max-w-5xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </div>
    </div>
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
    <section className="rounded-lg border border-border-subtle bg-background-surface p-5 sm:p-7">
      <h2 className="text-lg font-semibold text-text-primary sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-8 text-text-secondary">{children}</div>
    </section>
  );
}

export function UnconfiguredPolicyNotice({
  label,
  children,
}: {
  readonly label: string;
  readonly children?: ReactNode;
}) {
  return (
    <div
      className="rounded-lg border border-border-default bg-background-elevated p-5"
      role="status"
    >
      <p className="font-semibold text-text-primary">
        {label} هنوز برای انتشار عمومی تأیید نشده است.
      </p>
      <p className="mt-2 text-sm leading-7 text-text-secondary">
        تا زمان ثبت اطلاعات و شواهد لازم، جزئیات یا وعده‌ای از طرف فروشگاه نمایش داده نمی‌شود.
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export function SupportLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to="/faq"
        className="inline-flex min-h-11 items-center rounded-md border border-border-default px-4 text-sm font-semibold text-text-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        پرسش‌های متداول
      </Link>
      <Link
        to="/contact"
        className="inline-flex min-h-11 items-center rounded-md border border-border-default px-4 text-sm font-semibold text-text-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        راه‌های تماس
      </Link>
    </div>
  );
}
