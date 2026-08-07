import { createFileRoute } from "@tanstack/react-router";

import {
  ContentPage,
  ContentSection,
  SupportLinks,
  UnconfiguredPolicyNotice,
} from "@/components/content/PolicyPage";
import { getVisiblePaymentMethods } from "@/components/layout/navigation-model";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { buildTrustPageHead } from "@/content/trust/seo";

export const Route = createFileRoute("/payment-methods")({
  head: () =>
    buildTrustPageHead({
      pathname: "/payment-methods",
      title: "روش‌های پرداخت",
      description: "روش‌های پرداخت عمومی که در تنظیمات کرونوس فعال شده‌اند.",
    }),
  component: PaymentMethodsPage,
});

function PaymentMethodsPage() {
  const settings = usePublicStoreSettings();
  const methods = getVisiblePaymentMethods(settings);

  return (
    <ContentPage
      eyebrow="پرداخت"
      title="روش‌های پرداخت"
      intro="فقط روش‌های پرداختی که برای این محیط فعال و قابل نمایش هستند در این صفحه فهرست می‌شوند."
    >
      {methods.length > 0 ? (
        <ContentSection title="روش‌های فعال">
          <ul className="space-y-3">
            {methods.map((method) => (
              <li key={method.providerId} className="rounded-md border border-border-subtle p-4">
                <p className="font-semibold text-text-primary">{method.displayName}</p>
                {method.publicDescription ? (
                  <p className="mt-1 text-sm text-text-secondary">{method.publicDescription}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : (
        <UnconfiguredPolicyNotice label="روش‌های پرداخت عمومی">
          <SupportLinks />
        </UnconfiguredPolicyNotice>
      )}
    </ContentPage>
  );
}
