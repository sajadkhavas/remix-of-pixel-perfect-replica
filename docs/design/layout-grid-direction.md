# Layout and Grid Direction

## Containers

| سطح        | Max width | کاربرد                      |
| ---------- | --------: | --------------------------- |
| Compact    |     720px | FAQ، legal، auth، long form |
| Content    |     960px | article، about narrative    |
| Commerce   |    1280px | shop، cart، account         |
| Wide       |    1440px | homepage/product gallery    |
| Full bleed |  viewport | hero/media chapter محدود    |

## Grid

- Desktop ≥1280: 12 ستون، gutter 24px، outer margin 48–72px.
- Laptop 1024–1279: 12 ستون، gutter 20px، margin 32px.
- Tablet 768–1023: 8 ستون، gutter 20px، margin 24px.
- Mobile 360–767: 4 ستون، gutter 12–16px، margin 16–20px.
- زیر 360: minimum 320 support، no fixed card widths.

## Vertical rhythm

Base unit مفهومی 4px؛ spacingهای product-facing از مجموعه 8, 12, 16, 24, 32, 48, 64, 96.  
Section spacing:

- desktop commerce: 64–96px
- desktop editorial: 96–144px
- mobile commerce: 40–64px
- mobile editorial: 56–80px

## Product grids

| Context           | Desktop   | Tablet | Mobile                               |
| ----------------- | --------- | ------ | ------------------------------------ |
| Shop              | 4 columns | 3      | 2؛ در ≤360 یک ستون در صورت تراکم متن |
| Featured          | 4         | 2–3    | horizontal rail یا 2                 |
| Recently viewed   | 4–5       | 3      | 2 یا rail                            |
| Wishlist          | 4         | 3      | 2                                    |
| Compare selection | 3–4       | 2      | 1–2                                  |

Card gap mobile حداقل 12px و desktop 20–24px؛ gap 2–8px برای commerce ممنوع.

## Editorial grid

- asymmetry فقط در media/text modules و با reading order واضح.
- تصویر می‌تواند 7 ستون و متن 4 ستون بگیرد؛ یک ستون breathing space.
- در RTL، visual asymmetry از logical start/end تعریف می‌شود، نه mirror کور.
- content order در DOM مطابق reading order موبایل باشد.

## Product gallery

- Desktop: gallery 7/12، buy box 5/12؛ gallery grid یا primary + thumbnails.
- Sticky buy box فقط تا زمانی که ارتفاعش از viewport کمتر باشد.
- Tablet: 5/8 media، 3/8 summary یا stack بسته به content.
- Mobile: media full width، title/price/CTA بلافاصله بعد؛ thumbnails touch-scroll.
- primary image ratio 1:1 یا 4:5 با product-scale guide؛ gallery container aspect ثابت برای CLS.

## Navigation

- Announcement bar optional: 28–32px، فقط پیام verified.
- Desktop navbar: 72–80px.
- Mobile navbar: 56–64px.
- Mobile bottom bar: content height 56–64px + `env(safe-area-inset-bottom)`.
- page content bottom padding باید bottom bar + 16px را جبران کند.

## Sticky rules

- sticky element نباید بیش از 45٪ viewport mobile را اشغال کند.
- mobile sticky buy bar شامل price summary + CTA، نه تمام variant panel.
- filter/sort bar می‌تواند sticky شود فقط پس از page title.
- sticky elements هنگام keyboard open یا modal state باید تعارض نداشته باشند.
- cart summary desktop sticky؛ mobile inline سپس optional bottom CTA.

## Full-bleed

مجاز: homepage hero، article hero، یک campaign chapter.  
غیرمجاز: product grid، forms، checkout، legal.  
Text داخل full-bleed همیشه در container و text-safe area قرار می‌گیرد.

## RTL alignment

- text فارسی start-aligned.
- اعداد و برندها isolated LTR.
- arrows بر اساس action معنا دارند؛ back/forward با direction محیط تطبیق.
- sidebar/filter در inline-start و summary در inline-end بر اساس logical layout.
