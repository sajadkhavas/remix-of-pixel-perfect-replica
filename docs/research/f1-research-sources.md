# تحقیق F1: برند، محتوا و معماری جست‌وجوی KRONOS

- **تاریخ تحقیق:** 2026-08-05
- **هدف:** تدوین قواعد محتوای فروشگاه ساعت بدون کپی از رقبا و بدون ساختن داده تجاری
- **روش:** منابع رسمی/پژوهشی برای SEO، UX و دسترس‌پذیری؛ بررسی رقبا فقط برای معماری، intent و زبان رایج بازار

## اصول استخراج‌شده

### 1. صحت داده محصول بر زیبایی متن مقدم است

Google برای Product و Merchant Listing روی هم‌خوانی قیمت، موجودی، شرایط ارسال، مرجوعی و review با محتوای قابل‌مشاهده تأکید می‌کند. نتیجه اجرایی KRONOS:

- قیمت و موجودی فقط از منبع عملیاتی و با همگام‌سازی قابل اتکا.
- `rating` و `reviewCount` فقط از نظر واقعی و قابل ممیزی.
- shipping، return و warranty فقط از policy نسخه‌دار.
- Structured Data نباید داده‌ای کامل‌تر یا متفاوت از صفحه قابل‌مشاهده داشته باشد.

### 2. صفحات دسته باید مقصد واقعی جست‌وجوی تجاری باشند

معماری داخلی باید از Home به Category، از Category به Product/Brand/Guide و از Product به Category/Brand/Guide مسیر روشن بسازد. صفحه‌ای که فقط فهرست فیلترشده تکراری است، landing page مستقل محسوب نمی‌شود.

### 3. URLهای فیلترشده به‌طور پیش‌فرض مقصد SEO نیستند

faceted navigation می‌تواند URLهای بسیار زیاد و تکراری بسازد. سیاست پیشنهادی:

- دسته‌های اصلی و landing pageهای curated: `index, follow`.
- queryهای جست‌وجو، sort، ترکیب چند فیلتر و pagination کم‌ارزش: `noindex, follow`.
- canonical صفحات فیلترشده به دسته والد، مگر صفحه curated با محتوای یکتا و تقاضای معتبر.
- هر صفحه curated فقط پس از اعتبارسنجی keyword و وجود محصول کافی index شود.

### 4. Product Page باید تصمیم را ممکن کند

بر اساس پژوهش‌های Baymard، کاربر برای تصمیم به جزئیات ملموس نیاز دارد: مواد، ابعاد، سازگاری، شرایط مرجوعی و تفاوت مدل. برای ساعت، این نیاز به این فیلدها ترجمه می‌شود:

- reference، نوع و کالیبر موتور، ذخیره انرژی، ابعاد قاب، ضخامت، lug-to-lug
- جنس قاب/شیشه/بند، مقاومت آب با توضیح کاربرد
- اقلام جعبه، وضعیت گارانتی، منبع مشخصات و دستور نگهداری
- مقایسه با مدل‌های هم‌رده و راهنمای اندازه

### 5. Microcopy باید وضعیت واقعی سیستم را بگوید

پیام موفقیت فقط پس از موفقیت واقعی عملیات. خطا باید فیلد و راه اصلاح را به متن توضیح دهد؛ رنگ به‌تنهایی کافی نیست. labelها باید هدف را روشن کنند و فرمت مورد انتظار پیش از خطا توضیح داده شود.

### 6. لحن بازار ایران را می‌شناسیم، اما ادعاهای رقبا را تکرار نمی‌کنیم

فروشگاه‌های ایرانی معمولاً از «اصل»، «گارانتی معتبر»، «تنوع بالا»، مردانه/زنانه/بچگانه، برند، سبک و راهنمای خرید استفاده می‌کنند. خلأ قابل استفاده برای KRONOS:

- توضیح فنی منظم و قابل مقایسه
- تفکیک «گارانتی برند»، «گارانتی فروشنده» و «بدون گارانتی ثبت‌شده»
- توضیح محدودیت مقاومت آب به‌جای تکرار عدد
- هدایت انتخاب بر اساس اندازه مچ، کاربرد، نوع موتور و بودجه
- پرهیز از «بهترین/برترین/مرجع/نمایندگی رسمی» بدون evidence

## منابع اصلی

