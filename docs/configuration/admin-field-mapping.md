# Future Admin Field Mapping

This document maps a future admin experience to the validated public contract. It does not define an admin route, API, database, or secret-storage implementation.

## General rules

- Admin input is untrusted and must pass the runtime schema before publication.
- Sensitive values are never mapped into `PublicStoreSettings`.
- Empty optional values remain absent and do not create placeholder copy.
- Visibility defaults to off.
- A confirmed value requires evidence reference, verifier, and verification date.

## Brand identity

### `brand.name`

- Admin label: نام لاتین فروشگاه
- Input: required text
- Validation: 1–120 characters and non-empty
- Visibility: global
- Classification: public
- Default: block publication when empty
- Owner: global shell

### `brand.localizedName`, `brand.shortName`, and `brand.slogan`

- Admin labels: نام فارسی، نام کوتاه، شعار تأییدشده
- Input: optional text or textarea
- Validation: 120, 80, and 240 character limits
- Visibility: configured brand surfaces
- Classification: public
- Default: omit; localized name may fall back to `brand.name`
- Owner: header, home, and footer

### `brand.logo.{src,alt,width,height}`

- Admin label: لوگوی عمومی
- Input: asset picker plus alt text and optional dimensions
- Validation: root-relative path or HTTPS URL; positive dimensions
- Visibility: brand surfaces
- Classification: public
- Default: render the text name only
- Owner: header and footer

## Legal identity and contact

### `legal.{legalName,nationalId,registrationNumber,legalRepresentative,privacyContactEmail}`

- Admin label: هویت حقوقی و تماس حریم خصوصی
- Input: optional text and email fields
- Validation: safe identifier shapes, character limits, and valid email
- Visibility: `contentVisibility.legalIdentity` or the owning legal policy
- Classification: public after client confirmation
- Default: hide the legal block
- Owner: legal pages, privacy, and footer

### `contact.phones[].{id,label,e164,displayValue,status,evidence}`

- Admin label: تلفن عمومی
- Input: repeatable phone record
- Validation: unique ID, E.164 number, status enum, evidence when confirmed
- Visibility: `contentVisibility.contact` and confirmed status
- Classification: public
- Default: filter the record
- Owner: contact and footer

### `contact.emails[].{id,label,address,status,evidence}`

- Admin label: ایمیل عمومی
- Input: repeatable email record
- Validation: unique ID, valid email, status enum, evidence when confirmed
- Visibility: `contentVisibility.contact` and confirmed status
- Classification: public
- Default: filter the record
- Owner: contact and footer

### `contact.address.{countryCode,province,city,district,street,building,postalCode,status,evidence}`

- Admin label: نشانی عمومی
- Input: structured address
- Validation: ISO country code, safe postal code, limits, evidence when confirmed
- Visibility: `contentVisibility.contact` and confirmed status
- Classification: public
- Default: hide the complete address; missing parts are omitted
- Owner: contact and footer

## Support and social

### `support.businessHours.{timezone,days[],status,evidence}`

- Admin label: ساعات پشتیبانی
- Input: timezone and weekly interval editor
- Validation: unique weekdays, valid opening intervals, evidence when confirmed
- Visibility: `contentVisibility.supportHours`
- Classification: public
- Default: hide the schedule
- Owner: contact and support

### `support.responseTimeClaim`

- Admin label: ادعای زمان پاسخ
- Input: evidence-aware claim editor
- Validation: claim status rules and evidence for confirmed text
- Visibility: claim resolver
- Classification: public
- Default: hidden
- Owner: contact and support

### `social.links[].{platform,url,label,status,evidence}`

- Admin label: شبکه‌های اجتماعی
- Input: repeatable platform and URL record
- Validation: platform allowlist, HTTPS, matching host, evidence when confirmed
- Visibility: `contentVisibility.socialLinks`
- Classification: public
- Default: filter malformed or unconfirmed records
- Owner: footer and contact

## Shipping, returns, warranty, and authenticity

### `shipping.{configured,enabled,policyPath,estimatorConfigured}`

- Admin label: تنظیمات پایه ارسال
- Input: toggles and root-relative policy path
- Validation: enabled requires configured; estimator feature requires capability
- Visibility: `contentVisibility.shipping`
- Classification: public metadata
- Default: disabled and hidden
- Owner: shipping, product, cart, and checkout

### `shipping.{freeShippingThresholdMinor,freeShippingCurrency,presentationClaim}`

- Admin label: آستانه و متن عمومی ارسال
- Input: integer money, currency select, and evidence-aware claim
- Validation: non-negative threshold paired with supported currency; evidence rules
- Visibility: shipping configuration and claim resolver
- Classification: public
- Default: no free-shipping or operational promise
- Owner: announcement, product, services, and cart

### `returns.{configured,enabled,policyPath,windowDays,presentationClaim}`

- Admin label: قوانین مرجوعی
- Input: toggles, path, optional day count, and evidence-aware claim
- Validation: enabled requires configured path; day count is 1–365
- Visibility: `contentVisibility.returns` and `features.returnPolicy`
- Classification: public
- Default: hide policy CTA, duration, and claim
- Owner: returns, product, cart, and FAQ

### `warranty.{configured,enabled,policyPath,presentationClaim}`

- Admin label: قوانین گارانتی
- Input: toggles, path, and evidence-aware claim
- Validation: enabled requires configured path and confirmed evidence for claims
- Visibility: `contentVisibility.warranty` and `features.warranty`
- Classification: public
- Default: hide badge and CTA
- Owner: warranty, product, and services

