# نقشه لینک‌سازی داخلی KRONOS

## اهداف
کاربر از کشف به مقایسه و Product برسد؛ Guide به تصمیم خرید وصل شود؛ Product بن‌بست نباشد؛ Trust در نقاط تصمیم در دسترس باشد؛ anchor توصیفی باشد.

## معماری
```text
Homepage
├── /watches → Gender / Style / Movement / Brand / Product
├── /brands → Brand pages
├── /guides → Buying / Size / Movement / Water / Authenticity / Care
└── Trust & Support → Authenticity / Warranty / Shipping / Services / FAQ / Contact
```

## Homepage
لینک به `/watches`، دسته‌های مردانه/زنانه/لوکس/کلاسیک/اسپرت/هوشمند/اتوماتیک، `/brands`، buying guide، size، movements، water resistance و `/guides`. Trust فقط پس از تأیید.

Anchor: مشاهده ساعت‌ها؛ ساعت‌های مردانه/زنانه/اتوماتیک؛ راهنمای خرید؛ راهنمای اندازه؛ راهنمای برندها. نام Brand/Product فقط با مقصد publishable.

## Category
ورودی: Home، Header، Guide، Brand، Breadcrumb و Articles. خروجی: Product، Brand، Guide اصلی، Compare، size/movement/water و sibling categories.

اتوماتیک به «ساعت اتوماتیک چیست؟»، comparison موتور و مکانیکی لینک دهد. اسپرت به مقاومت آب و مقایسه اسپرت/هوشمند.

Anchor: مشخصات [brand model]؛ مشاهده ساعت‌های [category]؛ راهنمای انتخاب [category]؛ مقایسه مدل‌ها.

## Brand
Hub به landingهای publishable و راهنمای برند. Brand page به Product، Category، فناوری/موتور، منبع رسمی با rel مناسب و authenticity disclaimer.

مجاز: ساعت‌های [Brand]؛ مدل‌های ثبت‌شده؛ وب‌سایت رسمی. ممنوع بدون evidence: نمایندگی رسمی؛ خرید از نماینده؛ محصولات تضمینی.

## Product
ورودی: Category، Brand، Search، Compare، Guides، Wishlist/Cart و related.

خروجی ضروری: Category، Brand، Guide موتور، Guide اندازه در صورت ابعاد، Guide آب در صورت rating، policies approved، Compare و Related با رابطه توضیح‌پذیر.

Anchor: همه ساعت‌های اتوماتیک؛ راهنمای موتور؛ انتخاب اندازه؛ معنی مقاومت آب؛ شرایط گارانتی؛ شرایط ارسال؛ مقایسه با [model].

Related بر اساس category، اندازه، movement، کاربرد یا بازه قیمت معتبر؛ random ممنوع.

## Article / Guide
هر مقاله به pillar، حداقل یک Category، Product مرتبط، policy مرتبط و دو sibling لینک دهد. ورودی از Home module، hub، Category، Product help، sibling و Footer برای pillarها.

مثال مقاومت آب: لینک به Sport، curated water landing، Product دارای rating و Services فقط اگر تست آب‌بندی CONFIRMED.

Anchor «اینجا»، exact-match تکراری و Product نامرتبط ممنوع.

## Trust & Support
| صفحه | ورودی | خروجی |
|---|---|---|
| /authenticity | Product، Luxury، Footer، FAQ، guide | Product lookup، Contact، guide |
| /warranty | Product، Cart/Checkout، Footer، FAQ | Contact/claim، Product |
| /shipping-returns | Product، Cart/Checkout، Footer، FAQ | Contact/order support |
| /services | Product care، Guides، Footer | Service detail، Contact، Warranty |
| /contact | Header/Footer، policies، errors | FAQ، policies |
| /faq | Footer، Product summaries | Policy/Guide source |

FAQ خلاصه دارد و به source of truth لینک می‌دهد.

## Breadcrumb
- PLP: `خانه ← ساعت‌ها`
- Category: `خانه ← ساعت‌ها ← [دسته]`
- Brands: `خانه ← برندها ← [Brand]`
- Product: `خانه ← ساعت‌ها ← [دسته] ← [Brand] ← [Model + Reference]`
- Guides: `خانه ← راهنماها ← [خوشه] ← [عنوان]`
- Trust: `خانه ← پشتیبانی ← [سیاست]`
- Services: `خانه ← خدمات ← [نوع خدمت]`

Mobile می‌تواند collapse کند، اما structured breadcrumb مسیر canonical را حفظ کند.

## Anchor matrix
| مقصد | Primary | Secondary | اجتناب |
|---|---|---|---|
| /watches | مشاهده ساعت‌ها؛ خرید ساعت مچی | همه مدل‌ها | کلیک کنید |
| Men | ساعت‌های مردانه | انتخاب ساعت مردانه | بهترین مردانه |
| Women | ساعت‌های زنانه | انتخاب ساعت زنانه | مخصوص همه بانوان |
| Automatic | ساعت‌های اتوماتیک | موتور اتوماتیک | بدون باتری به‌شکل مطلق |
| Smart | ساعت‌های هوشمند | مقایسه اسمارت‌واچ | بهترین هوشمند |
| Brand | ساعت‌های [Brand] | مدل‌های [Brand] | نمایندگی [Brand] |
| Product | [Brand Model Reference] | مشخصات [Model] | این محصول |
| Size | راهنمای اندازه ساعت | قطر و lug-to-lug | بیشتر بدانید |
| Water | راهنمای مقاومت آب | معنی 50/100 متر | ضدآب کامل |
| Authenticity | راهنمای بررسی اصالت | مدارک و reference | تضمین اصالت |
| Warranty | شرایط گارانتی | پوشش و استثنا | رسمی بدون provider |
| Shipping | شرایط ارسال و بازگشت | هزینه و روند | رایگان بدون شرط |

## قواعد تعداد و ownership
Home: 8–16 لینک محتوایی؛ Category: 2–4 guide/brand؛ Product: 4–8 contextual؛ Article: 3–8؛ Footer فقط stable pages. هر صفحه indexable حداقل یک لینک crawlable داشته باشد.

Ownership: خرید ساعت → `/watches` با Home پشتیبان؛ اتوماتیک → Category با Guide «چیست»؛ ضدآب → curated landing مشروط با Guide؛ اصالت → Guide آموزش و Policy تعهد؛ گارانتی → Policy با Product/Guide؛ Brand → landing؛ reference → Product؛ راهنمای خرید → pillar.

## QA
canonical و breadcrumb سازگار؛ anchor روشن؛ noindex در sitemap نباشد؛ لینک صفحه پنهان نمایش داده نشود؛ broken/orphan/redirect chains هر release؛ مقاله جدید از hub و cluster؛ Product از Category و Brand؛ depth صفحات کلیدی حداکثر 3 کلیک از Home.
