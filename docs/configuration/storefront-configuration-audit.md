# F12 Storefront Configuration Audit

## Scope

This audit converts the accepted F1 trust rules and F2 repository architecture into a public store-settings boundary. It does not change routes, components, commerce state, product data, catalog data, SEO runtime code, or the generated route tree.

## Governing decisions

- `/shop` remains the only accepted catalog route family.
- Domain contracts and repository boundaries are the frontend source of truth.
- Missing configuration is hidden rather than replaced with a fabricated phone, address, promise, count, badge, provider, or commercial claim.
- Prototype copy is not evidence.
- Public settings may enter the browser bundle; transaction or administration secrets may not.
- Development fixtures are noindex and internally identified as fixtures, but the UI does not need a “demo version” label.

## Current configuration needs

| Area | Prototype risk | Required F12 contract | Safe missing behavior |
| --- | --- | --- | --- |
| Brand identity | Name and slogans are scattered in UI | Required typed brand name; optional localized name, slogan, logo | Keep confirmed project name only |
| Legal identity | Placeholder business identity may be rendered | Optional legal name, national ID, registration, representative, privacy contact | Hide legal block |
| Contact | Placeholder phone, email, and address exist in prototype | Evidence-aware E.164 phone, email, and structured address | Return empty contact projection |
| Support hours | “7 days a week” is unverified | Timezone, day intervals, status, evidence | Hide schedule |
| Social links | Placeholder `#` links and uncertain ownership | Platform enum, HTTPS URL, host validation, status, evidence | Filter all unconfirmed links |
| Shipping | Free/insured/fast shipping claims are unsupported | Configured/enabled state, policy path, estimator state, threshold, claim | No shipping promise or free label |
| Returns | Seven-day return claim is unsupported | Configured/enabled state, policy path, optional verified window | Hide policy CTA and copy |
| Warranty | Generic and two-year warranty claims are unsupported | Configured/enabled state, policy path, evidence-aware summary | Hide warranty badge and CTA |
| Authenticity | Global authenticity claims are unsupported | Configured/enabled state, policy path, evidence-aware summary | Hide authenticity claim |
| Trust providers | Logos can imply endorsement | Provider ID, verification URL, public logo asset, claim evidence | Filter provider |
| Enamad | Badge must not accept arbitrary HTML or script | Allowlisted provider, public identifier, verified domain, verification URL, asset, status, and timestamp | Disabled and hidden |
| Payment methods | Footer logos imply active gateways | Allowlisted public presentation fields and checkout mode | Disabled providers are filtered |
| Currency | Prototype mixes rial-domain amounts and toman labels | Supported code, locale, divisor, fraction digits, unit label | Use validated minimal IRR presentation |
| Feature flags | Dead CTA can appear before integration exists | Typed flags with public capability dependencies | Invalid config falls back to all unsafe features off |
| SEO defaults | Site identity can diverge by page | Public site URL, title defaults, description, locale, robots, image | Safe fallback is noindex |
| Organization data | Structured data can overclaim legal/contact data | Public name, optional confirmed legal name, URL, logo, sameAs | Emit only configured fields later |
| Content visibility | Configured data may still be intentionally unpublished | Explicit visibility gates by content group | Hidden by default |
| Environment | Fixture and production data can be confused | Environment name, source, fixture marker, version, capabilities | Development-safe fallback |

## Public/private classification

### Public browser-safe fields

Brand presentation, confirmed public contact, policy presentation, enabled public payment labels, public verification URLs, public identifiers, public logo assets, currency formatting, feature flags, SEO defaults, organization presentation, content visibility, and non-secret environment metadata.

### Server-only fields

Merchant secrets, gateway private keys, API secrets, callback/webhook secrets, gateway passwords, signing keys, database credentials, admin tokens, encryption keys, SMTP passwords, private certificates, and access tokens.

These fields are declared only in a type-only server boundary and are absent from the public schema. The public schema is strict, so an unknown secret-shaped key invalidates the payload and triggers a safe hidden fallback.

## Integration seams

- Routes and components will consume `StoreSettingsRepository` in their owning phases.
- `StaticStoreSettingsRepository` supports fixtures and injected settings.
- `EnvironmentStoreSettingsRepository` accepts a public JSON value supplied by composition; it does not invent an API endpoint.
- A future remote adapter implements `RemoteStoreSettingsSource` and validates its payload with the same schema.
- Admin input remains `unknown` until validation and normalization.

## Release blockers represented by configuration

Production must remain blocked or the related surface hidden until the client confirms legal identity, contact, support hours, shipping, returns, warranty, authenticity policy, official social links, Enamad, payment providers, currency display, privacy contact, legal representative, and permission to display third-party brand logos.
