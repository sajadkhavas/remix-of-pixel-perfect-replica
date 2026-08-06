# Image Ratio Matrix

| Component               | Aspect ratio |    Recommended source |   Minimum | Object fit            | Focal point               | Mobile alternative            | Priority                       | Format               |
| ----------------------- | -----------: | --------------------: | --------: | --------------------- | ------------------------- | ----------------------------- | ------------------------------ | -------------------- |
| Hero desktop            | 16:9 یا 21:9 | 2560×1440 / 2880×1280 | 1920 wide | cover                 | product 60–72% inline-end | required 4:5 crop             | LCP eager/high                 | AVIF + WebP fallback |
| Hero tablet             | 4:3 یا 16:10 |             1600×1200 |  1280×960 | cover                 | centered-end              | mobile crop if text collision | high                           | AVIF/WebP            |
| Hero mobile             |          4:5 |             1200×1500 |  800×1000 | cover                 | top-center/product safe   | dedicated                     | LCP eager                      | AVIF/WebP            |
| Product card            |          1:1 |             1200×1200 |   800×800 | contain               | center                    | same source via srcset        | lazy except first row strategy | AVIF/WebP            |
| Product gallery primary |   1:1 یا 4:5 |             2000×2000 | 1400×1400 | contain               | center                    | 1:1 preferred                 | first eager                    | AVIF/WebP/JPEG       |
| Gallery detail          |          1:1 |             1800×1800 | 1200×1200 | cover/contain by view | metadata                  | same                          | lazy                           | AVIF/WebP            |
| Quick View              |          1:1 |             1200×1200 |   800×800 | contain               | center                    | same                          | on demand                      | WebP/AVIF            |
| Category card           |          3:4 |             1200×1600 |  800×1067 | cover                 | subject upper-middle      | dedicated 4:5 optional        | lazy                           | AVIF/WebP            |
| Brand card              |          4:3 |              1200×900 |   800×600 | cover                 | center                    | 1:1 if needed                 | lazy                           | AVIF/WebP            |
| Magazine card           |          4:3 |             1600×1200 |  1000×750 | cover                 | editorial metadata        | 4:5 crop                      | lazy                           | AVIF/WebP            |
| Article hero            |         16:9 |             2400×1350 |  1600×900 | cover                 | story-specific            | 4:5 dedicated                 | high                           | AVIF/WebP            |
| Search result           |          1:1 |               800×800 |   480×480 | contain               | center                    | same                          | lazy                           | WebP/AVIF            |
| Recently viewed         |          1:1 |               800×800 |   480×480 | contain               | center                    | same                          | lazy                           | WebP/AVIF            |
| Cart thumbnail          |          1:1 |               400×400 |   240×240 | contain               | center                    | same                          | high for cart list             | WebP                 |
| Wishlist thumbnail      |          1:1 |               800×800 |   480×480 | contain               | center                    | same                          | lazy                           | WebP/AVIF            |
| Compare product         |          1:1 |             1000×1000 |   640×640 | contain               | consistent scale          | same                          | eager visible columns          | WebP/AVIF            |

## قواعد delivery

- `width` و `height` همیشه برای جلوگیری از CLS.
- responsive `srcset/sizes` بر اساس slot واقعی.
- AVIF برای photo delivery با WebP/JPEG fallback پس از visual QA.
- SVG فقط icon/diagram؛ نه عکس raster جاسازی‌شده.
- preload فقط یک LCP candidate.
- animated image برای product ممنوع؛ video control جداگانه.
- focal point درصدی در manifest؛ CSS object-position از metadata.
