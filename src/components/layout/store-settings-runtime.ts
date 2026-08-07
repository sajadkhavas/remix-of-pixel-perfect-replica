import { DEVELOPMENT_STORE_SETTINGS_FIXTURE } from "@/data/fixtures/store-settings";
import type { PublicStoreSettings } from "@/domain/store-settings";

/**
 * Current frontend source for public store settings.
 *
 * The fixture is contract-tested by F12 and contains no unverified public claims,
 * contacts, payments, or trust providers. Dynamic/admin-provided settings must be
 * validated at a server/build ingestion boundary before replacing this projection.
 */
export const PUBLIC_STORE_SETTINGS: PublicStoreSettings = DEVELOPMENT_STORE_SETTINGS_FIXTURE;
