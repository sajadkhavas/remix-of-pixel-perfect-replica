# بازطراحی کامل KRONOS — سطح برترین فروشگاه‌های ساعت دنیا

## ۱) الهام از بهترین‌های صنعت
بنچ‌مارک‌ها (جستجو و تحلیل قبل از اجرا):
- **Hodinkee Shop** — تایپوگرافی ادیتوریال، شبکه محصول تمیز
- **Watches of Switzerland** — هیرو ویدیویی، فیلتر پیشرفته، PDP لوکس
- **A. Lange & Söhne / Patek Philippe** — حرکت سینمایی، اسکرول روایی
- **Bucherer / Chrono24** — هدر چندسطحی مگامنو، اعتمادسازی
- **MR PORTER Watches** — گرید مدرن، میکرواینتراکشن‌های ظریف
- **Hublot / Hublot Loves Art** — افکت‌های GSAP و WebGL سبک

عناصر منتخب: مگامنو با پیش‌نمایش، هیرو پارالاکس تصویری (به جای ویدیو سنگین)، کارت محصول با hover-reveal، اسکرول افقی کالکشن، نوار اعتماد، فوتر چندستونه با خبرنامه.

## ۲) بهبود سرعت (بدون حذف انیمیشن‌ها)
- تبدیل تصاویر به **AVIF/WebP** با `vite-imagetools` + `loading="lazy"` + `decoding="async"` + `width/height` صریح
- **preload** فقط روی تصویر LCP هیرو
- بارگذاری تنبل سکشن‌های پایین صفحه با `React.lazy` + `Suspense`
- GSAP فقط برای سکشن‌های ضروری؛ Lenis با تنظیمات سبک‌تر؛ حذف `ParticlesBackground` در موبایل
- `prefers-reduced-motion` رعایت شود
- آپلود تصاویر سنگین به CDN لاوبل (`lovable-assets`)

## ۳) ساخت همه صفحات (TanStack routes)
```
src/routes/
  index.tsx              صفحه اصلی (بازطراحی)
  shop.tsx               فروشگاه با فیلتر/مرتب‌سازی/گرید
  shop.$category.tsx     دسته (luxury, sport, smart, classic)
  product.$id.tsx        صفحه محصول (گالری، مشخصات، CTA، مرتبط‌ها)
  brands.tsx             لیست برندها
  brands.$slug.tsx       صفحه برند
  about.tsx              درباره
  services.tsx           خدمات (تعمیر/اصالت‌سنجی/تحویل)
  contact.tsx            تماس
  blog.tsx               مجله
  blog.$slug.tsx         مقاله
  cart.tsx               سبد خرید
  wishlist.tsx           علاقه‌مندی
  auth.tsx               ورود/ثبت‌نام (UI فعلاً)
  faq.tsx                سوالات
  privacy.tsx / terms.tsx
```
هر روت `head()` اختصاصی (title/description/og) دارد. تمام دکمه‌ها با `<Link>` کار می‌کنند.

## ۴) هدر و فوتر نسخه جدید
**Navbar:** sticky شیشه‌ای، لوگو وسط در دسکتاپ، مگامنو با تصویر برند، آیکن‌های جستجو/علاقه/سبد/کاربر، نوار اعلان بالا، **منوی موبایل تمام‌صفحه با drawer** و آکاردئون دسته‌ها.
**Footer:** ۴ ستون (دسته‌ها، خدمات، شرکت، تماس) + فرم خبرنامه + نمادهای پرداخت/اعتماد + شبکه‌های اجتماعی + نسخه دوزبانه.

## ۵) دسته‌بندی با تصویر (نه آیکن)
کارت‌های دسته با **تصاویر واقعی ساعت** (تولید با imagegen، آپلود به CDN). hover روی کارت = زوم نرم + اوورلی متن.

## ۶) موبایل و ریسپانسیو حرفه‌ای
- breakpointهای `sm/md/lg/xl/2xl` همه‌جا
- گرید: ۱→۲→۳→۴ ستونه
- تایپوگرافی سیال با `clamp()`
- تب‌بار پایین موبایل (Home/Shop/Wishlist/Cart/Account)
- لمس‌محور: تارگت ≥44px، سواپ افقی برای گالری‌ها
- هدر موبایل کوتاه با drawer
- تست در ۳۷۵، ۷۶۸، ۱۰۲۴، ۱۴۴۰

## ۷) State سراسری
`CartContext` و `WishlistContext` با `localStorage` تا دکمه‌های «افزودن به سبد/علاقه» در همه‌جا کار کنند. شمارنده روی آیکن‌های هدر.

## جزئیات فنی
- Stack: TanStack Start + Tailwind v4 + GSAP + Lenis + framer-motion (سبک)
- توکن‌های رنگ/فونت در `src/styles.css` (طلایی + مشکی موجود حفظ می‌شود)
- فونت فارسی: **Vazirmatn** (heading: Estedad یا همان Vazirmatn وزن سنگین) از طریق `<link>` در `__root.tsx`
- داده محصولات: فعلاً ثابت در `src/lib/catalog.ts` (یک منبع برای همه روت‌ها)
- بدون نیاز به Cloud در این مرحله؛ اگر بعداً ثبت سفارش/ورود واقعی خواستید، Lovable Cloud فعال می‌شود

## خروجی مرحله‌ای
1. Catalog مرکزی + Cart/Wishlist context
2. Navbar + Footer جدید + منوی موبایل + تب‌بار
3. بازطراحی Home (هیرو سبک‌تر، کالکشن افقی، دسته‌های تصویری، مجله)
4. ساخت صفحات shop / product / brand / about / services / contact / blog / cart / wishlist / auth / faq
5. بهینه‌سازی تصاویر + lazy sections + reduced-motion
6. تست ریسپانسیو در ۴ سایز

این پلن سنگین است اما در یک نوبت build اجرا می‌شود. آیا تأیید می‌کنید شروع کنم؟