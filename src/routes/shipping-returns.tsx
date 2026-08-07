import { createFileRoute } from "@tanstack/react-router";

import {
  ContentPage,
  ContentSection,
  SupportLinks,
  UnconfiguredPolicyNotice,
} from "@/components/content/PolicyPage";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { buildTrustPageHead } from "@/content/trust/seo";
import { resolveClaimPresentation } from "@/domain/store-settings";

export const Route = createFileRoute("/shipping-returns")({
  head: () =>
    buildTrustPageHead({
      pathname: "/shipping-returns",
      title: "ارسال و مرجوعی",
      description: "وضعیت سیاست‌های تأییدشده ارسال و مرجوعی در کرونوس.",
    }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  const settings = usePublicStoreSettings();
  const shipping = resolveClaimPresentation(settings.shipping.presentationClaim);
  const returns = resolveClaimPresentation(settings.returns.presentationClaim);
  const shippingAvailable = settings.shipping.configured && settings.shipping.enabled;
  const returnsAvailable = settings.returns.configured && settings.returns.enabled;

  return (
    <ContentPage
      eyebrow="سیاست خرید"
      title="ارسال و مرجوعی"
      intro="زمان، هزینه، محدوده ارسال یا مهلت مرجوعی تنها از تنظیمات تأییدشده فروشگاه منتشر می‌شود."
    >
      {shippingAvailable && shipping.kind !== "hidden" ? (
        <ContentSection title="ارسال">
          <p>{shipping.text}</p>
        </ContentSection>
      ) : (
        <UnconfiguredPolicyNotice label="سیاست ارسال" />
      )}

      {returnsAvailable && returns.kind !== "hidden" ? (
        <ContentSection title="مرجوعی">
          <p>{returns.text}</p>
        </ContentSection>
      ) : (
        <UnconfiguredPolicyNotice label="سیاست مرجوعی">
          <SupportLinks />
        </UnconfiguredPolicyNotice>
      )}
    </ContentPage>
  );
}
