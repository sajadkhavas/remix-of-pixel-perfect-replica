import { createFileRoute } from "@tanstack/react-router";

import { LegalUnavailablePage } from "@/components/content/LegalUnavailablePage";
import { buildTrustPageHead } from "@/content/trust/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildTrustPageHead({
      pathname: "/privacy",
      title: "حریم خصوصی",
      description: "وضعیت سند حریم خصوصی قابل انتشار کرونوس.",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalUnavailablePage
      title="حریم خصوصی"
      intro="سند حقوقی حریم خصوصی فقط پس از تأیید نسخه رسمی و قابل انتشار نمایش داده می‌شود."
    />
  );
}
