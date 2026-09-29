import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileCheck2, ShieldCheck, Wrench } from "lucide-react";

import {
  ContentPage,
  ContentSection,
  PolicyList,
  SupportLinks,
} from "@/components/content/PolicyPage";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";
import { resolveClaimPresentation } from "@/domain/store-settings";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "ضمانت | KRONOS" },
      {
        name: "description",
        content: "راهنمای بررسی شرایط ضمانت محصولات در KRONOS.",
      },
    ],
  }),
  component: WarrantyPage,
});

function WarrantyPage() {
  const settings = usePublicStoreSettings();
  const presentation = resolveClaimPresentation(settings.warranty.presentationClaim);

  return (
    <ContentPage
      eyebrow="WARRANTY"
      title="ضمانت و خدمات پس از خرید"
      intro="نوع، مدت و پوشش ضمانت برای هر محصول می‌تواند متفاوت باشد. اطلاعات معتبر همان مدل یا سفارش مبنای بررسی است."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <ContentSection title="مدرک ضمانت">
          <FileCheck2 className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            هر مدرک یا کارت ضمانت همراه محصول را تا پایان دوره مربوط نگهداری کنید.
          </p>
        </ContentSection>

        <ContentSection title="پوشش">
          <ShieldCheck className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            پوشش ضمانت فقط در محدوده‌ای معتبر است که برای همان مدل یا سفارش به‌صورت مشخص اعلام شده باشد.
          </p>
        </ContentSection>

        <ContentSection title="بررسی فنی">
          <Wrench className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            در صورت بروز مشکل، ابتدا مدل، شماره مرجع، شرح ایراد و مدارک سفارش بررسی می‌شوند.
          </p>
        </ContentSection>
      </div>

      {presentation.kind !== "hidden" ? (
        <ContentSection title="اطلاعات ضمانت">
          <p>{presentation.text}</p>
        </ContentSection>
      ) : null}

      <ContentSection title="برای پیگیری آماده کنید">
        <PolicyList
          items={[
            "شماره سفارش و نام دقیق مدل",
            "تصویر یا ویدئوی واضح از ایراد در صورت امکان",
            "کارت یا مدرک ضمانت همراه محصول، در صورت وجود",
            "توضیح کوتاه درباره زمان و نحوه بروز مشکل",
          ]}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/authenticity"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
          >
            راهنمای اصالت
            <ArrowLeft className="size-3.5" aria-hidden="true" />
          </Link>
          <SupportLinks />
        </div>
      </ContentSection>
    </ContentPage>
  );
}
