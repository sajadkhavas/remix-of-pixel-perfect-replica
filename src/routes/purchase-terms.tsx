import { createFileRoute } from "@tanstack/react-router";

import { LegalUnavailablePage } from "@/components/content/LegalUnavailablePage";
import { buildTrustPageHead } from "@/content/trust/seo";

export const Route = createFileRoute("/purchase-terms")({
  head: () =>
    buildTrustPageHead({
      pathname: "/purchase-terms",
      title: "شرایط خرید",
      description: "وضعیت سند شرایط خرید قابل انتشار کرونوس.",
    }),
  component: PurchaseTermsPage,
});

function PurchaseTermsPage() {
  return (
    <LegalUnavailablePage
      title="شرایط خرید"
      intro="تعهدات خرید، پرداخت، تحویل و لغو سفارش فقط از سند حقوقی و سیاست‌های تأییدشده فروشگاه منتشر می‌شوند."
    />
  );
}
