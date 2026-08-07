import { createContext, useContext } from "react";

import type { ValidatedPublicStoreSettings } from "@/domain/store-settings";
import { PUBLIC_STORE_SETTINGS } from "./store-settings-runtime";

export const StoreSettingsContext = createContext<ValidatedPublicStoreSettings>(
  PUBLIC_STORE_SETTINGS,
);

export function usePublicStoreSettings(): ValidatedPublicStoreSettings {
  return useContext(StoreSettingsContext);
}
