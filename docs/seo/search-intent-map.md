# نقشه Search Intent پروژه KRONOS

## تصمیم‌های معماری

| Intent                   | نیاز اصلی               | قالب مناسب                                  | CTA اصلی                             | Indexability پیش‌فرض         |
| ------------------------ | ----------------------- | ------------------------------------------- | ------------------------------------ | ---------------------------- |
| Informational            | یادگیری مفهوم یا روش    | Guide / Article                             | مطالعه راهنمای مرتبط یا ورود به دسته | index                        |
| Commercial Investigation | مقایسه پیش از خرید      | Comparison / Buying Guide / Curated landing | مقایسه مدل‌ها                        | index                        |
| Transactional            | مشاهده و خرید مدل       | Category / Brand landing / Product          | مشاهده محصول یا افزودن به سبد        | index با داده واقعی          |
| Navigational             | رسیدن به برند/صفحه مشخص | Brand/About/Contact/Account                 | رفتن به مقصد                         | بسته به صفحه                 |
| Support                  | پاسخ سیاست یا حل مسئله  | Policy / FAQ / Service                      | مشاهده شرایط یا تماس                 | index پس از تأیید            |
| Post-purchase            | استفاده و نگهداری       | Care Guide / Account / Support              | راهنمای مدل یا درخواست خدمت          | guide index؛ account noindex |

## ماتریس intent به نوع صفحه

| گروه کلمه                | Intent غالب                   |                         Landing Page |                                      Article |               Category | Filter page                |         FAQ |             Product page | تصمیم                                                         |
| ------------------------ | ----------------------------- | -----------------------------------: | -------------------------------------------: | ---------------------: | -------------------------- | ----------: | -----------------------: | ------------------------------------------------------------- |
| خرید ساعت / فروشگاه ساعت | Transactional                 | بله، Home و `/watches` با نقش متفاوت |                         راهنمای خرید پشتیبان |                    بله | noindex                    |       محدود |                      بله | Home برای discovery؛ `/watches` برای listing                  |
| ساعت مردانه              | Transactional                 |                   خیر؛ Category کافی |                   بله، راهنمای انتخاب مردانه |                    بله | noindex                    |         بله |                      بله | Category keyword owner                                        |
| ساعت زنانه               | Transactional                 |                   خیر؛ Category کافی |                    بله، راهنمای انتخاب زنانه |                    بله | noindex                    |         بله |                      بله | Category keyword owner                                        |
| ساعت لوکس                | Transactional + Commercial    |                     Category curated |                       بله، راهنمای خرید لوکس |                    بله | noindex                    |         بله |                      بله | Trust/اصالت به صفحه جدا لینک شود                              |
| ساعت کلاسیک              | Transactional                 |                             Category |                             بله، انتخاب رسمی |                    بله | noindex                    |       محدود |                      بله | «رسمی» می‌تواند subcategory curated شود پس از validation      |
| ساعت اسپرت               | Transactional                 |                             Category |                           بله، براساس فعالیت |                    بله | noindex                    |         بله |                      بله | «ورزشی» و «اسپرت» intent SERP بررسی شود                       |
| ساعت هوشمند              | Transactional + Commercial    |                             Category |                         چند comparison guide |                    بله | noindex                    |         بله |                      بله | compatibility در Product ضروری                                |
| ساعت اتوماتیک            | Transactional                 |                             Category |                                  بله، «چیست» |                    بله | noindex                    |         بله |                      بله | guide مالک informational است                                  |
| ساعت مکانیکی             | Transactional + Informational |                        Category والد |                                          بله |                    بله | noindex                    |         بله |                      بله | taxonomy: mechanical شامل automatic/manual                    |
| ساعت کوارتز              | Transactional                 |                             Category |                            بله، مقایسه موتور |                    بله | noindex                    |         بله |                      بله | دسته و guide از هم جدا                                        |
| ساعت ضدآب                | Mixed                         | Curated فقط با inventory و copy یکتا |                               بله، مقاومت آب |               ممکن است | noindex                    |         بله |                      بله | اصطلاح UI «مقاومت آب»؛ keyword در title قابل استفاده با توضیح |
| دسته قیمت                | Transactional                 |                     فقط ranges معتبر |                             بله، guide بودجه |                Curated | noindex برای ranges خودکار |       محدود |                      بله | پیش از validation و price source: noindex                     |
| برندها                   | Navigational + Transactional  |            Brand hub + brand landing | history/guide در همان landing یا مقاله مستقل |                     نه | brand filters noindex      |         بله |                      بله | حضور برند ≠ نمایندگی                                          |
| نام مدل/reference        | Transactional                 |                                  خیر |               review/comparison فقط اگر یکتا |                     نه | search noindex             | Product FAQ |                      بله | Product keyword owner                                         |
| مقایسه ساعت              | Commercial Investigation      |                           `/compare` |                            مقالات دو/چندمدلی |                     نه | parameter URLs noindex     |       محدود |           لینک مبدا/مقصد | landing index؛ ترکیب مدل‌ها noindex                           |
| راهنمای خرید             | Informational + Commercial    |                           Guide جامع |                                         همان |                     نه | —                          |        بخشی | لینک به product/category | pillar content                                                |
| تشخیص اصالت              | Informational + Trust         |         Guide + policy با نقش متفاوت |                                        Guide |                     نه | —                          |       خلاصه |         evidence per SKU | Guide آموزش؛ policy تعهد KRONOS                               |
| اندازه ساعت              | Informational + Commercial    |                                Guide |                                         همان |                     نه | فیلتر اندازه noindex       |         بله |               dimensions | Guide pillar                                                  |
| جنس شیشه                 | Informational                 |                                Guide |                                         همان |                     نه | facet noindex              |         بله |                     spec | Guide                                                         |
| مقاومت آب                | Informational + Support       |                                Guide |                                         همان |                     نه | facet noindex              |         بله |            spec + caveat | Guide owner                                                   |
| نوع موتور                | Informational + Commercial    |                         Guide parent |                                    مقایسه‌ها |      categoryهای موتور | facets noindex             |         بله |                     spec | parent-child cluster                                          |
| نگهداری ساعت             | Informational + Post-purchase |                                Guide |                              مدل/برند guides |                     نه | —                          |         بله |             care section | advice باید source-aware باشد                                 |
| خرید هدیه                | Commercial Investigation      |                                Guide |                                         همان | curated campaign مشروط | filters noindex            |         بله |             gift details | policy بازگشت فقط اگر confirmed                               |
| تعمیر و خدمات            | Transactional + Support       |                          Service hub |                    educational service guide |                     نه | —                          |         بله |            service links | hub noindex تا خدمت confirmed                                 |
| گارانتی                  | Support + Commercial          |                               Policy |                          guide عمومی اختیاری |                     نه | —                          |       خلاصه |                  per SKU | policy source of truth                                        |
| ارسال و مرجوعی           | Support + Commercial          |                               Policy |                              مقاله لازم نیست |                     نه | —                          |       خلاصه |           summary + link | policy source of truth                                        |
| تماس                     | Navigational + Support        |                              Contact |                                          خیر |                     نه | —                          |         خیر |                     link | noindex تا اطلاعات واقعی                                      |
| ورود/حساب                | Navigational                  |                         Auth/account |                                          خیر |                     نه | —                          |         خیر |            checkout link | noindex,nofollow                                              |
| جست‌وجوی داخلی           | Navigational/Transactional    |                       Search results |                                          خیر |                     نه | همه queryها noindex        |         خیر |                      بله | canonical به `/watches`                                       |
| ناموجود/اطلاع‌رسانی      | Transactional state           |                        Product state |                                          خیر |                     نه | —                          |       محدود |                      بله | URL محصول طبق lifecycle policy                                |

