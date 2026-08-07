import type { ReactNode } from "react";

import { StoreSettingsContext } from "./store-settings-context";
import { PUBLIC_STORE_SETTINGS } from "./store-settings-runtime";

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  return (
    <StoreSettingsContext.Provider value={PUBLIC_STORE_SETTINGS}>
      {children}
    </StoreSettingsContext.Provider>
  );
}
