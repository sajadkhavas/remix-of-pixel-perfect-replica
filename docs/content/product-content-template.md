# الگوی استاندارد محتوای Product Page

## هدف و اصل انتشار

هر صفحه یک entity مشخص: brand + model + reference + sellable variant. صفحه فقط وقتی index شود که نام/شناسه، توضیح اختصاصی، تصویر variant، مشخصات اصلی و داده commerce قابل اتکا باشند؛ claimهای تجاری نیز باید مجاز باشند.

## Field specification

| Field                 | Required/optional           | Source of truth            | Maximum length | Writing rule                                      | Fallback behavior        | SEO use          |
| --------------------- | --------------------------- | -------------------------- | -------------- | ------------------------------------------------- | ------------------------ | ---------------- |
| Product name          | Required                    | PIM approved name          | 70 chars       | Brand + model + differentiator؛ بدون صفت تبلیغاتی | publish نشود             | H1/title         |
| Brand                 | Required                    | taxonomy/official spelling | 40             | املای رسمی لاتین                                  | publish نشود             | Breadcrumb/Brand |
| Reference             | Required traditional/luxury | manufacturer catalog       | 50             | لاتین؛ punctuation حفظ شود                        | noindex تا تأیید         | title/search/mpn |
| Slug                  | Required                    | brand-model-reference      | 120            | پایدار؛ بدون قیمت                                 | ID موقت و noindex        | URL              |
| Short description     | Required                    | editorial + specs          | 160            | use case + دو تفاوت واقعی                         | technical summary only   | above fold/meta  |
| Technical summary     | Required                    | PIM fields                 | 5 bullets      | موتور، اندازه، شیشه، آب، بند                      | فقط verified fields      | snippets         |
| Full description      | Required for index          | editorial + official       | 350–700 words  | مدل‌محور، trade-off و variant                     | noindex                  | body SEO         |
| Design story          | Optional                    | official source            | 250 words      | attribution روشن                                  | omit                     | entity context   |
| Movement type         | Required                    | manufacturer               | 30             | taxonomy کنترل‌شده                                | hide/noindex             | filter/compare   |
| Caliber/chipset       | Recommended                 | manufacturer               | 50             | identifier دقیق                                   | omit                     | long-tail        |
| Power reserve/battery | Recommended                 | official test              | 80             | value + conditions                                | omit                     | compare          |
| Accuracy              | Optional                    | official protocol          | 100            | range + conditions                                | omit                     | technical        |
| Case material         | Required                    | manufacturer               | 60             | فارسی normalized + raw                            | omit unknown             | filter           |
| Diameter              | Required when applicable    | manufacturer               | 20             | عدد + mm                                          | هرگز از تصویر حدس نزن    | size/filter      |
| Thickness             | Recommended                 | manufacturer               | 20             | عدد + mm                                          | omit                     | fit              |
| Lug-to-lug            | Recommended                 | official/verified measure  | 20             | source measurement                                | omit                     | fit              |
| Weight                | Optional                    | variant spec               | 20             | g + variant                                       | omit                     | compare          |
| Glass                 | Required                    | manufacturer               | 60             | type + coating مستند                              | omit                     | filter/guide     |
| Dial                  | Recommended                 | manufacturer               | 120            | رنگ، finish، indices                              | omit                     | context          |
| Strap/bracelet        | Required                    | manufacturer               | 120            | material، width، clasp                            | omit                     | care/filter      |
| Water resistance      | Required if claimed         | official spec              | 80             | «مقاومت آب» + rating + limits                     | badge hidden             | filter/guide     |
| Functions             | Recommended                 | manufacturer               | 10 bullets     | controlled vocab + consequence                    | omit                     | search/compare   |
| Compatibility         | Required smart              | official docs              | 200            | OS/version/device + checked date                  | smart Product منتشر نشود | compare          |
| Warranty              | Conditional                 | approved SKU record        | 250            | provider، duration، coverage، exclusions          | hide/unknown             | trust            |
| Authenticity evidence | Conditional                 | approved SKU evidence      | 250            | چه چیز، توسط چه‌کس، چه محدودیتی                   | claim hidden             | trust            |
| Box contents          | Required sellable           | warehouse/PIM              | 12 items       | exact items                                       | checkout review          | conversion       |
| Condition             | Required sellable           | inventory/inspection       | 30             | new/pre-owned/display + grading                   | offer منتشر نشود         | itemCondition    |
| Price                 | Required online sale        | pricing service            | —              | currency، timestamp، fees                         | CTA خرید hide            | Offer            |
| Availability          | Required online sale        | inventory service          | —              | status + last sync                                | CTA disabled             | Offer            |
| Shipping              | Conditional                 | engine/policy              | 200            | cost/window by destination                        | pending only if engine   | shippingDetails  |
| Returns               | Conditional                 | approved policy            | 200            | window، condition، exclusions، process            | hide/review sale         | returnPolicy     |
| Care instructions     | Recommended                 | manual + expert            | 300 words      | model/material specific                           | generic guide + caveat   | post-purchase    |
| FAQ                   | Optional                    | real questions             | 5–8            | verified answers                                  | omit                     | FAQ if eligible  |
| Related content       | Required for index          | editorial map              | 3–6 links      | relevant movement/size/water                      | brand/category fallback  | internal links   |
| Related products      | Optional                    | recommendation logic       | 4–8            | relation explained                                | omit                     | discovery        |
| Sources               | Required internally         | source registry            | —              | URL/title/date/owner                              | noindex                  | audit            |
| Last updated          | Required                    | CMS                        | —              | content و commerce timestamps جدا                 | stale commerce hide      | freshness        |

