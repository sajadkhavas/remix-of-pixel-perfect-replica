# Visual Acceptance Checklist

برای هر صفحه/feature، reviewer باید نتیجه را با **Pass / Fail / N/A + evidence** ثبت کند.

## Hierarchy & content

- [ ] هدف صفحه در 5 ثانیه قابل تشخیص است.
- [ ] یک primary action روشن وجود دارد.
- [ ] نام، قیمت، availability و CTA در commerce رقابت بصری ندارند.
- [ ] ادعاها، اعداد، تماس و badges تأیید و sourceدار هستند.
- [ ] decorative content از factual content متمایز است.
- [ ] content density در mobile قابل اسکن است.

## Typography

- [ ] فارسی با فونت فارسی انتخاب‌شده render می‌شود.
- [ ] Latin brand و اعداد bidi-isolated هستند.
- [ ] متن ضروری کمتر از 12px نیست.
- [ ] line-height و max line length مطابق direction است.
- [ ] tracking زیاد روی فارسی وجود ندارد.
- [ ] fallback/font swap باعث layout shift محسوس نمی‌شود.

## Spacing, grid, alignment

- [ ] container و column contract رعایت شده.
- [ ] vertical rhythm consistent است.
- [ ] mobile در 320/360/390px horizontal page scroll ندارد.
- [ ] logical start/end و RTL alignment صحیح است.
- [ ] asymmetry reading order را خراب نمی‌کند.
- [ ] fixed/sticky UI content را نمی‌پوشاند.

## Color & contrast

- [ ] accent budget رعایت شده.
- [ ] text contrast بررسی شده.
- [ ] focus روی همه surfaces دیده می‌شود.
- [ ] stateها فقط با رنگ منتقل نمی‌شوند.
- [ ] disabled و muted هنوز خوانا هستند.
- [ ] sale/error/warning از هم قابل تشخیص‌اند.

## Responsive & touch

- [ ] mobile composition مستقل است، نه scale-down.
- [ ] touch targetها حداقل 44×44 هستند.
- [ ] hover-only functionality وجود ندارد.
- [ ] orientation و dynamic viewport تست شده.
- [ ] safe-area bottom/top رعایت شده.
- [ ] keyboard بازشده overlay/CTA را نمی‌پوشاند.

## Keyboard & accessibility

- [ ] tab order با visual order منطبق است.
- [ ] focus trap/return focus در overlayها کار می‌کند.
- [ ] Escape/close controls وجود دارد.
- [ ] heading hierarchy و landmarks درست‌اند.
- [ ] live feedback برای cart/filter/error وجود دارد.
- [ ] zoom text 200٪ و browser zoom قابل استفاده است.

## Motion

- [ ] یک motion focal point در viewport.
- [ ] autoplay قابل توقف یا حذف شده.
- [ ] reduced-motion composition مستقل تست شده.
- [ ] یک transform فقط یک owner دارد.
- [ ] continuous background animation در commerce وجود ندارد.
- [ ] motion input delay یا scroll jank ایجاد نمی‌کند.

## Images/assets

- [ ] image source/license در manifest ثبت شده.
- [ ] product image با SKU واقعی تطابق دارد.
- [ ] desktop/mobile crop و focal point تأیید شده.
- [ ] dimensions/srcset/sizes وجود دارد.
- [ ] LCP image priority درست است؛ below-fold lazy.
- [ ] image error fallback وجود دارد.
- [ ] repeated/unrelated images وجود ندارد.
- [ ] alt intent متناسب با نقش تصویر است.

## States

- [ ] loading ساختار را حفظ می‌کند.
- [ ] skeleton با final layout برابر است.
- [ ] empty state recovery دارد.
- [ ] error state علت/راه‌حل دارد.
- [ ] offline state تعریف شده.
- [ ] out-of-stock/low-stock/sale/new/limited factual هستند.

## Performance / CLS

- [ ] media budget صفحه ثبت شده.
- [ ] هیچ PNG سنگین بدون دلیل delivery نمی‌شود.
- [ ] blur/parallax/canvas روی mobile محدود است.
- [ ] font/image dimensions از CLS جلوگیری می‌کنند.
- [ ] sticky transitions layout shift ایجاد نمی‌کنند.
- [ ] first interaction بدون انتظار animation پاسخ می‌دهد.

## Sign-off

- Page/feature:
- Viewports tested:
- Reduced-motion tested:
- Keyboard tested:
- Asset manifest reviewed:
- Known exceptions:
- Owner:
- Reviewer:
- Date:
