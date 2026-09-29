import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { HeroSection } from "@/components/sections/HeroSection";
import { BrandsMarquee } from "@/components/sections/BrandsMarquee";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";

const ServicesSection = lazy(() =>
  import("@/components/sections/ServicesSection").then((module) => ({
    default: module.ServicesSection,
  })),
);

const EditorialSection = lazy(() =>
  import("@/components/sections/EditorialSection").then((module) => ({
    default: module.EditorialSection,
  })),
);

const TestimonialsSection = lazy(() =>
  import("@/components/sections/TestimonialsSection").then((module) => ({
    default: module.TestimonialsSection,
  })),
);

const NewsletterSection = lazy(() =>
  import("@/components/sections/NewsletterSection").then((module) => ({
    default: module.NewsletterSection,
  })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "کرونوس — فروشگاه ساعت | KRONOS" },
      {
        name: "description",
        content:
          "کالکشن ساعت‌های لوکس، اسپرت، کلاسیک و هوشمند KRONOS را مرور و مقایسه کنید.",
      },
      { property: "og:title", content: "کرونوس — فروشگاه ساعت" },
      {
        property: "og:description",
        content: "کالکشن‌های منتخب ساعت در KRONOS.",
      },
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
      <FeaturedProducts />

      <Suspense fallback={<div className="h-96 bg-[#08090B]" aria-hidden="true" />}>
        <ServicesSection />
        <EditorialSection />
        <TestimonialsSection />
        <NewsletterSection />
      </Suspense>
    </>
  );
}