## ترتیب محتوا

Above fold: breadcrumb، brand، H1، short description، review واقعی، price/availability واقعی، variant، summary، CTA، policy summaries تأییدشده.

Decision content: gallery، design/use، specs، movement، dimensions، water limits، box/condition، warranty/authenticity/shipping/returns، care، FAQ، guides، related.

## نام و توضیح

نام نمونه: `Omega Seamaster Diver 300M — Ref. 210.30.42.20.03.001`؛ reference و نام خانواده ترجمه آزاد نشود.

Short description: `[مدل] یک ساعت [نوع/کاربرد] با [ویژگی منبع‌دار] و قاب [اندازه/متریال] است؛ برای کاربری که [نیاز] را در اولویت دارد.`

Full description: شناسایی reference؛ کاربرد؛ سه تفاوت؛ trade-off؛ variant/condition/box؛ مسیر مقایسه.

## مقاومت آب

label «مقاومت آب». value از منبع رسمی. help: «این عدد شرایط آزمون را نشان می‌دهد و به‌تنهایی مجوز هر نوع استفاده در آب نیست.» مقدار ناشناخته پنهان؛ تخمین ممنوع.

## گارانتی

provider، مدت، شروع، پوشش، استثنا، مدارک، روش درخواست و policy version. «رسمی» فقط با مبنای ثبت‌شده.

## اصالت

claim دقیق، evidence، scope، date، owner و limitation. در نبود داده section و badge پنهان.

## Reviews

فقط review واقعی؛ verified purchase مشخص؛ moderation policy؛ aggregate از review قابل‌مشاهده. seed/demo/انتقال امتیاز ممنوع.

## SEO/Structured Data

Product/ProductGroup فقط مطابق صفحه؛ Offer فقط با price/availability؛ AggregateRating واقعی؛ shipping/returns مطابق policy؛ GTIN ساخته نشود؛ variant canonical طبق guideline؛ description یکتا.

## QA

تصویر مطابق reference؛ نام و واحد تأیید؛ متن غیرgeneric؛ price/stock source و timestamp؛ review واقعی؛ claims مجاز؛ CTA سازگار؛ links کامل؛ metadata/schema برابر صفحه.
