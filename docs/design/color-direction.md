# Color Direction

این سند token کدنویسی نیست؛ قرارداد نقش و رفتار رنگ است.

## Palette A — Graphite & Brass (پیشنهاد اصلی)

| Role               | پیشنهاد                 | نقش                 | استفاده مجاز                 | استفاده ممنوع                 | Contrast / mobile risk                      |
| ------------------ | ----------------------- | ------------------- | ---------------------------- | ----------------------------- | ------------------------------------------- |
| Background 0       | `#0B0C0E`               | canvas اصلی dark    | بدنه، hero dark              | card و input هم‌سطح           | OLED smearing در text بسیار کم‌رنگ          |
| Background 1       | `#121418`               | section alternation | commerce sections            | همه cardها                    | مرز لایه‌ها در موبایل باید واضح باشد        |
| Elevated surface   | `#191C21`               | card/drawer/modal   | surfaces تعاملی              | decoration بزرگ               | متن primary حداقل 4.5:1                     |
| Primary text       | `#F3F1EC`               | heading/body مهم    | نام، قیمت، CTA text          | disabled                      | روی dark مناسب؛ روی brass تست جدا           |
| Secondary text     | `#C5C1B8`               | توضیح/spec          | body secondary               | legal/critical muted          | حداقل 4.5:1                                 |
| Muted text         | `#8F9298`               | metadata            | caption غیرضروری             | stock/error/price             | زیر 12px ممنوع                              |
| Accent             | `#B99455`               | brass punctuation   | selected, key line, rare CTA | background غالب، همه priceها  | text کوچک روی accent dark مناسب‌تر          |
| Accent hover       | `#CAA86B`               | feedback            | hover/focus companion        | animation shimmer دائمی       | hover معادل touch/focus لازم                |
| Border subtle      | `#292D33`               | separation          | card/input boundaries        | تمام layout به‌صورت cage      | mobile 1px کافی با surface difference       |
| Border strong      | `#454B54`               | active boundary     | selected/focus support       | decoration تکراری             | contrast focus تنها به border متکی نباشد    |
| Focus              | `#7EC8FF` + dark offset | keyboard focus      | همه controls                 | brand decoration              | از brass جدا تا focus با accent اشتباه نشود |
| Overlay            | `rgba(3,4,6,.72)`       | modal/drawer        | focus containment            | text background مستقل         | backdrop blur optional                      |
| Skeleton base      | `#171A1F`               | loading structure   | reserved blocks              | shimmer پرکنتراست             | reduced motion: static tone                 |
| Skeleton highlight | `#242931`               | shimmer محدود       | once/slow                    | infinite bright gold          | contrast کم برای جلوگیری distraction        |
| Disabled           | `#60646B` / `#24272C`   | unavailable control | disabled states              | متن ضروری                     | label «ناموجود» باید خوانا بماند            |
| Success            | `#63B58A`               | success             | added/available confirmation | luxury accent                 | icon+text                                   |
| Warning            | `#D4A85F`               | low stock/attention | warnings                     | general accent                | با brass تفکیک متنی                         |
| Error              | `#E77B79`               | validation/failure  | errors                       | sale                          | icon+message                                |
| Info               | `#77A9D8`               | neutral status      | shipping/info                | smart category branding عمومی | text+icon                                   |
| Sale               | `#C96C6A`               | discount            | price reduction              | error                         | label «تخفیف»                               |
| Out of stock       | `#92969E`               | unavailable         | muted image + label          | red alarm                     | non-color state                             |
| Premium badge      | `#B99455` outline       | limited/premium     | verified badge               | unverified marketing          | approval required                           |
| Limited badge      | `#D7C6A5`               | scarcity factual    | inventory-backed             | fake urgency                  | count/source needed                         |

## Palette B — Porcelain Editorial

Background dark و surfaceهای warm off-white (`#F3F0EA`) در editorial/reading sections، با graphite text و brass محدود.  
**مزیت:** تنفس و تمایز از dark-only.  
**ریسک:** نیاز به assetهایی که روی هر دو زمینه خوب کار کنند؛ transition صفحه باید کنترل شود.

## Palette C — Oxidized Mechanical

Gunmetal + warm grey + oxidized teal (`#4F7777`) + brass کم.  
**مزیت:** هویت فنی خاص.  
**ریسک:** teal می‌تواند به branding category یا «tech dashboard» تبدیل شود.

## تصمیم

- Palette A پایه commerce است.
- Palette B برای Magazine/About/guide chapter مجاز است.
- Palette C فقط برای info/spec visualization و نه brand identity اصلی.

## Accent budget

- در viewport commerce: حداکثر 10٪ pixel area.
- در hero campaign: حداکثر 15٪، ترجیحاً از خود تصویر.
- هیچ section بیش از یک accent UI فعال ندارد.
- قیمت عادی primary text است؛ sale فقط semantic رنگ می‌گیرد.
- focus همیشه مستقل از accent برند است.

## رفتار موبایل

- gradients و transparent overlays کاهش می‌یابند.
- borderهای بسیار ظریف باید با surface separation همراه شوند.
- رنگ status با text کامل و icon/shape پشتیبانی می‌شود.
- dark surfaces نزدیک به هم در نور محیطی واقعی تست می‌شوند.
