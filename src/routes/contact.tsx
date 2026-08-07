import { Mail, Phone } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import {
  ContentPage,
  ContentSection,
  UnconfiguredPolicyNotice,
} from "@/components/content/PolicyPage";
import {
  getConfirmedEmails,
  getConfirmedPhones,
  getConfirmedSocialLinks,
} from "@/components/layout/navigation-model";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { buildTrustPageHead } from "@/content/trust/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildTrustPageHead({
      pathname: "/contact",
      title: "تماس با کرونوس",
      description: "راه‌های ارتباطی تأییدشده کرونوس و وضعیت دسترسی به پشتیبانی.",
    }),
  component: ContactPage,
});

function ContactPage() {
  const settings = usePublicStoreSettings();
  const phones = getConfirmedPhones(settings);
  const emails = getConfirmedEmails(settings);
  const socialLinks = getConfirmedSocialLinks(settings);
  const hasChannels = phones.length + emails.length + socialLinks.length > 0;
  const formAvailable =
    settings.features.contactForm && settings.environment.capabilities.contactForm === "configured";

  return (
    <ContentPage
      eyebrow="تماس"
      title="راه‌های ارتباطی"
      intro="در این صفحه فقط کانال‌هایی نمایش داده می‌شوند که برای انتشار عمومی تأیید شده باشند."
    >
      {hasChannels ? (
        <ContentSection title="کانال‌های تأییدشده">
          <div className="grid gap-3 sm:grid-cols-2">
            {phones.map((phone) => (
              <a
                key={phone.id}
                href={`tel:${phone.e164}`}
                className="flex min-h-11 items-center gap-3 rounded-md border border-border-subtle px-4 py-3 text-text-primary hover:border-border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Phone className="size-5 text-accent-primary" aria-hidden="true" />
                {phone.displayValue ?? phone.e164}
              </a>
            ))}
            {emails.map((email) => (
              <a
                key={email.id}
                href={`mailto:${email.address}`}
                className="flex min-h-11 items-center gap-3 rounded-md border border-border-subtle px-4 py-3 text-text-primary hover:border-border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Mail className="size-5 text-accent-primary" aria-hidden="true" />
                {email.address}
              </a>
            ))}
            {socialLinks.map((social) => (
              <a
                key={`${social.platform}-${social.url}`}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex min-h-11 items-center rounded-md border border-border-subtle px-4 py-3 text-text-primary hover:border-border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                {social.label}
              </a>
            ))}
          </div>
        </ContentSection>
      ) : (
        <UnconfiguredPolicyNotice label="اطلاعات تماس عمومی">
          <Link
            to="/faq"
            className="inline-flex min-h-11 items-center rounded-md border border-border-default px-4 text-sm font-semibold text-text-primary hover:bg-background-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            مشاهده پرسش‌های متداول
          </Link>
        </UnconfiguredPolicyNotice>
      )}

      <ContentSection title="فرم تماس">
        {formAvailable ? (
          <p>
            قابلیت فرم تماس برای این محیط فعال شده است، اما ارسال باید به اتصال واقعی سرویس پشتیبانی
            وابسته باشد. هیچ پیام موفقیت بدون ثبت واقعی درخواست نمایش داده نمی‌شود.
          </p>
        ) : (
          <p>
            فرم تماس عمومی در حال حاضر فعال نیست. این صفحه عمداً فرم نمایشی یا پیام موفقیت ساختگی
            ارائه نمی‌کند.
          </p>
        )}
      </ContentSection>
    </ContentPage>
  );
}
