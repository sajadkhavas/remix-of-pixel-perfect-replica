import { createFileRoute } from "@tanstack/react-router";

import { LegalUnavailablePage } from "@/components/content/LegalUnavailablePage";
import { buildTrustPageHead } from "@/content/trust/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildTrustPageHead({
      pathname: "/terms",
      title: "شرایط استفاده",
      description: "وضعیت سند شرایط استفاده قابل انتشار کرونوس.",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalUnavailablePage
      title="شرایط استفاده"
      intro="شرایط استفاده از وب‌سایت باید از نسخه حقوقی تأییدشده منتشر شود و در این مرحله متن قراردادی فرضی تولید نمی‌شود."
    />
  );
}
