# Asset Naming Convention

## فرمت

`{type}-{subject}-{variant-or-view}-{breakpoint}-{index}-v{version}.{format}`

بخش‌های غیرلازم حذف می‌شوند، اما ترتیب حفظ می‌شود.

## قواعد

- lowercase
- kebab-case
- بدون فاصله، underscore، تاریخ مبهم یا `final-final`
- ASCII برای نام فایل؛ متن فارسی در metadata
- type مشخص: `hero`, `product`, `category`, `brand`, `editorial`, `icon`, `texture`
- subject پایدار و slug-based
- view: `front`, `three-quarter`, `side`, `back`, `clasp`, `wrist`, `movement`, `packaging`
- breakpoint: `desktop`, `tablet`, `mobile` فقط وقتی فایل واقعاً crop مستقل دارد
- index دو رقمی برای sequence: `01`
- version عددی: `v1`
- format بر اساس delivery؛ نه master source

## نمونه‌ها

- `hero-men-automatic-desktop-01-v1.avif`
- `hero-men-automatic-mobile-01-v1.avif`
- `product-rolex-submariner-126610ln-front-01-v1.avif`
- `product-omega-seamaster-diver-300m-caseback-01-v1.webp`
- `brand-omega-heritage-editorial-01-v1.webp`
- `category-classic-watch-mobile-01-v1.avif`
- `editorial-movement-finishing-macro-02-v1.avif`

## Product subject

`{brand}-{family}-{reference}`؛ reference در صورت نبود با SKU داخلی جایگزین:
- `product-seiko-presage-srpb41-front-01-v1.avif`
- `product-kronos-sku-0042-front-01-v1.avif`

## ممنوع

- `watch-1.jpg`
- `new.png`
- `hero-final2.png`
- نام برند اشتباه یا مدل حدسی
- breakpoint در نام بدون crop مستقل
- استفاده از `luxury` به‌عنوان subject مبهم product

## Metadata لازم در manifest

`id`, `path`, `role`, `subject`, `view`, `breakpoint`, `width`, `height`, `bytes`, `format`, `focalPoint`, `source`, `license`, `licenseStatus`, `altIntent`, `owner`, `status`, `replaces`, `version`.