## قواعد Landing Page

Landing مستقل فقط وقتی لازم است که همه شروط زیر برقرار باشد:

1. intent مستقل در SERP و ابزار keyword تأیید شود.
2. حداقل مجموعه محصول یا اطلاعات کافی برای پاسخ وجود داشته باشد.
3. H1، intro، بخش‌های پشتیبان و لینک‌های داخلی یکتا باشند.
4. صفحه از category/filter والد قابل تفکیک باشد.
5. امکان نگهداری داده و جلوگیری از empty page وجود داشته باشد.

در غیر این صورت:

- از فیلتر داخل Category استفاده شود.
- URL فیلتر `noindex,follow` باشد.
- canonical به Category والد اشاره کند.
- هیچ landing نازکی فقط برای keyword ساخته نشود.

## سیاست Filter و Facet

### indexable

فقط صفحات curated مانند ساعت اتوماتیک، ساعت هوشمند، برند دارای محتوای یکتا و بازه قیمت اعتبارسنجی‌شده.

### noindex

search query، sort، ترکیب رنگ و برند، چند فیلتر، stock-only، discount-only، pagination کم‌ارزش، session/tracking و صفحات صفر نتیجه.

### canonical

- فیلتر غیرcurated → Category اصلی
- sort/pagination → clean category طبق تصمیم فنی
- brand curated → self-canonical
- Product variant → طبق مدل ProductGroup و URL strategy
- search → `/watches`

`noindex` به‌تنهایی crawl explosion را حل نمی‌کند؛ parameter policy و لینک‌سازی facet نیز باید کنترل شود.

## تفکیک FAQ، Guide و Policy

| سؤال                            | محل پاسخ کامل                 | FAQ چه می‌گوید؟      |
| ------------------------------- | ----------------------------- | -------------------- |
| ساعت اتوماتیک چیست؟             | Guide                         | پاسخ کوتاه + لینک    |
| این مدل چه کالیبری دارد؟        | Product                       | FAQ مدل در صورت نیاز |
| بازگشت کالا چگونه است؟          | Shipping/Returns Policy       | خلاصه با لینک        |
| گارانتی این مدل چیست؟           | Product + Warranty Policy     | provider و مدت SKU   |
| چگونه اصالت را بررسی کنم؟       | Authenticity Guide            | محدودیت تشخیص + لینک |
| KRONOS چه چیزی را متعهد می‌شود؟ | Authenticity Policy           | خلاصه نسخه تأییدشده  |
| چه زمانی ساعت سرویس شود؟        | Service Guide + source سازنده | نشانه‌های عمومی      |

## مسیر Funnel

- TOFU: موتور، اندازه، شیشه، مقاومت آب، نگهداری.
- MOFU: راهنمای خرید، مقایسه، هدیه، برند، لوکس.
- BOFU: Category، Brand، Product، Compare، policy.
- Post-purchase: Care، warranty، service، support، account.

## جلوگیری از Cannibalization

- یک owner اصلی برای هر keyword.
- Category با فعل خرید/مشاهده؛ Guide با سؤال/آموزش.
- Brand landing برای مدل‌ها؛ مقاله تاریخچه فقط با intent مستقل.
- «اصالت»: Guide برای آموزش، Policy برای تعهد KRONOS.
- «گارانتی»: Product برای SKU، Policy برای قواعد فروشگاه.
- H1، title و anchor مطابق نقش صفحه.
- query overlap هر سه ماه در Search Console مرور شود.

## Validation

تمام تصمیم‌های صفحه مستقل، اولویت و نام keyword: `REQUIRES_KEYWORD_TOOL_VALIDATION`.
