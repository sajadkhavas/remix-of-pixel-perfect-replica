import { createContext, useContext } from "react";

import type { PublicStoreSettings } from "@/domain/store-settings";
import { PUBLIC_STORE_SETTINGS } from "./store-settings-runtime";

export const StoreSettingsContext = createContext<PublicStoreSettings>(PUBLIC_STORE_SETTINGS);

export function usePublicStoreSettings(): PublicStoreSettings {
  return useContext(StoreSettingsContext);
}
