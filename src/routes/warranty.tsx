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

export const Route = createFileRoute("/warranty")({
  head: () =>
    buildTrustPageHead({
      pathname: "/warranty",
      title: "گارانتی",
      description: "وضعیت سیاست گارانتی و اطلاعات تأییدشده قابل انتشار در کرونوس.",
    }),
  component: WarrantyPage,
});

function WarrantyPage() {
  const settings = usePublicStoreSettings();
  const presentation = resolveClaimPresentation(settings.warranty.presentationClaim);
  const available = settings.warranty.configured && settings.warranty.enabled;

  return (
    <ContentPage
      eyebrow="پشتیبانی"
      title="گارانتی"
      intro="مدت، پوشش و صادرکننده گارانتی تنها زمانی نمایش داده می‌شوند که سیاست مربوط برای انتشار عمومی تأیید شده باشد."
    >
      {available && presentation.kind !== "hidden" ? (
        <ContentSection title="اطلاعات تأییدشده">
          <p>{presentation.text}</p>
        </ContentSection>
      ) : (
        <UnconfiguredPolicyNotice label="سیاست گارانتی">
          <SupportLinks />
        </UnconfiguredPolicyNotice>
      )}
    </ContentPage>
  );
}
