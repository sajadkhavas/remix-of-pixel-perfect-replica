import { createFileRoute, Link } from "@tanstack/react-router";

import {
  ContentPage,
  ContentSection,
  UnconfiguredPolicyNotice,
} from "@/components/content/PolicyPage";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { buildTrustPageHead } from "@/content/trust/seo";
import { resolveClaimPresentation } from "@/domain/store-settings";

export const Route = createFileRoute("/services")({
  head: () =>
    buildTrustPageHead({
      pathname: "/services",
      title: "خدمات کرونوس",
      description: "خدمات و سیاست‌هایی که برای انتشار عمومی در کرونوس پیکربندی و تأیید شده‌اند.",
    }),
  component: ServicesPage,
});

function ServicesPage() {
  const settings = usePublicStoreSettings();
  const services = [
    {
      id: "authenticity",
      title: "اطلاعات اصالت",
      to: "/authenticity" as const,
      enabled: settings.authenticity.configured && settings.authenticity.enabled,
      claim: resolveClaimPresentation(settings.authenticity.presentationClaim),
    },
    {
      id: "warranty",
      title: "گارانتی",
      to: "/warranty" as const,
      enabled: settings.warranty.configured && settings.warranty.enabled,
      claim: resolveClaimPresentation(settings.warranty.presentationClaim),
    },
    {
      id: "shipping",
      title: "ارسال و مرجوعی",
      to: "/shipping-returns" as const,
      enabled:
        (settings.shipping.configured && settings.shipping.enabled) ||
        (settings.returns.configured && settings.returns.enabled),
      claim: resolveClaimPresentation(
        settings.shipping.presentationClaim ?? settings.returns.presentationClaim,
      ),
    },
    {
      id: "payments",
      title: "روش‌های پرداخت",
      to: "/payment-methods" as const,
      enabled:
        settings.features.paymentMethods && settings.payment.methods.some((method) => method.enabled),
      claim: { kind: "hidden" as const },
    },
  ].filter((service) => service.enabled);

  return (
    <ContentPage
      eyebrow="خدمات"
      title="خدمات قابل انتشار"
      intro="این صفحه فقط قابلیت‌ها و سیاست‌هایی را فهرست می‌کند که در تنظیمات عمومی فروشگاه فعال شده‌اند؛ زمان انجام، پوشش یا تعهد تأییدنشده اضافه نمی‌شود."
    >
      {services.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <ContentSection key={service.id} title={service.title}>
              {service.claim.kind !== "hidden" ? <p>{service.claim.text}</p> : null}
              <Link
                to={service.to}
                className="inline-flex min-h-11 items-center rounded-md border border-border-default px-4 text-sm font-semibold text-text-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                مشاهده جزئیات
              </Link>
            </ContentSection>
          ))}
        </div>
      ) : (
        <UnconfiguredPolicyNotice label="خدمات عمومی فروشگاه" />
      )}
    </ContentPage>
  );
}