| منبع | URL | کاربرد در این فاز |
|---|---|---|
| Google Search Central — Merchant Listing | https://developers.google.com/search/docs/appearance/structured-data/merchant-listing | صحت price، availability، shipping، returns و reviews |
| Google Search Central — Product Structured Data | https://developers.google.com/search/docs/appearance/structured-data/product | ساختار داده محصول و محدودیت‌های review |
| Google Search Central — Product Variants | https://developers.google.com/search/docs/appearance/structured-data/product-variants | مدل‌سازی variant و تغییر قیمت/موجودی |
| Google Search Central — Ecommerce Site Structure | https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure | معماری لینک داخلی |
| Google Search Central — Faceted Navigation | https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation | کنترل crawl URLهای فیلتر |
| Google Search Central — Canonicalization | https://developers.google.com/search/docs/crawling-indexing/canonicalization | canonical صفحات مشابه |
| Google Search Central — noindex | https://developers.google.com/search/docs/crawling-indexing/block-indexing | کنترل indexability |
| Google Search Central — URL Structure | https://developers.google.com/search/docs/crawling-indexing/url-structure | URL خوانا و پایدار |
| Google Search Central — Title Links | https://developers.google.com/search/docs/appearance/title-link | title یکتا و توصیفی |
| Google Search Central — Snippets | https://developers.google.com/search/docs/appearance/snippet | meta description دقیق |
| Google Search Central — SEO Starter Guide | https://developers.google.com/search/docs/fundamentals/seo-starter-guide | اصول محتوای قابل فهم و لینک‌دهی |
| Baymard — Product Page UX 2026 | https://baymard.com/lists/product-page-ux | نیازهای تصمیم‌گیری PDP |
| Baymard — Product Descriptions | https://baymard.com/blog/product-descriptions | عمق مشخصات و شرح محصول |
| Baymard — Ecommerce Search UX 2026 | https://baymard.com/lists/ecommerce-search | حالات جست‌وجو و پیشنهادها |
| Baymard — Applied Filters | https://baymard.com/blog/how-to-design-applied-filters | نمایش و حذف فیلتر |
| Baymard — Returns UX | https://baymard.com/blog/return-policy | دسترسی به شرایط بازگشت |
| Nielsen Norman Group — Be Succinct | https://www.nngroup.com/articles/be-succinct-writing-for-the-web/ | اختصار و اسکن‌پذیری |
| Nielsen Norman Group — List Entries | https://www.nngroup.com/articles/list-entries/ | اولویت اطلاعات در کارت/لیست |
| W3C WCAG 2.2 — Error Identification | https://www.w3.org/WAI/WCAG22/Understanding/error-identification | خطای متنی و مشخص |
| W3C WCAG 2.2 — Headings and Labels | https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels | عنوان/label توصیفی |
| W3C WAI — Form Instructions | https://www.w3.org/WAI/tutorials/forms/instructions/ | فرمت ورودی و required |

## منابع تحلیل بازار و معماری ساعت

| نمونه | URL | مشاهده معماری؛ نه منبع ادعا برای KRONOS |
|---|---|---|
| Watch Online | https://www.watchonline.shop/ | دسته‌های جنسیت/برند/سبک، راهنمای خرید در دسته‌ها، زبان رایج «اصل/گارانتی» |
| Watch Online — Men | https://www.watchonline.shop/watch/mens | intent ترکیبی transactional + buying guide |
| Raiamark | https://raiamark.com/ | ورود از مردانه/زنانه/بچگانه، فهرست برند و بودجه |
| Rolex — Purchasing | https://www.rolex.com/buying-a-rolex/purchasing-a-rolex | تفکیک انتخاب، مشخصات، تنظیم بند، جعبه و guarantee در منبع رسمی |
| Rolex — Guarantee | https://www.rolex.com/en-us/buying-a-rolex/the-rolex-guarantee | نشان می‌دهد guarantee رسمی به retailer رسمی و کارت تکمیل‌شده وابسته است |
| Rolex — Care FAQ | https://www.rolex.com/en-us/watch-care-and-service/faq | معماری محتوای post-purchase و محدودیت توصیه‌های مدل‌محور |

## محدودیت تحقیق

- Search volume و difficulty از ابزار پولی/حساب متصل دریافت نشده است؛ تمام ردیف‌های keyword با `REQUIRES_KEYWORD_TOOL_VALIDATION` علامت‌گذاری شده‌اند.
- مشاهده یک ادعا در سایت رقیب، آن را برای KRONOS معتبر نمی‌کند.
- نام برندهای خارجی فقط به‌عنوان taxonomy/موضوع محتوا آمده و به معنی موجودی، نمایندگی یا همکاری نیست.
- وضعیت حقوقی، مجوز، اینماد، درگاه، آدرس و سیاست‌های فروش در این فاز تأیید نشده است.
