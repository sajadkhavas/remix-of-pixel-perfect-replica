import type { StoreSettingsRepository } from "../../data/contracts/store-settings";
import type {
  StoreEnvironmentName,
  ValidatedPublicStoreSettings,
} from "../../domain/store-settings";
import {
  createSafePublicStoreSettings,
  parsePublicStoreSettingsJson,
  validatePublicStoreSettings,
  type StoreSettingsValidationResult,
} from "./validation";

export interface PublicStoreSettingsEnvironment {
  readonly MODE?: string;
  readonly VITE_PUBLIC_STORE_SETTINGS_JSON?: string;
}

function normalizeEnvironmentName(value: string | undefined): StoreEnvironmentName | null {
  if (value === "development" || value === "staging" || value === "production") return value;
  return null;
}

export class StaticStoreSettingsRepository implements StoreSettingsRepository {
  private readonly validation: StoreSettingsValidationResult;

  constructor(input: unknown, fallbackEnvironment: StoreEnvironmentName = "development") {
    this.validation = validatePublicStoreSettings(input, fallbackEnvironment);
  }

  async getPublicSettings(): Promise<ValidatedPublicStoreSettings> {
    return this.validation.settings;
  }

  getValidationResult(): StoreSettingsValidationResult {
    return this.validation;
  }
}

export class EnvironmentStoreSettingsRepository implements StoreSettingsRepository {
  private readonly validation: StoreSettingsValidationResult;

  constructor(environment: PublicStoreSettingsEnvironment) {
    const environmentName = normalizeEnvironmentName(environment.MODE);

    if (!environmentName) {
      this.validation = {
        ok: false,
        settings: createSafePublicStoreSettings("development"),
        issues: [
          {
            path: "environment.MODE",
            code: "invalid_environment",
            message: "MODE must be development, staging, or production",
          },
        ],
      };
      return;
    }

    const raw = environment.VITE_PUBLIC_STORE_SETTINGS_JSON;
    if (!raw?.trim()) {
      this.validation = {
        ok: false,
        settings: createSafePublicStoreSettings(environmentName),
        issues: [
          {
            path: "environment.VITE_PUBLIC_STORE_SETTINGS_JSON",
            code: "missing_public_settings",
            message: "Public store settings JSON is not configured",
          },
        ],
      };
      return;
    }

    const parsed = parsePublicStoreSettingsJson(raw, environmentName);
    if (parsed.ok && parsed.settings.environment.name !== environmentName) {
      this.validation = {
        ok: false,
        settings: createSafePublicStoreSettings(environmentName),
        issues: [
          {
            path: "environment.name",
            code: "environment_mismatch",
            message: "Public settings environment must match MODE",
          },
        ],
      };
      return;
    }

    this.validation = parsed;
  }

  async getPublicSettings(): Promise<ValidatedPublicStoreSettings> {
    return this.validation.settings;
  }

  getValidationResult(): StoreSettingsValidationResult {
    return this.validation;
  }
}
