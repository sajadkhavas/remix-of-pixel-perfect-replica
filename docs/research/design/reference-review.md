# بررسی مراجع طراحی و پژوهش

**هدف:** استخراج الگوهای قابل تبدیل به سیستم برای KRONOS، نه کپی ظاهر یک برند.  
**روش:** بررسی صفحات رسمی برندها/خرده‌فروشان، منابع usability و performance، و نمونه‌های award-oriented.  
**تاریخ دسترسی:** 2026-08-05

## معیار ارزیابی

برای هر مرجع پنج سؤال بررسی شده است:

1. چه چیزی ارزش الگوبرداری دارد؟
2. چه چیزی نباید کپی شود؟
3. چه چیزی برای RTL نیازمند بازتفسیر است؟
4. چه چیزی performance risk دارد؟
5. چه چیزی می‌تواند به قرارداد سیستم KRONOS تبدیل شود؟

## مراجع برند و محصول

| مرجع        | ارزش الگوبرداری                                                          | نباید کپی شود                                               | نکته RTL                                                  | Performance risk                   | تبدیل به سیستم KRONOS                        |
| ----------- | ------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------- | -------------------------------------------- |
| Apple       | clarity، product-first composition، progressive disclosure، کنترل motion | تقلید heroهای سخت‌افزاری/scroll choreography بدون منابع اپل | sequence روایت باید از inline-start RTL بازطراحی شود      | ویدیو و scroll-linked canvas سنگین | «یک پیام/یک محصول/یک CTA» در هر viewport     |
| Rolex       | تمرکز روی محصول و heritage، photography بسیار کنترل‌شده                  | رنگ سبز/طلایی، wordmark، framing و interaction اختصاصی برند | navigation و collection rail باید semantic RTL شود        | hero media و transitions تمام‌صفحه | نسبت ثابت packshot، صفحه collection آرام     |
| Omega       | ترکیب campaign با engineering detail                                     | ادعاهای مسابقه/فضا و هویت بصری برند                         | timeline و specification order بازچینش شود                | video campaign و media kitهای بزرگ | story block + factual spec block             |
| Grand Seiko | macro texture، طبیعت/مواد، سکوت بصری                                     | تقلید مفهوم ژاپنی/داستان برند                               | captionهای mixed language نیازمند isolation               | macroهای رزولوشن بالا              | macro detail slot برای dial/movement         |
| Cartier     | pure shape، feed/grid switch، فیلتر متریال/collection                    | typography، red accent و composition جواهرمحور              | filter drawer و sort باید از راست و با logical properties | تعداد زیاد variant image           | تمایز Browse by collection/material          |
| TAG Heuer   | taxonomy روشن collection، پیوند خدمات و product                          | motorsport identity و motion پرسرعت                         | mega-menu نیازمند keyboard-first RTL                      | video/campaign modules             | navigation مبتنی بر collection + services    |
| Breitling   | product family clarity و technical tone                                  | yellow brand cues و aviation narrative                      | مقایسه مشخصات از راست به چپ ولی اعداد isolate             | high-res campaign                  | spec hierarchy و collection selector         |
| IWC         | engineering storytelling و service depth                                 | dark industrial styling اختصاصی                             | long-form editorial alignment نیازمند RTL typesetting     | cinematic media                    | evidence card برای material/movement/service |

## مراجع commerce/editorial

| مرجع         | ارزش الگوبرداری                                  | نباید کپی شود                               | نکته RTL                                                      | Performance risk            | تبدیل به سیستم KRONOS                    |
| ------------ | ------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------- | --------------------------- | ---------------------------------------- |
| Hodinkee     | editorial-first taxonomy، اعتبار از محتوای تخصصی | تقلید tone تحریریه یا claims تخصصی بدون تیم | metadata/byline/category باید RTL و LTR names را جدا کند      | feed طولانی و image density | Magazine card با taxonomy ثابت           |
| MR PORTER    | navigation عمیق، فیلتر و content-commerce bridge | visual language fashion retailer            | mega-menu ستون‌ها باید mirror نشوند؛ order منطقی بازتعریف شود | تعداد بالای tile/image      | Shop by collection + guide/service links |
| SSENSE       | restraint، grid density، typography خنثی         | austerity بیش از حد برای خرید ساعت          | alignment و reading order باید فارسی‌محور باشد                | lazy grid طولانی            | neutral catalog mode                     |
| NET-A-PORTER | فیلترهای facet، sort واضح، badges محدود          | language تجملی و category model زنانه       | filter hierarchy و chips باید RTL QA شود                      | catalog image volume        | facet schema + applied filters summary   |
| Farfetch     | marketplace comparison و brand breadth           | شلوغی promotion/personalization             | mixed-price/currency نیازمند bidi isolation                   | personalization scripts     | variant/brand breadth بدون clutter       |

