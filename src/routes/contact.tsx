import { Mail, Phone, Send, Instagram } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import {
  ContentPage,
  ContentSection,
} from "@/components/content/PolicyPage";
import {
  getConfirmedEmails,
  getConfirmedPhones,
  getConfirmedSocialLinks,
} from "@/components/layout/navigation-model";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس با KRONOS" },
      {
        name: "description",
        content: "راه‌های ارتباطی KRONOS.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const settings = usePublicStoreSettings();
  const phones = getConfirmedPhones(settings);
  const emails = getConfirmedEmails(settings);
  const socialLinks = getConfirmedSocialLinks(settings);
  const hasChannels = phones.length + emails.length + socialLinks.length > 0;

  return (
    <ContentPage
      eyebrow="CONTACT"
      title="راه‌های ارتباطی"
      intro="برای پرسش درباره محصول، سفارش یا خدمات خرید از کانال‌های درج‌شده در این صفحه استفاده کنید."
    >
      {hasChannels ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {phones.map((phone) => (
            <a
              key={phone.id}
              href={`tel:${phone.e164}`}
              className="group flex min-h-20 items-center gap-4 rounded-[1.25rem] border border-white/[0.07] bg-[#0D0F11] px-5 transition-colors hover:border-[#C9A84C]/28"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#C9A84C]/[0.06] text-[#D6BE78]">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-[#F0EDE8]">
                {phone.displayValue ?? phone.e164}
              </span>
            </a>
          ))}

          {emails.map((email) => (
            <a
              key={email.id}
              href={`mailto:${email.address}`}
              className="group flex min-h-20 items-center gap-4 rounded-[1.25rem] border border-white/[0.07] bg-[#0D0F11] px-5 transition-colors hover:border-[#C9A84C]/28"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#C9A84C]/[0.06] text-[#D6BE78]">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <span className="truncate text-sm font-semibold text-[#F0EDE8]">
                {email.address}
              </span>
            </a>
          ))}

          {socialLinks.map((social) => (
            <a
              key={`${social.platform}-${social.url}`}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex min-h-20 items-center gap-4 rounded-[1.25rem] border border-white/[0.07] bg-[#0D0F11] px-5 transition-colors hover:border-[#C9A84C]/28"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#C9A84C]/[0.06] text-[#D6BE78]">
                {social.platform === "instagram" ? (
                  <Instagram className="size-4" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
              </span>
              <span className="text-sm font-semibold text-[#F0EDE8]">
                {social.label}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <ContentSection title="راهنمای سریع">
          <p>
            برای پاسخ به پرسش‌های عمومی درباره خرید، ارسال، ضمانت و اصالت می‌توانید ابتدا بخش پرسش‌های متداول و خدمات را بررسی کنید.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/faq"
              className="inline-flex min-h-11 items-center rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
            >
              پرسش‌های متداول
            </Link>

            <Link
              to="/services"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/[0.08] px-4 text-sm font-semibold text-[#DAD3C9] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C]"
            >
              خدمات
            </Link>
          </div>
        </ContentSection>
      )}
    </ContentPage>
  );
}