### `authenticity.{configured,enabled,policyPath,presentationClaim}`

- Admin label: سیاست اصالت
- Input: toggles, path, and evidence-aware claim
- Validation: enabled requires configured path; claims require scoped evidence
- Visibility: `contentVisibility.authenticity`
- Classification: public
- Default: hide the authenticity claim and CTA
- Owner: authenticity, product, and trust

## Trust, Enamad, and payment presentation

### `trust.claims[]`

- Admin label: رجیستری ادعاها
- Input: repeatable evidence-aware claim editor
- Validation: status enum, source text, evidence, and missing-evidence behavior
- Visibility: claim resolver
- Classification: public
- Default: hidden
- Owner: global trust surfaces

### `trust.providers[].{providerId,displayName,enabled,verificationUrl,logo,claim}`

- Admin label: ارائه‌دهنده اعتماد
- Input: repeatable provider record
- Validation: safe ID, HTTPS verification URL, public asset, and claim when enabled
- Visibility: `contentVisibility.trustProviders`
- Classification: public
- Default: filter the provider
- Owner: footer and trust

### `enamad.{enabled,provider,publicIdentifier,verificationUrl,logoAsset,verifiedDomain,status,lastVerifiedAt}`

- Admin label: اینماد
- Input: verified public record; no HTML or script field
- Validation: provider allowlist, HTTPS `enamad.ir`, hostname, public asset, timestamp
- Visibility: `features.enamad` and `contentVisibility.enamad`
- Classification: public
- Default: `unconfigured`, disabled, and hidden
- Owner: footer and trust

### `payment.{checkoutMode,methods[]}`

- Admin label: حالت تکمیل خرید و روش‌های پرداخت نمایشی
- Input: mode select and repeatable public provider record
- Validation: provider allowlist, unique IDs, enabled state, order, currencies, public copy
- Visibility: `features.paymentMethods` and `contentVisibility.paymentMethods`
- Classification: public presentation only
- Default: checkout disabled and all methods filtered
- Owner: cart, checkout, and footer

### `payment.methods[].{providerId,displayName,logo,enabled,displayOrder,publicDescription,supportedCurrencies}`

- Admin label: روش پرداخت عمومی
- Input: provider select, text, asset, toggle, order, description, and currencies
- Validation: no secret fields; online mode needs an enabled online provider
- Visibility: enabled method plus payment visibility gates
- Classification: public
- Default: omit the method
- Owner: checkout and footer

## Currency, features, SEO, and organization

### `currency.{defaultCurrency,supportedCurrencies,defaultLocale,supportedLocales,prices[]}`

- Admin label: ارز و قواعد نمایش قیمت
- Input: selects and repeatable price-presentation records
- Validation: supported enums, positive divisor, valid fraction range, locale coverage
- Visibility: global price surfaces
- Classification: public
- Default: validated IRR presentation with no invented price
- Owner: global pricing

### `features.{wishlist,compare,recentlyViewed,quickView,reviews,ratings,newsletter,contactForm,auth,checkout,enamad,paymentMethods,shippingEstimator,returnPolicy,warranty}`

- Admin label: قابلیت‌های فرانت
- Input: typed toggle group
- Validation: backend and configuration dependencies; ratings require reviews
- Visibility: per feature
- Classification: public
- Default: backend-dependent and unsafe flags off
- Owner: global composition

### `seo.{siteUrl,defaultTitle,titleTemplate,defaultDescription,defaultLocale,robots,defaultImage}`

- Admin label: پیش‌فرض‌های SEO
- Input: URL, text, locale, robots select, and optional asset
- Validation: `%s` title token, HTTPS in production, neutral supported copy
- Visibility: SEO output in an owning integration phase
- Classification: public
- Default: neutral title and `noindex,nofollow`
- Owner: global SEO

### `organization.{publicName,legalName,url,logo,sameAs}`

- Admin label: داده عمومی سازمان
- Input: text, URL, asset, and URL list
- Validation: confirmed legal name, safe URLs, HTTPS official profiles
- Visibility: future organization structured data
- Classification: public
- Default: public brand name, empty `sameAs`, and no legal claim
- Owner: SEO and organization

### `contentVisibility.{legalIdentity,contact,supportHours,socialLinks,shipping,returns,warranty,authenticity,trustProviders,enamad,paymentMethods}`

- Admin label: نمایش گروه‌های محتوا
- Input: typed toggle group
- Validation: each gate requires configured and evidence-valid source data
- Visibility: direct public gate
- Classification: public
- Default: all false
- Owner: global composition

### `environment.{name,source,fixture,configurationVersion,updatedAt,capabilities}`

- Admin label: محیط، منبع، نسخه، و آمادگی Integration
- Input: fixed environment metadata and capability status group
- Validation: environment enums, semantic version, production cannot be fixture
- Visibility: diagnostics and feature dependency checks
- Classification: non-secret public metadata
- Default: development, static, non-fixture safe fallback, capabilities unavailable
- Owner: configuration composition

## Explicitly unmapped sensitive fields

Merchant IDs that authenticate requests, merchant secrets, private keys, callback and webhook secrets, gateway passwords, signing keys, database credentials, admin tokens, encryption keys, SMTP passwords, private certificates, and access tokens are managed only by future server infrastructure. They have no frontend key, admin-to-public mapping, fixture value, or environment example in F12.
