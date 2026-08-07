import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import type { ComponentType } from "react";

import type { SocialPlatform } from "@/domain/store-settings";
import {
  getConfirmedEmails,
  getConfirmedPhones,
  getConfirmedSocialLinks,
  getVisiblePaymentMethods,
} from "./navigation-model";
import { usePublicStoreSettings } from "./store-settings-context";

const FOOTER_COLUMNS = [
  {
    title: "فروشگاه",
    items: [
      { label: "همه ساعت‌ها", to: "/shop" },
      { label: "برندها", to: "/brands" },
      { label: "علاقه‌مندی‌ها", to: "/wishlist" },
    ],
  },
  {
    title: "راهنما",
    items: [
      { label: "خدمات", to: "/services" },
      { label: "پرسش‌های متداول", to: "/faq" },
      { label: "تماس", to: "/contact" },
    ],
  },
  {
    title: "KRONOS",
    items: [
      { label: "درباره ما", to: "/about" },
      { label: "مجله", to: "/blog" },
    ],
  },
] as const;

const SOCIAL_ICONS: Partial<Record<SocialPlatform, ComponentType<{ className?: string }>>> = {
  instagram: Instagram,
  telegram: Send,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

export function Footer() {
  const settings = usePublicStoreSettings();
  const phones = getConfirmedPhones(settings);
  const emails = getConfirmedEmails(settings);
  const socialLinks = getConfirmedSocialLinks(settings);
  const paymentMethods = getVisiblePaymentMethods(settings);
  const showWishlist = settings.features.wishlist;
  const brandName = settings.brand.shortName ?? settings.brand.name;
  const currentYear = new Date().getFullYear().toLocaleString("fa-IR", { useGrouping: false });

  return (
    <footer
      className="mt-10 border-t border-border-subtle bg-background-canvas px-5 pb-24 pt-14 sm:px-8 lg:pb-10"
      dir="rtl"
    >
      <div className="container mx-auto grid grid-cols-2 gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="col-span-2">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-sm px-1 text-2xl font-black uppercase tracking-[0.15em] text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {brandName}
          </Link>
          <p className="mt-2 max-w-md text-sm leading-7 text-text-secondary">
            {settings.brand.slogan ??
              "مشخصات ثبت‌شده هر مدل را بررسی و گزینه‌ها را بر اساس نیاز خود مقایسه کنید."}
          </p>

          {socialLinks.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2" aria-label="شبکه‌های اجتماعی">
              {socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform] ?? MessageCircle;
                return (
                  <a
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={link.label}
                    className="inline-flex size-11 items-center justify-center rounded-md border border-border-subtle text-text-secondary transition-colors hover:border-border-default hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-text-primary">
              {column.title}
            </h2>
            <ul className="space-y-1">
              {column.items.map((item) => {
                if (item.to === "/wishlist" && !showWishlist) return null;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-flex min-h-11 items-center rounded-sm text-sm text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-10 grid items-center gap-5 border-t border-border-subtle pt-6 md:grid-cols-3">
        {phones.length > 0 || emails.length > 0 ? (
          <div className="flex flex-col gap-2 text-sm text-text-secondary">
            {phones.map((phone) => (
              <a
                key={phone.id}
                href={`tel:${phone.e164}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Phone className="size-4" aria-hidden="true" />
                {phone.displayValue ?? phone.e164}
              </a>
            ))}
            {emails.map((email) => (
              <a
                key={email.id}
                href={`mailto:${email.address}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Mail className="size-4" aria-hidden="true" />
                {email.address}
              </a>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" />
        )}

        {paymentMethods.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
            {paymentMethods.map((method) => (
              <span key={method.providerId} className="rounded-sm border border-border-subtle px-3 py-2">
                {method.displayName}
              </span>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" />
        )}

        <span className="text-center text-xs text-text-muted md:text-left">
          © {currentYear} {brandName}
        </span>
      </div>
    </footer>
  );
}
