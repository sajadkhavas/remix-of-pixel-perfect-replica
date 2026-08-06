# F12 Storefront Configuration Audit

## Scope

This audit converts the accepted F1 trust rules and F2 repository architecture into a public store-settings boundary. It does not change routes, components, commerce state, product data, catalog data, SEO runtime code, or the generated route tree.

## Governing decisions

- `/shop` remains the accepted catalog route family.
- Domain contracts and repository boundaries remain the frontend source of truth.
- Missing configuration is hidden instead of being replaced with a fabricated phone, address, promise, count, badge, provider, or commercial claim.
- Prototype copy is not evidence.
- Public settings may enter the browser bundle; transaction and administration secrets may not.
- Development fixtures are `noindex` and are internally identified as fixtures. The UI does not need a “demo version” label.

## Configuration needs

### Brand identity

- Prototype risk: names and slogans are scattered through the UI.
- Required contract: a required typed brand name plus optional localized name, short name, slogan, and logo.
- Safe missing behavior: keep only the confirmed project name.

### Legal identity

- Prototype risk: placeholder business identity can be rendered as fact.
- Required contract: optional legal name, national ID, registration number, representative, and privacy contact.
- Safe missing behavior: hide the legal identity block.

### Public contact

- Prototype risk: placeholder phone, email, and address values exist.
- Required contract: evidence-aware E.164 phone records, email records, and structured address data.
- Safe missing behavior: return an empty contact projection.

### Support hours

- Prototype risk: the seven-days-a-week statement is unverified.
- Required contract: timezone, weekday intervals, confirmation status, and evidence metadata.
- Safe missing behavior: hide the schedule and response-time claim.

### Social links

- Prototype risk: placeholder `#` links and uncertain profile ownership.
- Required contract: platform enum, HTTPS URL, platform-host validation, status, and evidence.
- Safe missing behavior: filter every unconfirmed or malformed link.

### Shipping

- Prototype risk: free, insured, and fast shipping claims are unsupported.
- Required contract: configured and enabled state, policy path, estimator state, optional threshold, currency, and evidence-aware claim.
- Safe missing behavior: show no shipping promise or free-shipping label.

### Returns

- Prototype risk: a seven-day return window is asserted without policy evidence.
- Required contract: configured and enabled state, policy path, optional verified window, and evidence-aware summary.
- Safe missing behavior: hide return copy and CTA.

### Warranty

- Prototype risk: generic and two-year warranty statements are unsupported.
- Required contract: configured and enabled state, policy path, and evidence-aware summary.
- Safe missing behavior: hide warranty badge and CTA.

### Authenticity

- Prototype risk: a global authenticity guarantee is asserted without SKU-scoped evidence.
- Required contract: configured and enabled state, policy path, and evidence-aware summary.
- Safe missing behavior: hide the authenticity claim.

### Trust providers

- Prototype risk: a logo can imply an endorsement or active verification.
- Required contract: provider ID, verification URL, public logo asset, enabled state, and claim evidence.
- Safe missing behavior: filter the provider.

### Enamad

- Prototype risk: arbitrary HTML, script, incomplete identity data, or an unverified domain could create a false badge.
- Required contract: allowlisted provider, public identifier, verified domain, verification URL, public asset, status, and timestamp.
- Safe missing behavior: keep Enamad disabled and hidden.

### Payment presentation

- Prototype risk: footer logos can imply an active gateway.
- Required contract: allowlisted public presentation fields, enabled state, supported currencies, display order, and explicit checkout mode.
- Safe missing behavior: filter disabled providers and expose no gateway promise.

### Currency and price formatting

- Prototype risk: rial-domain amounts and toman labels can be mixed.
- Required contract: supported currency, locale, divisor, fraction digits, grouping, and public unit label.
- Safe missing behavior: use a validated minimal IRR presentation without inventing prices.

### Feature flags

- Prototype risk: dead CTA and backend-dependent behavior can appear active.
- Required contract: typed flags with validated public-capability dependencies.
- Safe missing behavior: invalid configuration falls back with unsafe and backend-dependent features off.

### SEO defaults

- Prototype risk: store identity and robots behavior can diverge by page.
- Required contract: public site URL, title defaults, description, locale, robots rule, and optional public image.
- Safe missing behavior: use a neutral `noindex,nofollow` fallback.

### Organization data

- Prototype risk: structured data can overclaim legal or contact information.
- Required contract: public name, optional confirmed legal name, URL, logo, and confirmed `sameAs` links.
- Safe missing behavior: emit only configured fields in a later owning phase.

### Content visibility

- Prototype risk: configured data can still be intentionally unpublished or unverified.
- Required contract: explicit gates for each public content group.
- Safe missing behavior: every group is hidden by default.

### Environment metadata

- Prototype risk: fixture, staging, and production data can be confused.
- Required contract: environment name, source, fixture marker, configuration version, and public capability states.
- Safe missing behavior: use a development-safe hidden fallback.

## Public and private classification

Public browser-safe fields include brand presentation, confirmed public contact, policy presentation, enabled public payment labels, public verification URLs, public identifiers, public logo assets, currency formatting, feature flags, SEO defaults, organization presentation, content visibility, and non-secret environment metadata.

Server-only fields include merchant secrets, gateway private keys, API secrets, callback and webhook secrets, gateway passwords, signing keys, database credentials, admin tokens, encryption keys, SMTP passwords, private certificates, and access tokens.

These secret categories are declared only in a type-only server boundary and are absent from the strict public schema. An unknown secret-shaped key invalidates the public payload and produces the safe hidden fallback.

## Integration seams

- Routes and components will consume `StoreSettingsRepository` in their owning phases.
- `StaticStoreSettingsRepository` supports fixtures and injected settings.
- `EnvironmentStoreSettingsRepository` accepts a public JSON value supplied by composition and does not invent an API endpoint.
- A future remote adapter implements `RemoteStoreSettingsSource` and validates the payload with the same schema.
- Admin input remains `unknown` until validation and normalization.

## Release blockers represented by configuration

Production remains blocked, or the related surface remains hidden, until the client confirms legal identity, contact, support hours, shipping, returns, warranty, authenticity policy, official social links, Enamad, payment providers, currency display, privacy contact, legal representative, and permission to display third-party brand logos.
