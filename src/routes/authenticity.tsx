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

export const Route = createFileRoute("/authenticity")({
  head: () =>
    buildTrustPageHead({
      pathname: "/authenticity",
      title: "اصالت کالا",
      description: "وضعیت سیاست اصالت کالا و ادعاهای تأییدشده قابل انتشار در کرونوس.",
    }),
  component: AuthenticityPage,
});

function AuthenticityPage() {
  const settings = usePublicStoreSettings();
  const presentation = resolveClaimPresentation(settings.authenticity.presentationClaim);
  const available = settings.authenticity.configured && settings.authenticity.enabled;

  return (
    <ContentPage
      eyebrow="اعتماد"
      title="اصالت کالا"
      intro="این صفحه فقط سیاست یا ادعایی را منتشر می‌کند که برای فروشگاه پیکربندی و با شواهد معتبر قابل نمایش باشد."
    >
      {available && presentation.kind !== "hidden" ? (
        <ContentSection title="اطلاعات تأییدشده">
          <p>{presentation.text}</p>
        </ContentSection>
      ) : (
        <UnconfiguredPolicyNotice label="سیاست اصالت">
          <SupportLinks />
        </UnconfiguredPolicyNotice>
      )}
    </ContentPage>
  );
}
