# Responsive Art Direction

اصل: mobile نسخه کوچک‌شده desktop نیست؛ composition، crop، content order و motion مستقل دارد.

| بخش            | Desktop composition                | Tablet adaptation  | Mobile composition                    | حذف/کوتاه‌سازی               | Reorder / crop               | Motion / touch                          |
| -------------- | ---------------------------------- | ------------------ | ------------------------------------- | ---------------------------- | ---------------------------- | --------------------------------------- |
| Header         | logo + nav + utility actions       | nav condensed      | 56–64px header + menu/search/cart     | announcement optional        | logical-end drawer           | no hover dependency؛ 44px targets       |
| Mega Menu      | structured columns + featured link | 2 columns          | accordion/drill-down                  | campaign tile حذف            | DOM reading order فارسی      | fade/slide 180–240ms؛ focus trap        |
| Search         | full overlay or wide command panel | full width         | full-screen search                    | decorative media حذف         | input first، results بعد     | keyboard safe؛ clear 44px               |
| Hero           | two-zone text/media                | tighter 5/3 split  | media 4:5 سپس concise copy/CTA        | secondary CTA/badge optional | dedicated mobile crop        | static/reveal؛ autoplay off by default  |
| Categories     | 4-card grid/editorial              | 2×2                | horizontal rail یا stack              | brand chips کوتاه            | focal crop independent       | swipe + controls؛ no hover-only         |
| Product grid   | 4 columns + sidebar                | 3 columns          | 2 columns؛ 1 at narrow                | specs chips کم               | controls above grid          | filter drawer؛ touch cards              |
| Product detail | gallery 7/12 + sticky buy 5/12     | stack or 5/3       | gallery > title/price > CTA > details | long editorial below fold    | primary media mobile crop    | swipe gallery؛ sticky buy bar           |
| Gallery        | thumbnails + primary + detail grid | rail thumbnails    | swipe + visible counter/thumbnails    | parallax/zoom hover حذف      | focal point per asset        | pinch/zoom optional accessible controls |
| Filters        | persistent sidebar                 | drawer/panel       | bottom/full-height drawer             | rare facets collapsed        | applied chips before results | native controls؛ Apply + Clear          |
| Cart drawer    | 420–480px inline-end               | same               | full width or 92vw                    | cross-sell محدود             | item > summary > CTA         | focus trap، swipe not sole close        |
| Compare        | table with sticky product headers  | horizontal columns | 2-product horizontal table            | decorative specs حذف         | differences first toggle     | drag not required؛ scroll affordance    |
| Editorial      | asymmetric media/text              | 5/3 or stack       | single column                         | pull quote/media count کم    | reading order DOM            | parallax removed؛ static chapter        |
| Footer         | 4–5 columns + newsletter           | 2–3 columns        | accordions + legal                    | placeholder/promos حذف       | support/contact first        | tap targets؛ bottom-bar clearance       |

## Text shortening priorities

1. محصول/قیمت/CTA هرگز حذف نمی‌شوند.
2. eyebrow و decorative tagline اولین موارد حذف هستند.
3. subtitle hero mobile حداکثر 90 کاراکتر.
4. ProductCard specs در mobile حداکثر یک factual chip.
5. Trust copy به لینک policy کوتاه تبدیل می‌شود.

## Safe areas

- bottom fixed UI با `env(safe-area-inset-bottom)`.
- hero و full-screen overlays با dynamic viewport units و keyboard state.
- sticky CTA در landscape phone باید collapse یا inline شود.
- 320px width بدون horizontal page scroll؛ carouselها affordance واضح دارند.
