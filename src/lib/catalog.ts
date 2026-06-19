import type { Watch } from "@/components/ui/ProductCard";
import w1 from "@/assets/watch-1.jpg";
import w2 from "@/assets/watch-2.jpg";
import w3 from "@/assets/watch-3.jpg";
import w4 from "@/assets/watch-4.jpg";
import w5 from "@/assets/watch-5.jpg";
import w6 from "@/assets/watch-6.jpg";
import w7 from "@/assets/watch-7.jpg";
import w8 from "@/assets/watch-8.jpg";

export const CATALOG: Watch[] = [
  { id: 1, name: "ناتیلوس ۵۷۱۱ مرجع آبی", brand: "Patek Philippe", price: 4800000000, image: w1, category: "luxury", caseMaterial: "استیل", waterResistance: "120m", stock: 2, rating: 5, review_count: 84, isLimited: true },
  { id: 2, name: "سی‌مستر دایور ۳۰۰", brand: "Omega", price: 320000000, sale_price: 285000000, image: w2, category: "luxury", caseMaterial: "استیل", waterResistance: "300m", stock: 8, rating: 5, review_count: 142, isNew: true },
  { id: 3, name: "رویال اوک ۴۱ میلی‌متر", brand: "Audemars Piguet", price: 5200000000, image: w3, category: "luxury", caseMaterial: "تیتانیوم", waterResistance: "50m", stock: 1, rating: 5, review_count: 56, isLimited: true },
  { id: 4, name: "کاررا کرونوگراف اسپرت", brand: "TAG Heuer", price: 245000000, image: w4, category: "sport", caseMaterial: "استیل", waterResistance: "200m", stock: 12, rating: 4, review_count: 210 },
  { id: 5, name: "پرساژ کلاسیک اتوماتیک", brand: "Seiko", price: 38000000, sale_price: 32000000, image: w5, category: "classic", caseMaterial: "استیل", waterResistance: "100m", stock: 24, rating: 4, review_count: 318, isNew: true },
  { id: 6, name: "فنیکس ۷ پرو سولار", brand: "Garmin", price: 92000000, image: w6, category: "smart", caseMaterial: "پلیمر", waterResistance: "100m", stock: 6, rating: 5, review_count: 421 },
  { id: 7, name: "مستر کالکشن فاز ماه", brand: "Longines", price: 165000000, image: w7, category: "classic", caseMaterial: "استیل", waterResistance: "30m", stock: 4, rating: 5, review_count: 92 },
  { id: 8, name: "تانک فرانسیس الماس", brand: "Cartier", price: 1850000000, image: w8, category: "luxury", caseMaterial: "طلا ۱۸ع", waterResistance: "30m", stock: 0, rating: 5, review_count: 38, isLimited: true },
  { id: 9, name: "ساب‌مارینر دیت", brand: "Rolex", price: 2200000000, image: w1, category: "luxury", caseMaterial: "استیل", waterResistance: "300m", stock: 3, rating: 5, review_count: 128, isLimited: true },
  { id: 10, name: "اپل واچ سری ۱۰", brand: "Apple", price: 48000000, sale_price: 42000000, image: w6, category: "smart", caseMaterial: "آلومینیوم", waterResistance: "50m", stock: 30, rating: 5, review_count: 612, isNew: true },
  { id: 11, name: "G-Shock GA-2100", brand: "Casio", price: 9500000, image: w4, category: "sport", caseMaterial: "رزین", waterResistance: "200m", stock: 50, rating: 4, review_count: 980 },
  { id: 12, name: "هرتیج کالکشن ۱۹۴۵", brand: "Tissot", price: 22000000, image: w5, category: "classic", caseMaterial: "استیل", waterResistance: "50m", stock: 14, rating: 4, review_count: 145 },
];

export const CATEGORIES = [
  { slug: "luxury", name: "ساعت لوکس", desc: "شاهکارهای ساعت‌سازی سوئیسی", color: "#C9A84C", brands: ["Rolex", "Omega", "Patek Philippe"] },
  { slug: "sport", name: "ساعت اسپرت", desc: "مقاوم، دقیق، ماجراجو", color: "#5A8A3C", brands: ["G-Shock", "Seiko", "Citizen"] },
  { slug: "smart", name: "ساعت هوشمند", desc: "اتصال و سلامتی روی مچت", color: "#3A7CA8", brands: ["Apple", "Samsung", "Garmin"] },
  { slug: "classic", name: "ساعت کلاسیک", desc: "جاودانه و بی‌نقص", color: "#8A6A3C", brands: ["Tissot", "Longines", "Hamilton"] },
] as const;

export const BRANDS = [
  { slug: "rolex", name: "Rolex", tagline: "تاج ساعت‌سازی" },
  { slug: "omega", name: "Omega", tagline: "ساعت سفر به ماه" },
  { slug: "patek-philippe", name: "Patek Philippe", tagline: "میراث خانوادگی" },
  { slug: "audemars-piguet", name: "Audemars Piguet", tagline: "هنر مکانیک" },
  { slug: "tag-heuer", name: "TAG Heuer", tagline: "دقت در سرعت" },
  { slug: "cartier", name: "Cartier", tagline: "جواهر زمان" },
  { slug: "longines", name: "Longines", tagline: "ظرافت کلاسیک" },
  { slug: "tissot", name: "Tissot", tagline: "سوئیسی اصیل" },
  { slug: "seiko", name: "Seiko", tagline: "نوآوری ژاپنی" },
  { slug: "casio", name: "Casio", tagline: "G-Shock افسانه‌ای" },
  { slug: "apple", name: "Apple", tagline: "آینده روی مچ" },
  { slug: "garmin", name: "Garmin", tagline: "ماجراجویی هوشمند" },
];

export function getById(id: number) {
  return CATALOG.find((w) => w.id === id);
}
export function getByCategory(slug: string) {
  return CATALOG.filter((w) => w.category === slug);
}
export function getByBrand(slug: string) {
  return CATALOG.filter((w) => w.brand.toLowerCase().replace(/\s+/g, "-") === slug);
}
