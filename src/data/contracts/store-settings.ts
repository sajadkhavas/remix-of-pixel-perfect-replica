import type { ValidatedPublicStoreSettings } from "../../domain/store-settings";

/**
 * Versioned public transport boundary. Every field remains unknown until runtime validation.
 */
export interface PublicStoreSettingsDtoV1 {
  readonly schemaVersion: unknown;
  readonly brand: unknown;
  readonly legal: unknown;
  readonly contact: unknown;
  readonly support: unknown;
  readonly social: unknown;
  readonly shipping: unknown;
  readonly returns: unknown;
  readonly warranty: unknown;
  readonly authenticity: unknown;
  readonly trust: unknown;
  readonly enamad: unknown;
  readonly payment: unknown;
  readonly currency: unknown;
  readonly features: unknown;
  readonly seo: unknown;
  readonly organization: unknown;
  readonly contentVisibility: unknown;
  readonly environment: unknown;
}

/**
 * Raw admin input is intentionally not trusted. A future admin adapter must validate and normalize it.
 */
export interface AdminStoreSettingsInput {
  readonly version?: unknown;
  readonly payload: unknown;
  readonly submittedBy?: unknown;
  readonly submittedAt?: unknown;
}

export interface StoreSettingsRepository {
  getPublicSettings(): Promise<ValidatedPublicStoreSettings>;
}

/**
 * Future remote adapters implement this interface without assuming an endpoint in the frontend.
 */
export interface RemoteStoreSettingsSource {
  loadPublicSettingsPayload(): Promise<unknown>;
}
