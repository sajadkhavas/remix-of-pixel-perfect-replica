import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandsMarquee } from "@/components/sections/BrandsMarquee";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { CATALOG } from "@/lib/catalog";

const ServicesSection = lazy(() =>
  import("@/components/sections/ServicesSection").then((m) => ({ default: m.ServicesSection })),
);
const EditorialSection = lazy(() =>
  import("@/components/sections/EditorialSection").then((m) => ({ default: m.EditorialSection })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "کرونوس — فروشگاه ساعت لوکس | KRONOS" },
      {
        name: "description",
        content:
          "مرجع تخصصی ساعت‌های لوکس، اسپرت و هوشمند: Rolex، Omega، Patek Philippe، G-Shock، Apple Watch با ضمانت اصالت.",
      },
      { property: "og:title", content: "کرونوس — فروشگاه ساعت لوکس" },
      { property: "og:description", content: "ساعت‌های اورجینال با ضمانت اصالت و ارسال امن." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandsMarquee />
      <CategoriesSection />
      <FeaturedProducts watches={CATALOG.slice(0, 8)} />
      <Suspense fallback={<div className="h-96" />}>
        <ServicesSection />
        <EditorialSection />
      </Suspense>
    </>
  );
}
