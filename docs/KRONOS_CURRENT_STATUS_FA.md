# وضعیت فعلی پروژه KRONOS
تاریخ ثبت: 2026-09-30

## منبع معتبر برای ادامه
- فایل‌های فعلی پروژه در VS Code کاربر، منبع اصلی هستند.
- فایل‌های قدیمی GitHub نباید جای نسخه محلی فرض شوند.
- پیش از تغییر، AGENTS.md و این سند خوانده شوند.
- دامنه: https://kronos.testwebs.ir/
- مخزن: https://github.com/sajadkhavas/remix-of-pixel-perfect-replica
- شاخه فعلی: hotfix/kronos-ssr-image-urls-20260929

## مرحله پروژه
طراحی و اصلاحات فرانت‌اند انجام و نسخه اولیه فریز و روی سرور مستقر شد.
سپس مشکل آدرس تصاویر در SSR اصلاح شد.
کاربر در 2026-09-30 درست شدن نمایش تصاویر را تأیید کرد.
اصلاح تصاویر در GitHub push شده است.
merge این شاخه به شاخه اصلی تأیید نشده است.
این وضعیت به معنی پذیرش کامل بک‌اند، پرداخت یا تمام قابلیت‌های فروشگاه نیست.

## نسخه‌ها
- نسخه فریز اولیه:
  820184d25694c4270c52ac9126084de52ab54d04
- تگ اولیه:
  kronos-final-2026-09-29
- commit اصلاح تصاویر:
  132f1fc96068c3826e2953ebb142f8ac5723ba29
- تگ جدید:
  kronos-freeze-2026-09-30
- تگ جدید روی commit مستندات پس از commit اصلاح تصاویر قرار می‌گیرد.
- commit مستندات با commit کد مستقرشده متفاوت است.

## اصلاح تصاویر
۱۷ import تصویر در ۷ فایل به مسیرهای عمومی /media تبدیل شد:
- src/components/sections/EditorialSection.tsx
- src/components/sections/HeroSection.tsx
- src/components/sections/NewsletterSection.tsx
- src/data/fixtures/brands.ts
- src/data/fixtures/categories.ts
- src/data/fixtures/products.ts
- src/routes/blog.tsx

تصاویر در public/media قرار گرفتند و داخل dist/client/media ساخته شدند.
خواندن و نوشتن فایل‌ها با UTF-8 صریح انجام شد.

## بازیابی encoding
اسکریپت اولیه PowerShell بسیاری از فایل‌های src و متن فارسی را خراب کرد.
قبل از بازیابی، نسخه پشتیبان ایجاد شد:
C:\Users\sajad\Desktop\kronos-image-recovery-20260929-182302

src از commit فریز اولیه بازیابی شد.
سپس اصلاح محدود ۷ فایل اجرا شد.
تغییرات خراب اولیه وارد commit اصلاح تصاویر نشدند.

## بررسی‌های موفق
- npm run build
- npm run typecheck
- git diff --check
- اجرای محلی build با Vite preview روی 127.0.0.1:4187
- صفحه محلی: HTTP 200
- مسیر /media/hero-kronos-bg.webp در HTML خروجی SSR موجود بود.
- عکس هیرو: HTTP 200 و image/webp
- آدرس file:/// یا C:/Users/ در HTML بررسی‌شده نبود.
- canary سرور روی 127.0.0.1:18111:
  صفحه اصلی، PDP، عکس هیرو و عکس محصول HTTP 200 داشتند.
- پس از فعال‌سازی:
  صفحه محلی و دو عکس از دامنه عمومی HTTP 200 داشتند.
- Xray و Caddy فعال و edge.testwebs.ir پاسخ 200 داشت.

## نکته درباره پذیرش نهایی سرور
بعد از خاموش کردن canary، آخرین خروجی ارسال‌شده برای عکس هیرو HTTP 404 بود.
پس از آن کاربر اعلام کرد «اوکی شد».
خروجی تشخیص یا اصلاح نهایی این 404 در این گفتگو ارسال نشده است.
بنابراین نمایش درست تصاویر با تأیید کاربر ثبت شده؛
علت دقیق آن 404 و وضعیت نهایی HTTP مستقل از canary مستند نشده است.
چت بعدی نباید برای آن علت ساختگی یا تغییر سروری تأییدنشده بنویسد.

## سرور و محدودیت‌ها
- IP: 23.254.229.11
- سیستم: Ubuntu 24.04
- سرور مشترک با VPN است؛ حفظ VPN الزامی است.
- سرویس سایت: kronos.service
- سرویس VPN: xray
- reverse proxy مشترک: caddy
- پورت سرویس اصلی KRONOS: 127.0.0.1:18110
- canary موقت: kronos-image-canary.service روی 18111
- دستور توقف canary اجرا شده است.
- runtime Node و srvx در /opt/kronos/runtime قرار دارند.
- مسیر current گزارش‌شده:
  /opt/kronos/current
- آخرین release فعال گزارش‌شده:
  /opt/kronos/releases/132f1fc96068c3826e2953ebb142f8ac5723ba29

## وابستگی مهم release
node_modules نسخه جدید به node_modules نسخه قبلی لینک شده است:
/opt/kronos/releases/820184d25694c4270c52ac9126084de52ab54d04/node_modules

نسخه قبلی نباید در پاکسازی حذف شود.
پیش از مستقل کردن وابستگی‌ها، ساختار واقعی سرور بررسی شود.
تنظیمات Xray یا Caddy بدون نیاز مشخص تغییر نکنند.

## معماری محصول
- Domain محصول directory است: src/domain/product/index.ts
- PDP بر اساس Product Domain جدید ادامه یابد.
- src/lib/catalog.ts Legacy نباید معماری اصلی PDP باشد.
- اگر interface فایل دیگری لازم است، نسخه فعلی محلی آن از کاربر دریافت شود.

## قدم بعدی چت جدید
۱. AGENTS.md و این سند را بخوان.
۲. git status، شاخه و HEAD محلی را بررسی کن.
۳. اگر کار سروری مطرح شد، current، سرویس اصلی، وضعیت canary و HTTP عکس‌ها
   را مستقل از canary بررسی کن.
۴. قبل از تغییرات جدید، وضعیت فریز را حفظ و شاخه کاری جدا بساز.
۵. تغییرات ابتدا محلی آزمایش شوند، سپس release جدا با امکان rollback ساخته شود.
۶. برای تغییر موضوع برند به کاسیو، محصول‌ها، دسته‌بندی‌ها، تصاویر و رنگ‌ها
   باید در نسخه جدا تغییر کنند؛ نسخه KRONOS حفظ شود.