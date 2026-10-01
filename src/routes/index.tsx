import { createFileRoute } from "@tanstack/react-router";

import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CATALOG } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "راهنمای انتخاب و خرید ساعت | KRONOS" },
      {
        name: "description",
        content:
          "مدل‌های ساعت را بر اساس نوع موتور، طراحی، ابعاد و ویژگی‌های فنی بررسی کنید و تفاوت‌ها را روشن ببینید.",
      },
      { property: "og:title", content: "راهنمای انتخاب و خرید ساعت | KRONOS" },
      {
        property: "og:description",
        content: "ساعت مناسب را با بررسی مشخصات، کاربرد و تفاوت مدل‌ها انتخاب کنید.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts watches={CATALOG.slice(0, 4)} />
      <ServicesSection />
      <EditorialSection />
    </main>
  );
}
