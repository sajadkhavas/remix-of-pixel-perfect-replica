import { createContext, useContext, type ReactNode } from "react";

import { DEVELOPMENT_STORE_SETTINGS_FIXTURE } from "@/data/fixtures/store-settings";
import type {
  StoreEnvironmentName,
  ValidatedPublicStoreSettings,
} from "@/domain/store-settings";
import {
  parsePublicStoreSettingsJson,
  validatePublicStoreSettings,
} from "@/lib/store-settings";

export interface PublicStoreSettingsRuntimeEnvironment {
  readonly MODE?: string;
  readonly VITE_PUBLIC_STORE_SETTINGS_JSON?: string;
}

function normalizeEnvironmentName(mode: string | undefined): StoreEnvironmentName {
  if (mode === "production" || mode === "staging") return mode;
  return "development";
}

export function resolvePublicStoreSettings(
  environment: PublicStoreSettingsRuntimeEnvironment,
): ValidatedPublicStoreSettings {
  const rawSettings = environment.VITE_PUBLIC_STORE_SETTINGS_JSON?.trim();

  if (rawSettings) {
    return parsePublicStoreSettingsJson(
      rawSettings,
      normalizeEnvironmentName(environment.MODE),
    ).settings;
  }

  // Fail closed when deployment configuration is missing. The development fixture
  // intentionally exposes no commercial promises, contact data, payments, or trust badges.
  return validatePublicStoreSettings(
    DEVELOPMENT_STORE_SETTINGS_FIXTURE,
    "development",
  ).settings;
}

export const PUBLIC_STORE_SETTINGS = resolvePublicStoreSettings({
  MODE: import.meta.env.MODE,
  VITE_PUBLIC_STORE_SETTINGS_JSON: import.meta.env.VITE_PUBLIC_STORE_SETTINGS_JSON,
});

const StoreSettingsContext = createContext<ValidatedPublicStoreSettings>(PUBLIC_STORE_SETTINGS);

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  return (
    <StoreSettingsContext.Provider value={PUBLIC_STORE_SETTINGS}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function usePublicStoreSettings(): ValidatedPublicStoreSettings {
  return useContext(StoreSettingsContext);
}
