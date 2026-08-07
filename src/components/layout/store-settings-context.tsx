import { createContext, useContext, type ReactNode } from "react";

import type { ValidatedPublicStoreSettings } from "@/domain/store-settings";
import { PUBLIC_STORE_SETTINGS } from "./store-settings-runtime";

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
