import { createFileRoute } from "@tanstack/react-router";

import {
  ContentPage,
  ContentSection,
  PolicyList,
} from "@/components/content/PolicyPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "حریم خصوصی | KRONOS" },
      {
        name: "description",
        content:
          "اطلاعات مربوط به حریم خصوصی و داده‌های ذخیره‌شده در KRONOS.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="PRIVACY"
      title="حریم خصوصی"
      intro="این صفحه توضیح می‌دهد چه نوع اطلاعاتی ممکن است هنگام استفاده از فروشگاه در مرورگر شما نگهداری شود و چگونه می‌توانید آن را مدیریت کنید."
    >
      <ContentSection title="اطلاعات ذخیره‌شده در مرورگر">
        <PolicyList
          items={[
            "سبد خرید برای حفظ انتخاب‌های شما بین بازدیدها ذخیره می‌شود.",
            "لیست علاقه‌مندی‌ها برای دسترسی دوباره به محصولات انتخاب‌شده نگهداری می‌شود.",
            "تنظیمات رابط مانند بستن نوار اطلاعیه ممکن است در مرورگر ثبت شوند.",
          ]}
        />
      </ContentSection>

      <ContentSection title="اطلاعاتی که خودتان وارد می‌کنید">
        <p>
          هر اطلاعاتی که در فرم‌های سایت وارد می‌کنید باید فقط برای همان هدفی استفاده شود که هنگام ورود اطلاعات مشخص شده است.
          اطلاعات حساس بانکی نباید در فرم‌های عمومی یا پیام‌های عادی وارد شوند.
        </p>
      </ContentSection>

      <ContentSection title="کنترل اطلاعات محلی">
        <p>
          می‌توانید داده‌های ذخیره‌شده سایت را از تنظیمات مرورگر پاک کنید. با این کار ممکن است سبد خرید،
          علاقه‌مندی‌ها و برخی ترجیحات ذخیره‌شده نیز حذف شوند.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
