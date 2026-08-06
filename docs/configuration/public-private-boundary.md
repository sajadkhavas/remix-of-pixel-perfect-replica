# Public and Private Store Configuration Boundary

## Browser rule

Only `ValidatedPublicStoreSettings` may be returned by a frontend settings repository. Raw JSON, admin form payloads, transport DTOs, and server secrets are not frontend domain data.

## Contracts

### `PublicStoreSettings`

- Runtime use: yes.
- Purpose: typed public domain model before nominal validation branding.

### `ValidatedPublicStoreSettings`

- Runtime use: yes.
- Purpose: the only settings value returned by frontend repositories.

### `PublicStoreSettingsDtoV1`

- Runtime use: boundary only.
- Purpose: versioned transport fields that remain unknown until runtime validation.

### `AdminStoreSettingsInput`

- Runtime use: boundary only.
- Purpose: future untrusted admin submission envelope.

### `ServerOnlyStoreSecrets`

- Runtime use: type-only and never imported by browser composition.
- Purpose: an explicit server boundary for secret categories without fixture values.

## Forbidden public keys

The public model has no fields for `merchantSecret`, `merchantIdSecret`, `privateKey`, `apiSecret`, `webhookSecret`, `callbackSecret`, `gatewayPassword`, `signingKey`, `databasePassword`, `connectionString`, `adminToken`, `encryptionKey`, `smtpPassword`, `privateCertificate`, or `accessToken`.

The runtime public schema uses strict objects at every level. Extra keys are rejected. Invalid payloads produce structured issues and a safe fallback with contact, trust, Enamad, payments, operational promises, and backend-dependent features disabled.

## Enamad safety

- The provider is allowlisted as `enamad`.
- Arbitrary HTML and script are not accepted fields.
- The logo is an asset reference rather than markup.
- The verification URL must use HTTPS and an `enamad.ir` host.
- Enabled state requires verified status, public identifier, verified domain, verification URL, logo asset, and verification timestamp.
- Missing or malformed data cannot activate presentation.

## Payment safety

Public payment configuration contains only provider ID, display name, logo, enabled state, display order, public description, and supported currencies. Checkout mode is explicit: `disabled`, `manual`, or `online`.

Online mode requires an enabled allowlisted online provider. Manual mode can operate without exposing an online gateway. Secrets, callback credentials, transaction execution, and gateway requests remain outside F12.
