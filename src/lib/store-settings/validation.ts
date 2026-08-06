import type {
  PublicStoreSettings,
  StoreEnvironmentName,
  ValidatedPublicStoreSettings,
} from "../../domain/store-settings";
import { PublicStoreSettingsSchema } from "./schema";

export interface StoreSettingsValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export type StoreSettingsValidationResult =
  | Readonly<{
      ok: true;
      settings: ValidatedPublicStoreSettings;
      issues: readonly [];
    }>
  | Readonly<{
      ok: false;
      settings: ValidatedPublicStoreSettings;
      issues: readonly StoreSettingsValidationIssue[];
    }>;

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
  }
  return value;
}

export function createSafePublicStoreSettings(
  environmentName: StoreEnvironmentName = "development",
): ValidatedPublicStoreSettings {
  const production = environmentName === "production";
  const settings = {
    schemaVersion: 1,
    brand: {
      name: "KRONOS",
      localizedName: "کرونوس",
    },
    legal: {},
    contact: {
      phones: [],
      emails: [],
    },
    support: {},
    social: {
      links: [],
    },
    shipping: {
      configured: false,
      enabled: false,
      estimatorConfigured: false,
    },
    returns: {
      configured: false,
      enabled: false,
    },
    warranty: {
      configured: false,
      enabled: false,
    },
    authenticity: {
      configured: false,
      enabled: false,
    },
    trust: {
      claims: [],
      providers: [],
    },
    enamad: {
      enabled: false,
      provider: "enamad",
      status: "unconfigured",
    },
    payment: {
      checkoutMode: "disabled",
      methods: [],
    },
    currency: {
      defaultCurrency: "IRR",
      supportedCurrencies: ["IRR"],
      defaultLocale: "fa-IR",
      supportedLocales: ["fa-IR"],
      prices: [
        {
          currency: "IRR",
          locale: "fa-IR",
          unitLabel: "تومان",
          amountDivisor: 10,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          useGrouping: true,
        },
      ],
    },
    features: {
      wishlist: false,
      compare: false,
      recentlyViewed: false,
      quickView: false,
      reviews: false,
      ratings: false,
      newsletter: false,
      contactForm: false,
      auth: false,
      checkout: false,
      enamad: false,
      paymentMethods: false,
      shippingEstimator: false,
      returnPolicy: false,
      warranty: false,
    },
    seo: {
      siteUrl: production ? "https://configuration.invalid" : "http://localhost:3000",
      defaultTitle: "KRONOS",
      titleTemplate: "%s | KRONOS",
      defaultDescription: "بررسی و مقایسه مشخصات ساعت‌ها.",
      defaultLocale: "fa-IR",
      robots: "noindex,nofollow",
    },
    organization: {
      publicName: "KRONOS",
      url: production ? "https://configuration.invalid" : "http://localhost:3000",
      sameAs: [],
    },
    contentVisibility: {
      legalIdentity: false,
      contact: false,
      supportHours: false,
      socialLinks: false,
      shipping: false,
      returns: false,
      warranty: false,
      authenticity: false,
      trustProviders: false,
      enamad: false,
      paymentMethods: false,
    },
    environment: {
      name: environmentName,
      source: "static",
      fixture: false,
      configurationVersion: "1.0.0",
      capabilities: {
        auth: "unavailable",
        contactForm: "unavailable",
        newsletter: "unavailable",
        reviews: "unavailable",
        checkout: "disabled",
      },
    },
  } satisfies PublicStoreSettings;

  return deepFreeze(settings) as unknown as ValidatedPublicStoreSettings;
}

export function validatePublicStoreSettings(
  input: unknown,
  fallbackEnvironment: StoreEnvironmentName = "development",
): StoreSettingsValidationResult {
  const result = PublicStoreSettingsSchema.safeParse(input);

  if (result.success) {
    return {
      ok: true,
      settings: deepFreeze(result.data) as unknown as ValidatedPublicStoreSettings,
      issues: [],
    };
  }

  return {
    ok: false,
    settings: createSafePublicStoreSettings(fallbackEnvironment),
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      code: issue.code,
      message: issue.message,
    })),
  };
}

export function parsePublicStoreSettingsJson(
  raw: string,
  fallbackEnvironment: StoreEnvironmentName = "development",
): StoreSettingsValidationResult {
  try {
    return validatePublicStoreSettings(JSON.parse(raw), fallbackEnvironment);
  } catch {
    return {
      ok: false,
      settings: createSafePublicStoreSettings(fallbackEnvironment),
      issues: [
        {
          path: "$",
          code: "invalid_json",
          message: "Public store settings must be valid JSON",
        },
      ],
    };
  }
}
