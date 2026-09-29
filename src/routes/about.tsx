import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Layers3, SearchCheck } from "lucide-react";

import {
  ContentPage,
  ContentSection,
} from "@/components/content/PolicyPage";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "درباره KRONOS" },
      {
        name: "description",
        content:
          "درباره رویکرد KRONOS به انتخاب، بررسی و مقایسه ساعت.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const settings = usePublicStoreSettings();
  const brandName = settings.brand.localizedName ?? settings.brand.name;

  return (
    <ContentPage
      eyebrow="ABOUT KRONOS"
      title={brandName}
      intro="KRONOS فضایی برای کشف ساعت‌ها بر اساس طراحی، مشخصات و سبک استفاده است؛ از مدل‌های کلاسیک و لوکس تا ساعت‌های اسپرت و هوشمند."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <ContentSection title="کشف">
          <Compass className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            دسته‌بندی، برند و فیلترهای فروشگاه کمک می‌کنند سریع‌تر به مدل‌های نزدیک به سلیقه خود برسید.
          </p>
        </ContentSection>

        <ContentSection title="بررسی">
          <SearchCheck className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            صفحه هر محصول روی مشخصات مهم، واریانت‌ها، تصاویر و جزئیات قابل مقایسه تمرکز دارد.
          </p>
        </ContentSection>

        <ContentSection title="انتخاب">
          <Layers3 className="size-5 text-[#C9A84C]" aria-hidden="true" />
          <p>
            علاقه‌مندی‌ها و سبد خرید مسیر انتخاب چند مدل و بازگشت دوباره به آن‌ها را ساده می‌کنند.
          </p>
        </ContentSection>
      </div>

      <ContentSection title="چهار مسیر اصلی">
        <p>
          کالکشن KRONOS حول چهار سبک اصلی لوکس، اسپرت، کلاسیک و هوشمند سازمان‌دهی شده است.
          هر دسته مسیر مستقل خود را در فروشگاه دارد.
        </p>
      </ContentSection>

      <ContentSection title="شروع کنید">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
          >
            مشاهده فروشگاه
            <ArrowLeft className="size-3.5" aria-hidden="true" />
          </Link>

          <Link
            to="/brands"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] px-4 text-sm font-semibold text-[#DAD3C9] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C]"
          >
            مشاهده برندها
            <ArrowLeft className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
