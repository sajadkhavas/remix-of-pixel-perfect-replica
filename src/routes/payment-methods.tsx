import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Landmark, LockKeyhole } from "lucide-react";

import {
  ContentPage,
  ContentSection,
  PolicyList,
  SupportLinks,
} from "@/components/content/PolicyPage";
import { getVisiblePaymentMethods } from "@/components/layout/navigation-model";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";

export const Route = createFileRoute("/payment-methods")({
  head: () => ({
    meta: [
      { title: "روش‌های پرداخت | KRONOS" },
      {
        name: "description",
        content: "راهنمای روش‌های پرداخت سفارش در KRONOS.",
      },
    ],
  }),
  component: PaymentMethodsPage,
});

function PaymentMethodsPage() {
  const settings = usePublicStoreSettings();
  const methods = getVisiblePaymentMethods(settings);

  return (
    <ContentPage
      eyebrow="PAYMENT"
      title="روش‌های پرداخت"
      intro="روش‌های قابل استفاده برای هر سفارش در مرحله مربوط به پرداخت نمایش داده می‌شوند. اطلاعات پرداخت را فقط در مسیرهای اعلام‌شده همان سفارش وارد کنید."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <ContentSection title="پرداخت امن">
          <LockKeyhole className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            اطلاعات کارت یا حساب خود را فقط در صفحه رسمی روش پرداخت انتخاب‌شده وارد کنید.
          </p>
        </ContentSection>

        <ContentSection title="تطبیق مبلغ">
          <CreditCard className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            پیش از تأیید، مبلغ سفارش و اطلاعات نمایش‌داده‌شده در خلاصه سفارش را بررسی کنید.
          </p>
        </ContentSection>

        <ContentSection title="پیگیری">
          <Landmark className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            رسید و شناسه تراکنش را تا مشخص‌شدن وضعیت سفارش نگهداری کنید.
          </p>
        </ContentSection>
      </div>

      {methods.length > 0 ? (
        <ContentSection title="روش‌های در دسترس">
          <div className="grid gap-3 sm:grid-cols-2">
            {methods.map((method) => (
              <div
                key={method.providerId}
                className="rounded-xl border border-white/[0.07] bg-[#090B0D] p-4"
              >
                <p className="font-semibold text-[#F0EDE8]">
                  {method.displayName}
                </p>
                {method.publicDescription ? (
                  <p className="mt-1 text-sm leading-7 text-[#8F887F]">
                    {method.publicDescription}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </ContentSection>
      ) : (
        <ContentSection title="نمایش روش پرداخت">
          <p>
            گزینه‌های قابل استفاده برای سفارش شما در زمان ادامه فرایند خرید نمایش داده می‌شوند.
          </p>
          <SupportLinks />
        </ContentSection>
      )}

      <ContentSection title="نکات مهم">
        <PolicyList
          items={[
            "مبلغ نهایی را پیش از پرداخت با خلاصه سفارش تطبیق دهید.",
            "اطلاعات حساس بانکی را از طریق پیام، شبکه اجتماعی یا فرم‌های ناشناس ارسال نکنید.",
            "رسید و شناسه پرداخت را تا پایان پیگیری سفارش نگهداری کنید.",
          ]}
        />
      </ContentSection>
    </ContentPage>
  );
}
