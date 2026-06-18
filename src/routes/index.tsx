import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandsMarquee } from "@/components/sections/BrandsMarquee";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { Footer } from "@/components/layout/Footer";
import type { Watch } from "@/components/ui/ProductCard";
import { initLenis } from "@/lib/lenis";

import w1 from "@/assets/watch-1.jpg";
import w2 from "@/assets/watch-2.jpg";
import w3 from "@/assets/watch-3.jpg";
import w4 from "@/assets/watch-4.jpg";
import w5 from "@/assets/watch-5.jpg";
import w6 from "@/assets/watch-6.jpg";
import w7 from "@/assets/watch-7.jpg";
import w8 from "@/assets/watch-8.jpg";

const FEATURED: Watch[] = [
  { id: 1, name: "ناتیلوس ۵۷۱۱ مرجع آبی", brand: "Patek Philippe", price: 4800000000, image: w1, category: "luxury", caseMaterial: "استیل", waterResistance: "120m", stock: 2, rating: 5, review_count: 84, isLimited: true },
  { id: 2, name: "سی‌مستر دایور ۳۰۰", brand: "Omega", price: 320000000, sale_price: 285000000, image: w2, category: "luxury", caseMaterial: "استیل", waterResistance: "300m", stock: 8, rating: 5, review_count: 142, isNew: true },
  { id: 3, name: "رویال اوک ۴۱ میلی‌متر", brand: "Audemars Piguet", price: 5200000000, image: w3, category: "luxury", caseMaterial: "تیتانیوم", waterResistance: "50m", stock: 1, rating: 5, review_count: 56, isLimited: true },
  { id: 4, name: "کاررا کرونوگراف اسپرت", brand: "TAG Heuer", price: 245000000, image: w4, category: "sport", caseMaterial: "استیل", waterResistance: "200m", stock: 12, rating: 4, review_count: 210 },
  { id: 5, name: "پرساژ کلاسیک اتوماتیک", brand: "Seiko", price: 38000000, sale_price: 32000000, image: w5, category: "classic", caseMaterial: "استیل", waterResistance: "100m", stock: 24, rating: 4, review_count: 318, isNew: true },
  { id: 6, name: "فنیکس ۷ پرو سولار", brand: "Garmin", price: 92000000, image: w6, category: "smart", caseMaterial: "پلیمر", waterResistance: "100m", stock: 6, rating: 5, review_count: 421 },
  { id: 7, name: "مستر کالکشن فاز ماه", brand: "Longines", price: 165000000, image: w7, category: "classic", caseMaterial: "استیل", waterResistance: "30m", stock: 4, rating: 5, review_count: 92 },
  { id: 8, name: "تانک فرانسیس الماس", brand: "Cartier", price: 1850000000, image: w8, category: "luxury", caseMaterial: "طلا ۱۸ع", waterResistance: "30m", stock: 0, rating: 5, review_count: 38, isLimited: true },
];

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
      {
        property: "og:description",
        content: "ساعت‌های اورجینال با ضمانت اصالت و ارسال امن.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useEffect(() => {
    initLenis();
  }, []);

  return (
    <div className="bg-[#080808] min-h-screen overflow-x-hidden" dir="rtl" lang="fa">
      <Navbar />
      <HeroSection />
      <BrandsMarquee />
      <CategoriesSection />
      <FeaturedProducts watches={FEATURED} />
      <ServicesSection />
      <EditorialSection />
      <Footer />
    </div>
  );
}
