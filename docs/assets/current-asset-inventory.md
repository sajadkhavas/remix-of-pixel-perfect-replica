# Current Asset Inventory

**Baseline:** `0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c`  
**Count:** 11 raster image assets.  
**License/source status:** در repository metadata هیچ source/license record یافت نشد؛ بنابراین همه موارد تا زمان ارائه سند، **Unverified — not approved for production** هستند.

> Dimensions از header فایل‌ها: JPGها 768×768 و PNGها 800×800. هیچ فایل حذف نشده است.

| Path                        | Type   | Dimensions |      Size | Format | Current usage                                     | Visual quality / duplicate                                     | Crop/mobile suitability                        | License    | Decision                                                | Owner    |
| --------------------------- | ------ | ---------: | --------: | ------ | ------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------- | ---------- | ------------------------------------------------------- | -------- |
| src/assets/watch-1.jpg      | Raster |    768×768 |  38,867 B | JPEG   | Product 1 + Product 9                             | Sharp enough for card; duplicate across Patek/Rolex identities | Square only; poor identity accuracy on mobile  | Unverified | Replace per SKU; keep temporarily                       | F5/Asset |
| src/assets/watch-2.jpg      | Raster |    768×768 |  57,041 B | JPEG   | Product 2                                         | Card-ready, limited zoom detail                                | Square okay; no alternate crop                 | Unverified | Replace with full media set                             | F5/Asset |
| src/assets/watch-3.jpg      | Raster |    768×768 |  57,928 B | JPEG   | Product 3                                         | Card-ready, limited zoom detail                                | Square only                                    | Unverified | Replace with full media set                             | F5/Asset |
| src/assets/watch-4.jpg      | Raster |    768×768 |  54,844 B | JPEG   | Product 4 + Product 11                            | Duplicate across TAG/Casio products                            | Wrong identity risk                            | Unverified | Replace both SKUs                                       | F5/Asset |
| src/assets/watch-5.jpg      | Raster |    768×768 |  47,658 B | JPEG   | Product 5 + Product 12                            | Duplicate across Seiko/Tissot products                         | Wrong identity risk                            | Unverified | Replace both SKUs                                       | F5/Asset |
| src/assets/watch-6.jpg      | Raster |    768×768 |  32,285 B | JPEG   | Product 6 + Product 10                            | Duplicate across Garmin/Apple products                         | Wrong identity risk                            | Unverified | Replace both SKUs                                       | F5/Asset |
| src/assets/watch-7.jpg      | Raster |    768×768 |  52,982 B | JPEG   | Product 7; Classic category; Editorial background | Repeated across commerce/editorial contexts                    | Object-cover editorial crop unsuitable         | Unverified | Keep temporary product only; replace editorial/category | F4/F5/F8 |
| src/assets/watch-8.jpg      | Raster |    768×768 |  38,654 B | JPEG   | Product 8                                         | Card-ready, limited zoom detail                                | Square only                                    | Unverified | Replace with full media set                             | F5/Asset |
| src/assets/watch-luxury.png | Raster |    800×800 | 387,375 B | PNG    | Hero luxury + Luxury category                     | High file cost vs dimensions; reused contexts                  | Transparent/square; object-cover category risk | Unverified | Re-encode/replace; retain until approved                | F4/Asset |
| src/assets/watch-smart.png  | Raster |    800×800 | 240,055 B | PNG    | Hero smart + Smart category                       | Reused contexts; no mobile crop                                | Square transparent; weak full-bleed crop       | Unverified | Re-encode/replace                                       | F4/Asset |
| src/assets/watch-sport.png  | Raster |    800×800 | 673,220 B | PNG    | Hero sport + Sport category                       | Largest asset; high transfer cost                              | Square transparent; object-cover risk          | Unverified | Priority replacement/AVIF-WebP derivative               | F4/Asset |

## Duplicate map

- `watch-1.jpg`: product IDs 1 and 9.
- `watch-4.jpg`: IDs 4 and 11.
- `watch-5.jpg`: IDs 5 and 12.
- `watch-6.jpg`: IDs 6 and 10.
- `watch-7.jpg`: product، category و editorial use.
- Hero PNGها هم‌زمان برای Hero و Category استفاده می‌شوند.

## Keep

همه فایل‌ها فعلاً برای جلوگیری از شکستن imports حفظ می‌شوند. «Keep» به معنی تأیید production نیست.

## Replace priority

1. تصاویر تکراری با identity اشتباه.
2. `watch-sport.png` به‌علت 673KB و نبود crop responsive.
3. تصاویر Hero/Category با فایل اختصاصی desktop/mobile.
4. `watch-7.jpg` در Editorial با تصویر داستانی واقعی.
5. هر محصول با media set کامل.

## Removal gate

حذف تنها وقتی مجاز است که:

- همه importها migrate شده باشند؛
- asset جایگزین در manifest ثبت و license تأیید شده باشد؛
- visual regression و broken-link scan پاس شود؛
- supervisor approval وجود داشته باشد.
