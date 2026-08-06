# Typography Direction

## انتخاب پیشنهادی

| نقش             | پیشنهاد                                                               | دلیل                                                              |
| --------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Persian Body/UI | Vazirmatn Variable self-hosted                                        | خوانایی خوب، پوشش وزن و فارسی/اعداد، موجود در پروژه               |
| Persian Display | Estedad Variable یا Peyda در صورت مجوز self-host؛ fallback Vazirmatn  | فرم معاصرتر و مناسب headline فارسی؛ تصمیم نهایی وابسته به license |
| Latin Display   | Playfair Display فقط برای wordmark/نام collection محدود               | حس editorial بدون تحمیل به فارسی                                  |
| Latin UI        | Inter یا system sans                                                  | metrics پایدار و خوانایی                                          |
| Numbers/Price   | Vazirmatn tabular Persian برای متن فارسی؛ DM Mono فقط داده فنی/serial | قیمت باید با body هم‌خانواده و قابل اسکن باشد                     |

## قواعد script

- نام برند خارجی داخل wrapper با `lang="en"` و `dir="ltr"` نمایش داده شود.
- اعداد، واحد و currency به‌صورت یک گروه bidi-isolated باشند.
- uppercase فقط برای Latin؛ فارسی uppercase ندارد.
- letter-spacing فارسی: `0` تا حداکثر `0.01em`.
- tracking باز `0.2em+` فقط برای Latin micro-label کوتاه.
- punctuation فارسی: «،» «؛» «؟» و گیومه «»؛ فاصله قبل از punctuation ممنوع.
- slash و dash در breadcrumb با direction-aware separator جایگزین شوند.

## Scale پیشنهادی

| Style              | Desktop | Mobile | Line height |  Weight | کاربرد            |
| ------------------ | ------: | -----: | ----------: | ------: | ----------------- |
| Display XL         |   72–88 |  40–48 |   1.05–1.15 | 650–800 | hero یک‌خطی/دوخطی |
| H1                 |   48–64 |  32–40 |   1.15–1.25 | 650–800 | page title        |
| H2                 |   36–48 |  26–32 |     1.2–1.3 | 650–750 | section           |
| H3                 |   24–32 |  20–24 |         1.3 | 600–700 | cards/editorial   |
| Product title PDP  |   32–44 |  24–30 |        1.25 | 650–750 | نام محصول         |
| Product title card |   15–17 |  14–16 |        1.45 | 600–700 | دو خط حداکثر      |
| Price PDP          |   32–40 |  26–32 |         1.2 | 650–750 | قیمت              |
| Price card         |   17–21 |  16–19 |         1.2 | 650–700 | قیمت              |
| Body L             |      18 |  16–17 |    1.85–2.0 | 400–500 | editorial intro   |
| Body               |      16 |  15–16 |    1.75–1.9 | 400–500 | description       |
| Label              |   13–14 |  13–14 |         1.5 | 550–650 | control/field     |
| Caption            |   12–13 |  12–13 |        1.55 | 400–550 | metadata          |
| Legal              |   12–13 |  12–13 |         1.7 |     400 | policy/footer     |

## طول خطوط

- body فارسی: 45–70 کاراکتر؛ حداکثر تقریبی 38rem.
- editorial long form: 42–65 کاراکتر.
- product title card: 2 خط؛ truncation فقط وقتی full title accessible است.
- CTA: ترجیحاً 2–4 واژه.
- subtitle hero mobile: حداکثر 2 خط.

## Performance

- حداکثر دو خانواده variable در initial route.
- preload فقط weight/style بحرانی و subset لازم.
- `font-display: swap`.
- metrics fallback با `size-adjust`/fallback tuning در فاز implementation.
- DM Mono برای تمام قیمت‌ها توصیه نمی‌شود؛ glyph فارسی و width consistency باید بررسی شود.
- هیچ فونت از CDN ناشناس در production.

## ممنوع

- Playfair برای paragraph یا heading فارسی به‌عنوان انتخاب اول.
- text زیر 12px برای اطلاعات ضروری.
- fake bold، synthetic italic یا وزن‌های بارگذاری‌نشده.
- tracking زیاد روی فارسی.
- چند style display در یک viewport.
