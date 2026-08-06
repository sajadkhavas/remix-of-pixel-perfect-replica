# Public and Private Store Configuration Boundary

## Browser rule

Only `ValidatedPublicStoreSettings` may be returned by a frontend settings repository. Raw JSON, admin form payloads, transport DTOs, and server secrets are not frontend domain data.

## Contracts

| Contract | Runtime use in F12 | Purpose |
| --- | --- | --- |
| `PublicStoreSettings` | Yes | Typed public domain model before nominal validation branding |
| `ValidatedPublicStoreSettings` | Yes | Only settings value repositories return |
| `PublicStoreSettingsDtoV1` | Boundary only | Unknown transport fields that require runtime validation |
| `AdminStoreSettingsInput` | Boundary only | Future untrusted admin submission envelope |
| `ServerOnlyStoreSecrets` | Type-only, never imported by browser composition | Explicit location for secret categories |

## Forbidden public keys

`merchantSecret`, `merchantIdSecret`, `privateKey`, `apiSecret`, `webhookSecret`, `callbackSecret`, `gatewayPassword`, `signingKey`, `databasePassword`, `connectionString`, `adminToken`, `encryptionKey`, `smtpPassword`, `privateCertificate`, and `accessToken` are not members of the public model.

The runtime public schema uses strict objects at every level. Extra keys are rejected. Invalid payloads produce structured issues and a safe fallback with contact, trust, Enamad, payments, operational promises, and backend-dependent features disabled.

## Enamad safety

- Provider is allowlisted as `enamad`.
- Arbitrary HTML and script are not accepted fields.
- Logo is an asset reference, not markup.
- Verification URL must use HTTPS and an `enamad.ir` host.
- Enabled state requires verified status, public identifier, verified domain, verification URL, logo asset, and verification timestamp.
- Missing or malformed data cannot activate presentation.

## Payment safety

Public payment configuration contains only provider ID, display name, logo, enabled state, display order, public description, and supported currencies. Checkout mode is explicit: `disabled`, `manual`, or `online`.

An online mode requires an enabled allowlisted online provider. Manual mode may operate without exposing an online gateway. Secrets, callback credentials, transaction execution, and gateway requests remain outside F12.
