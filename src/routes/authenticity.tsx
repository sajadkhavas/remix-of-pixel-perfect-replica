import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, ScanSearch, ShieldCheck } from "lucide-react";

import {
  ContentPage,
  ContentSection,
  PolicyList,
} from "@/components/content/PolicyPage";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { resolveClaimPresentation } from "@/domain/store-settings";

export const Route = createFileRoute("/authenticity")({
  head: () => ({
    meta: [
      { title: "راهنمای اصالت | KRONOS" },
      {
        name: "description",
        content: "راهنمای بررسی مشخصات و مدارک محصول در KRONOS.",
      },
    ],
  }),
  component: AuthenticityPage,
});

function AuthenticityPage() {
  const settings = usePublicStoreSettings();
  const presentation = resolveClaimPresentation(
    settings.authenticity.presentationClaim,
  );

  return (
    <ContentPage
      eyebrow="AUTHENTICITY"
      title="راهنمای بررسی اصالت"
      intro="مدل، شماره مرجع، مشخصات فنی و مدارک همراه محصول باید با اطلاعات قابل بررسی همان سازنده و همان سفارش تطبیق داشته باشند."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <ContentSection title="مدل و مرجع">
          <ScanSearch className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            شماره مرجع، SKU یا شناسه مدل را با اطلاعات درج‌شده در صفحه محصول و مدارک همراه تطبیق دهید.
          </p>
        </ContentSection>

        <ContentSection title="مشخصات فنی">
          <BadgeCheck className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            ابعاد، جنس قاب، نوع موتور، رنگ صفحه و سایر مشخصات باید با همان مدل هماهنگ باشند.
          </p>
        </ContentSection>

        <ContentSection title="مدارک">
          <ShieldCheck className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            هرگونه کارت، برگه یا مدرک همراه محصول را نگهداری و اطلاعات آن را با سفارش مقایسه کنید.
          </p>
        </ContentSection>
      </div>

      {presentation.kind !== "hidden" ? (
        <ContentSection title="اطلاعات ثبت‌شده">
          <p>{presentation.text}</p>
        </ContentSection>
      ) : null}

      <ContentSection title="چک‌لیست بررسی">
        <PolicyList
          items={[
            "تطبیق نام مدل و شماره مرجع",
            "تطبیق مشخصات فنی با اطلاعات سازنده",
            "بررسی کیفیت چاپ، حکاکی و شماره‌های درج‌شده",
            "نگهداری مدارک سفارش و متعلقات همراه محصول",
          ]}
        />

        <Link
          to="/warranty"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
        >
          شرایط ضمانت
          <ArrowLeft className="size-3.5" aria-hidden="true" />
        </Link>
      </ContentSection>
    </ContentPage>
  );
}
