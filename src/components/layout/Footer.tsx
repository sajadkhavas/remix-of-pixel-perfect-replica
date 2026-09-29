import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
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
      { label: "ارسال و بازگشت", to: "/shipping-returns" },
      { label: "ضمانت", to: "/warranty" },
      { label: "راهنمای اصالت", to: "/authenticity" },
      { label: "پرسش‌های متداول", to: "/faq" },
    ],
  },
  {
    title: "KRONOS",
    items: [
      { label: "درباره ما", to: "/about" },
      { label: "تماس", to: "/contact" },
      { label: "مجله", to: "/blog" },
    ],
  },
] as const;

const LEGAL_LINKS = [
  { label: "حریم خصوصی", to: "/privacy" },
  { label: "شرایط استفاده", to: "/terms" },
  { label: "شرایط خرید", to: "/purchase-terms" },
] as const;

const SOCIAL_ICONS: Partial<
  Record<SocialPlatform, ComponentType<{ className?: string }>>
> = {
  instagram: Instagram,
  telegram: Send,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

function FooterColumn({
  title,
  items,
  showWishlist,
}: {
  readonly title: string;
  readonly items: readonly {
    readonly label: string;
    readonly to:
      | "/shop"
      | "/brands"
      | "/wishlist"
      | "/services"
      | "/shipping-returns"
      | "/warranty"
      | "/authenticity"
      | "/faq"
      | "/about"
      | "/contact"
      | "/blog";
  }[];
  readonly showWishlist: boolean;
}) {
  const visibleItems = items.filter(
    (item) => item.to !== "/wishlist" || showWishlist,
  );

  return (
    <>
      <div className="hidden sm:block">
        <h2 className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#E8E2D8]">
          {title}
        </h2>

        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="inline-flex min-h-10 items-center rounded-sm text-sm text-[#8F887F] transition-colors hover:text-[#D8BE76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <details className="group border-b border-white/[0.06] sm:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#E8E2D8] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C9A84C]">
          {title}
          <ChevronDown
            className="size-4 text-[#77716A] transition-transform duration-300 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>

        <ul className="grid gap-1 pb-4">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex min-h-10 items-center text-sm text-[#8F887F] transition-colors hover:text-[#D8BE76]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

export function Footer() {
  const settings = usePublicStoreSettings();
  const phones = getConfirmedPhones(settings);
  const emails = getConfirmedEmails(settings);
  const socialLinks = getConfirmedSocialLinks(settings);
  const paymentMethods = getVisiblePaymentMethods(settings);
  const showWishlist = settings.features.wishlist;
  const brandName = settings.brand.shortName ?? settings.brand.name;
  const currentYear = new Date().getFullYear().toLocaleString("fa-IR", {
    useGrouping: false,
  });

  return (
    <footer
      className="mt-10 border-t border-white/[0.06] bg-[#08090B] px-4 pb-28 pt-12 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] sm:gap-6 lg:gap-12">
          <div>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center rounded-sm text-2xl font-semibold uppercase tracking-[0.14em] text-[#DCC078] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {brandName}
            </Link>

            <p className="mt-2 max-w-md text-sm leading-7 text-[#8F887F]">
              {settings.brand.slogan ??
                "انتخاب ساعت با تمرکز بر طراحی، مشخصات و جزئیات هر مدل."}
            </p>

            {socialLinks.length > 0 ? (
              <div
                className="mt-5 flex flex-wrap gap-2"
                aria-label="شبکه‌های اجتماعی"
              >
                {socialLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.platform] ?? MessageCircle;

                  return (
                    <a
                      key={`${link.platform}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={link.label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-white/[0.08] text-[#9D968D] transition-colors hover:border-[#C9A84C]/30 hover:text-[#D8BE76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              items={column.items}
              showWishlist={showWishlist}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-5 border-t border-white/[0.06] pt-6 sm:mt-10 md:grid-cols-3 md:items-center">
          {phones.length > 0 || emails.length > 0 ? (
            <div className="flex flex-col gap-1 text-sm text-[#8F887F]">
              {phones.map((phone) => (
                <a
                  key={phone.id}
                  href={`tel:${phone.e164}`}
                  className="inline-flex min-h-10 items-center gap-2 transition-colors hover:text-[#D8BE76]"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {phone.displayValue ?? phone.e164}
                </a>
              ))}

              {emails.map((email) => (
                <a
                  key={email.id}
                  href={`mailto:${email.address}`}
                  className="inline-flex min-h-10 items-center gap-2 transition-colors hover:text-[#D8BE76]"
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
            <div className="flex flex-wrap items-center justify-center gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method.providerId}
                  className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[10px] text-[#8F887F]"
                >
                  {method.displayName}
                </span>
              ))}
            </div>
          ) : (
            <div aria-hidden="true" />
          )}

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#77716A]">
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="transition-colors hover:text-[#CDB46F]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <span className="text-xs text-[#625D57]">
              © {currentYear} {brandName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
