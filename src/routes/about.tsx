import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, ContentSection } from "@/components/content/PolicyPage";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { buildTrustPageHead } from "@/content/trust/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildTrustPageHead({
      pathname: "/about",
      title: "درباره کرونوس",
      description: "رویکرد کرونوس به ارائه اطلاعات قابل بررسی برای انتخاب و مقایسه ساعت.",
    }),
  component: AboutPage,
});

function AboutPage() {
  const settings = usePublicStoreSettings();
  const brandName = settings.brand.localizedName ?? settings.brand.name;

  return (
    <ContentPage
      eyebrow="درباره ما"
      title={brandName}
      intro="هدف این بخش توضیح شیوه ارائه اطلاعات فروشگاه است؛ بدون آمار، سابقه یا ادعایی که هنوز از منبع قابل اتکا تأیید نشده باشد."
    >
      <ContentSection title="انتخاب آگاهانه">
        <p>
          اطلاعات هر مدل باید بر پایه داده ثبت‌شده همان محصول نمایش داده شود؛ از مشخصات فنی و تصاویر
          گرفته تا وضعیت موجودی و شرایط خرید. هرجا داده‌ای در دسترس نباشد، آن مورد به‌جای حدس یا
          تکمیل خودکار، نامشخص باقی می‌ماند.
        </p>
      </ContentSection>

      <ContentSection title="شفافیت پیش از خرید">
        <p>
          شرایط ارسال، مرجوعی، گارانتی، اصالت و روش‌های پرداخت تنها زمانی به‌عنوان تعهد فروشگاه
          نمایش داده می‌شوند که در تنظیمات عمومی ثبت و برای انتشار تأیید شده باشند.
        </p>
      </ContentSection>

      <ContentSection title="ادامه مسیر">
        <p>برای بررسی مدل‌ها به فروشگاه بروید یا از راه‌های تماس تأییدشده استفاده کنید.</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center rounded-md bg-accent-primary px-4 text-sm font-semibold text-background-canvas hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            مشاهده فروشگاه
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center rounded-md border border-border-default px-4 text-sm font-semibold text-text-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            راه‌های تماس
          </Link>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