## پژوهش usability، accessibility و performance

| منبع                           | یافته قابل استفاده                                                                            | قرارداد KRONOS                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Baymard — Product Page UX      | gallery و product image coverage برای تصمیم خرید حیاتی است؛ thumbnailها از dots قابل فهم‌ترند | PDP باید primary، side، back، clasp، wrist، movement و packaging را پشتیبانی کند؛ thumbnail قابل مشاهده |
| Baymard — E-commerce filtering | facetها، applied filters و mobile filter usability باید ساختاری باشند                         | state فیلتر در URL، خلاصه فیلتر فعال، clear جزئی و کلی                                                  |
| Nielsen Norman Group           | visibility of system status، consistency و user control بر تزئین مقدم است                     | feedback خرید/فیلتر/search فوری و قابل فهم؛ motion فقط توضیح state                                      |
| W3C WCAG                       | focus قابل مشاهده، contrast و کاهش motion نیاز پایه‌اند                                       | focus مستقل، contrast test، `prefers-reduced-motion` با جایگزین روشن                                    |
| web.dev                        | اندازه مناسب، فرمت مدرن و responsive images روی performance اثر مستقیم دارند                  | AVIF/WebP، `srcset/sizes`، width/height، LCP media priority، lazy below-fold                            |
| Material motion guidance       | motion باید رابطه فضایی و تغییر state را توضیح دهد                                            | duration/easing محدود و component-specific                                                              |
| Apple HIG                      | clarity، deference، reduced motion و control                                                  | product/content first؛ animation optional؛ autoplay قابل توقف                                           |

## Awwwards: استفاده صحیح

Awwwards برای **art direction، composition و جسارت روایی** مرجع است، نه معیار مستقیم usability یا performance. یک نمونه می‌تواند در animation امتیاز بالا بگیرد ولی هنوز برای commerce با keyboard، reduced motion، catalog scale و conversion مناسب نباشد.

**قابل اقتباس:** framing، rhythm، transition between narrative chapters.  
**غیرقابل اقتباس مستقیم:** custom cursor، scroll hijacking، WebGL اجباری، متن پنهان، preload طولانی، hover-only navigation.

## فهرست منابع

- Apple Human Interface Guidelines — Accessibility and Motion: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG — Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Rolex official watches: https://www.rolex.com/watches
- Omega press/collection: https://press.omegawatches.com/section/the-collection/
- Grand Seiko collections: https://www.grand-seiko.com/benelux-en/collections/
- Cartier collections: https://www.cartier.com/en-nl/watches/collections
- TAG Heuer official: https://www.tagheuer.com/
- Breitling official watches: https://www.breitling.com/
- IWC official/press collection: https://www.iwc.com/ and https://press.iwc.com/
- Hodinkee: https://www.hodinkee.com/
- MR PORTER watches: https://www.mrporter.com/
- SSENSE: https://www.ssense.com/
- NET-A-PORTER watches: https://www.net-a-porter.com/en-nl/shop/jewelry-and-watches/fine-watches
- Farfetch watches: https://www.farfetch.com/
- Baymard Product Page UX: https://baymard.com/research/product-page
- Baymard Product Images: https://baymard.com/blog/product-page-image-gallery
- Nielsen Norman Group: https://www.nngroup.com/
- W3C Focus Appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- W3C Reduced Motion Technique C39: https://www.w3.org/WAI/WCAG21/Techniques/css/C39
- web.dev responsive images: https://web.dev/learn/images/
- Material motion: https://m3.material.io/styles/motion/overview
- Awwwards: https://www.awwwards.com/

## نتیجه پژوهش

مسیر KRONOS باید از «اثر نمایشی عمومی» به **فروشگاه editorial دقیق** تبدیل شود: تصویر محصول با کیفیت و factual، typography فارسی مناسب، whitespace حساب‌شده، motion محدود، و ابزارهای خرید همیشه واضح. هیچ برند مرجع به‌صورت pixel-perfect تقلید نمی‌شود.
