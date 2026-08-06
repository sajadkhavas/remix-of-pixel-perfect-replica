import type { StoreSettingsRepository } from "../data/contracts/store-settings";
import { DEVELOPMENT_STORE_SETTINGS_FIXTURE } from "../data/fixtures/store-settings";
import {
  EnvironmentStoreSettingsRepository,
  StaticStoreSettingsRepository,
  type PublicStoreSettingsEnvironment,
} from "../lib/store-settings";

export interface StoreSettingsCompositionOptions {
  readonly environment?: PublicStoreSettingsEnvironment;
  readonly staticSettings?: unknown;
  readonly useDevelopmentFixture?: boolean;
}

export function createStoreSettingsRepository(
  options: StoreSettingsCompositionOptions = {},
): StoreSettingsRepository {
  if (options.staticSettings !== undefined) {
    return new StaticStoreSettingsRepository(
      options.staticSettings,
      options.environment?.MODE === "production" ? "production" : "development",
    );
  }

  const environment = options.environment;
  if (
    options.useDevelopmentFixture !== false &&
    (!environment || environment.MODE === "development") &&
    !environment?.VITE_PUBLIC_STORE_SETTINGS_JSON
  ) {
    return new StaticStoreSettingsRepository(DEVELOPMENT_STORE_SETTINGS_FIXTURE, "development");
  }

  return new EnvironmentStoreSettingsRepository(environment ?? { MODE: "development" });
}
