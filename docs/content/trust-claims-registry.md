# رجیستری ادعاهای اعتماد و فروش KRONOS

## هدف

این فایل source of truth انتشار ادعاهای تجاری است. وجود copy در سند دیگر مجوز نمایش نیست.

## وضعیت‌ها

- `CONFIRMED`: evidence، owner و scope دقیق موجود است.
- `REQUIRES_CLIENT_CONFIRMATION`: سند کارفرما لازم است.
- `HIDDEN_UNTIL_CONFIGURED`: به سرویس یا policy اجرایی وابسته است.
- `PROHIBITED`: در شکل فعلی منتشر نشود.

## Registry

|   # | Claim                         | Where used                       | Evidence required                     | Current status               | Fallback copy                                  | Visibility rule           | Owner                    |
| --: | ----------------------------- | -------------------------------- | ------------------------------------- | ---------------------------- | ---------------------------------------------- | ------------------------- | ------------------------ |
|   1 | فروشگاه ساعت تخصصی            | Home/root                        | دامنه واقعی محصول و editorial scope   | CONFIRMED                    | فروشگاه و راهنمای انتخاب ساعت                  | Visible                   | Brand/Content            |
|   2 | مرجع تخصصی در ایران           | Footer/root/about                | مدرک جایگاه بازار                     | PROHIBITED                   | راهنمای انتخاب و مقایسه ساعت                   | Replace                   | Brand                    |
|   3 | اصالت تضمینی همه محصولات      | Home/Product/Services/FAQ        | Evidence per SKU + policy             | REQUIRES_CLIENT_CONFIRMATION | مدارک هر مدل جدا اعلام می‌شود.                 | Hidden until SKU evidence | Legal + Merchandising    |
|   4 | محصول اورجینال                | Metadata/Product                 | Source chain/inspection per SKU       | REQUIRES_CLIENT_CONFIRMATION | claim نمایش داده نشود.                         | Hidden                    | Merchandising            |
|   5 | گواهی اصالت همراه همه ساعت‌ها | Services/FAQ                     | Pack list + issuer per SKU            | REQUIRES_CLIENT_CONFIRMATION | مدارک همراه هر مدل درج می‌شود.                 | Hidden unless confirmed   | Merchandising            |
|   6 | سریال قابل استعلام            | Services/FAQ/About               | Official lookup + verification        | REQUIRES_CLIENT_CONFIRMATION | روش و محدودیت reference/serial توضیح داده شود. | Hidden                    | Merchandising + Legal    |
|   7 | جعبه اورجینال برای همه        | Services/About                   | Warehouse pack list per SKU           | REQUIRES_CLIENT_CONFIRMATION | اقلام هر مدل جدا درج می‌شود.                   | Hidden                    | Warehouse                |
|   8 | کارت گارانتی رسمی             | Services/About/FAQ               | Provider، contract، SKU coverage      | REQUIRES_CLIENT_CONFIRMATION | ارائه‌دهنده و شرایط هر مدل درج شود.            | Hidden                    | Legal + Operations       |
|   9 | گارانتی بدون جزئیات           | Product badge                    | Provider/duration/coverage/exclusions | PROHIBITED                   | شرایط گارانتی ثبت نشده است.                    | Hide badge                | Legal                    |
|  10 | گارانتی دو ساله               | Services                         | Policy + SKU coverage                 | REQUIRES_CLIENT_CONFIRMATION | مدت و ارائه‌دهنده هر مدل را ببینید.            | Hidden                    | Legal                    |
|  11 | گارانتی رسمی هوشمند           | FAQ                              | SKU provider records                  | REQUIRES_CLIENT_CONFIRMATION | گارانتی هر مدل جدا ثبت می‌شود.                 | Hidden                    | Merchandising            |
|  12 | ارسال امن                     | Metadata/Footer/Product/Services | Packaging/carrier process             | REQUIRES_CLIENT_CONFIRMATION | روش ارسال پس از مقصد نمایش داده می‌شود.        | Neutral copy              | Operations               |
|  13 | بسته‌بندی ضدضربه              | Services                         | Packaging SOP/testing                 | REQUIRES_CLIENT_CONFIRMATION | جزئیات در policy تأییدشده.                     | Hidden                    | Warehouse                |
|  14 | بیمه کامل                     | Services                         | Carrier contract + limits             | REQUIRES_CLIENT_CONFIRMATION | پوشش با سقف و استثنا اعلام شود.                | Hidden                    | Operations + Legal       |
|  15 | ردیابی آنلاین                 | Services                         | Tracking integration                  | HIDDEN_UNTIL_CONFIGURED      | کد پس از تحویل به حمل‌کننده.                   | Hidden                    | Engineering + Operations |
|  16 | ارسال ۱ تا ۳ روز              | Services/FAQ                     | SLA، carrier، cutoff                  | REQUIRES_CLIENT_CONFIRMATION | بازه پس از مقصد محاسبه می‌شود.                 | Hide SLA                  | Operations               |
|  17 | تهران یک روز                  | FAQ                              | SLA و coverage map                    | REQUIRES_CLIENT_CONFIRMATION | بازه پس از نشانی نمایش داده می‌شود.            | Hidden                    | Operations               |
|  18 | ارسال رایگان بالای ۵۰ میلیون  | Navbar                           | Promotion + checkout calc             | REQUIRES_CLIENT_CONFIRMATION | هزینه پس از نشانی محاسبه می‌شود.               | Hidden                    | Commercial + Operations  |
|  19 | ارسال رایگان سبد              | Cart                             | Shipping calculator                   | HIDDEN_UNTIL_CONFIGURED      | پس از نشانی محاسبه می‌شود.                     | Never default free        | Engineering + Operations |
|  20 | بازگشت ۷ روزه                 | Product/FAQ                      | Legal policy + exceptions/process     | REQUIRES_CLIENT_CONFIRMATION | شرایط بازگشت را مطالعه کنید.                   | Hidden                    | Legal + Operations       |
|  21 | امکان بازگشت                  | FAQ/Product                      | Approved policy                       | REQUIRES_CLIENT_CONFIRMATION | تابع policy و شرایط کالا است.                  | Hidden                    | Legal                    |
|  22 | خرید اقساطی                   | FAQ/Services                     | Provider contract + disclosures       | HIDDEN_UNTIL_CONFIGURED      | پس از فعال‌سازی ارائه می‌شود.                  | Hidden                    | Finance + Legal          |
|  23 | اقساط ۳، ۶، ۱۲ ماهه           | FAQ                              | Provider terms                        | PROHIBITED                   | —                                              | Hidden                    | Finance                  |
|  24 | اقساط تا ۱۲ ماه               | Services                         | Provider terms                        | PROHIBITED                   | —                                              | Hidden                    | Finance                  |
|  25 | تنظیم رایگان بند              | Services                         | Scope/cost/eligible SKU               | REQUIRES_CLIENT_CONFIRMATION | شرایط مدل واجد شرایط اعلام شود.                | Hidden                    | Services                 |
|  26 | اصالت‌سنجی همان روز           | Services                         | Team، scope، SLA، report              | REQUIRES_CLIENT_CONFIRMATION | زمان پس از پذیرش اعلام شود.                    | Hidden                    | Services                 |
|  27 | تعمیر تخصصی                   | Services/Home                    | Qualified team + scope                | REQUIRES_CLIENT_CONFIRMATION | خدمات فعال و مسئول آن نمایش داده شود.          | Hidden                    | Services                 |
|  28 | تعمیر ۱ تا ۵ روز              | Services                         | SLA by repair type                    | REQUIRES_CLIENT_CONFIRMATION | زمان پس از عیب‌یابی.                           | Hidden                    | Services                 |
|  29 | پاسخ‌گویی ۷ روز هفته          | Contact                          | Support schedule                      | REQUIRES_CLIENT_CONFIRMATION | زمان تأییدشده نمایش داده شود.                  | Hidden                    | Support                  |
|  30 | تأسیس ۱۳۹۵                    | About                            | Registration/history evidence         | REQUIRES_CLIENT_CONFIRMATION | KRONOS برای ساده‌کردن انتخاب طراحی شده است.    | Replace                   | Founder/Legal            |
|  31 | ۸+ سال تجربه                  | Home/About                       | Evidence + definition                 | PROHIBITED                   | بلوک آمار حذف شود.                             | Hidden                    | Leadership               |
|  32 | ۱۲ هزار+ مشتری                | About                            | Audited CRM/order count               | PROHIBITED                   | بلوک آمار حذف شود.                             | Hidden                    | Analytics                |
|  33 | ۹۹٪ رضایت                     | Home/About                       | Survey method/sample/time             | PROHIBITED                   | بلوک آمار حذف شود.                             | Hidden                    | Analytics                |
|  34 | ۱۲۰۰+ مدل                     | Home                             | Live catalog count                    | PROHIBITED                   | count پویا یا حذف.                             | Hidden/dynamic            | Merchandising            |
|  35 | ۵۰+ برند معتبر                | Home                             | Catalog count + definition            | PROHIBITED                   | راهنمای برندها                                 | Replace                   | Merchandising            |
|  36 | ۵۰+ برند رسمی/همکاری          | About                            | Contracts                             | PROHIBITED                   | حضور برند رابطه رسمی نیست.                     | Hidden                    | Legal                    |
|  37 | نمایندگی رسمی                 | Brand display                    | Authorization                         | PROHIBITED                   | بدون سند اعلام نشود.                           | Hidden                    | Legal                    |
|  38 | کلکسیون اکسکلوسیو             | Hero                             | Exclusivity contract + inventory      | PROHIBITED                   | مدل‌های منتخب برای بررسی                       | Replace                   | Commercial               |
|  39 | کلکسیون جدید ۱۴۰۴             | Hero                             | Published dates/current year          | PROHIBITED                   | مدل‌های تازه‌افزوده‌شده                        | Conditional               | Merchandising            |
|  40 | محصول محدود                   | Cards                            | Manufacturer evidence/rule            | REQUIRES_CLIENT_CONFIRMATION | فقط با evidence.                               | Hidden                    | Merchandising            |
|  41 | فقط X عدد                     | Product                          | Reliable realtime inventory           | HIDDEN_UNTIL_CONFIGURED      | [count] عدد ثبت شده است.                       | Only live                 | Inventory                |
|  42 | موجود/ناموجود                 | Product                          | Inventory service                     | HIDDEN_UNTIL_CONFIGURED      | در حال بررسی موجودی.                           | Only live                 | Inventory                |
|  43 | قیمت/قیمت تخفیف               | Product/Cart                     | Pricing + history                     | HIDDEN_UNTIL_CONFIGURED      | فقط از سرویس فروش.                             | Only live                 | Commerce                 |
|  44 | درصد تخفیف                    | Card                             | Original price + campaign             | HIDDEN_UNTIL_CONFIGURED      | از داده معتبر محاسبه شود.                      | Only live                 | Commerce                 |
|  45 | پرفروش‌ترین                   | Shop sort                        | Sales data + period                   | PROHIBITED                   | پیشنهادی یا حذف                                | Replace                   | Analytics                |
|  46 | امتیاز/تعداد نظر              | Product                          | Real published reviews                | PROHIBITED                   | تا داده واقعی حذف.                             | Hidden                    | Reviews                  |
|  47 | جدید بودن                     | Card                             | published_at rule                     | HIDDEN_UNTIL_CONFIGURED      | تازه‌افزوده‌شده                                | Data-driven               | Merchandising            |
|  48 | مقاومت آب مدل                 | Product/Category                 | Official exact reference spec         | REQUIRES_CLIENT_CONFIRMATION | rating + limitations                           | Per verified SKU          | Content                  |
|  49 | ۲۰۰ متر برای دسته اسپرت       | Hero                             | Category-wide claim invalid           | PROHIBITED                   | هر مدل جدا بررسی شود.                          | Replace                   | Content                  |
|  50 | سازگاری iOS/Android برای دسته | Hero                             | Per model/version docs                | PROHIBITED                   | سازگاری هر مدل را ببینید.                      | Replace                   | Content                  |
|  51 | VISA/شاپرک/زرین‌پال           | Footer                           | Active gateway contracts              | HIDDEN_UNTIL_CONFIGURED      | در checkout نمایش داده شود.                    | Hidden                    | Finance + Engineering    |
|  52 | اینماد/مجوز                   | Trust areas                      | Valid license + verify URL            | HIDDEN_UNTIL_CONFIGURED      | badge placeholder ممنوع.                       | Hidden                    | Legal                    |
|  53 | تلفن/ایمیل/آدرس               | Footer/Contact                   | Verified business config              | HIDDEN_UNTIL_CONFIGURED      | پس از تأیید نمایش داده شود.                    | Hidden                    | Operations               |
|  54 | شبکه اجتماعی                  | Footer                           | Official URL/ownership                | HIDDEN_UNTIL_CONFIGURED      | نمایش داده نشود.                               | Hidden                    | Marketing                |
|  55 | خبرنامه فعال                  | Home/Footer                      | Provider + consent + privacy          | HIDDEN_UNTIL_CONFIGURED      | بخش پنهان.                                     | Hidden                    | Marketing + Legal        |
|  56 | ورود/ثبت‌نام فعال             | Auth                             | Backend/security flows                | HIDDEN_UNTIL_CONFIGURED      | در دسترس نیست.                                 | Hidden/disabled           | Engineering              |
|  57 | فرم تماس ثبت می‌کند           | Contact                          | Endpoint + ticket ID                  | HIDDEN_UNTIL_CONFIGURED      | success فقط پس از response.                    | Hidden/disabled           | Engineering + Support    |
|  58 | Checkout/پرداخت فعال          | Cart                             | Order/payment services                | HIDDEN_UNTIL_CONFIGURED      | پرداخت فعال نیست.                              | Hidden/disabled           | Engineering + Finance    |

## تغییر status

برای CONFIRMED: owner مدرک را ثبت کند؛ scope، اعتبار، fallback و expiry مشخص شود؛ Legal/Operations تأیید کنند؛ copy و schema هم‌زمان بازبینی و رفتار نبود داده تست شود.

## Evidence حداقلی

اصالت: زنجیره تأمین/SKU/scope؛ گارانتی: provider/مدت/پوشش؛ ارسال: carrier/SLA/cost؛ مرجوعی: policy/استثنا/فرآیند؛ موجودی: API/timestamp؛ قیمت: service/history؛ review: records/moderation؛ آمار: metric/report؛ نمایندگی: مجوز؛ مجوز/درگاه: URL استعلام؛ SLA: ظرفیت و اندازه‌گیری.

## قواعد سخت

`PROHIBITED` با نرم‌کردن copy مجاز نمی‌شود؛ evidence برند همه SKUها را تأیید نمی‌کند؛ انواع گارانتی یکسان نیستند؛ کارت/جعبه/serial به‌تنهایی اثبات قطعی نیست؛ structured data همین statusها را رعایت کند؛ demo fallback در Production ممنوع.
