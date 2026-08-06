import { z } from "zod";
import {
  ENAMAD_PROVIDER_ALLOWLIST,
  PAYMENT_PROVIDER_ALLOWLIST,
  PublicAssetReferenceSchema,
  STORE_SETTING_ENVIRONMENTS,
  SUPPORTED_STORE_CURRENCIES,
  hostnameSchema,
  httpUrlSchema,
  httpsUrlSchema,
  isoDateTimeSchema,
  localeSchema,
  trimString,
} from "./primitives";

export const EnamadSettingsSchema = z
  .object({
    enabled: z.boolean(),
    provider: z.enum(ENAMAD_PROVIDER_ALLOWLIST),
    publicIdentifier: z.string().trim().regex(/^[A-Za-z0-9_-]{3,160}$/).optional(),
    verificationUrl: httpsUrlSchema.optional(),
    logoAsset: PublicAssetReferenceSchema.optional(),
    verifiedDomain: hostnameSchema.optional(),
    status: z.enum(["unconfigured", "pending", "verified", "suspended"]),
    lastVerifiedAt: isoDateTimeSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.verificationUrl) {
      const hostname = new URL(value.verificationUrl).hostname.toLowerCase();
      if (hostname !== "enamad.ir" && !hostname.endsWith(".enamad.ir")) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verificationUrl"],
          message: "Enamad verification URL must use an enamad.ir host",
        });
      }
    }

    if (!value.enabled) return;

    if (value.status !== "verified") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["status"],
        message: "Enabled Enamad must have verified status",
      });
    }

    const requiredFields = [
      ["publicIdentifier", value.publicIdentifier],
      ["verificationUrl", value.verificationUrl],
      ["logoAsset", value.logoAsset],
      ["verifiedDomain", value.verifiedDomain],
      ["lastVerifiedAt", value.lastVerifiedAt],
    ] as const;

    for (const [field, fieldValue] of requiredFields) {
      if (!fieldValue) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `Enabled Enamad requires ${field}`,
        });
      }
    }
  });

const paymentMethodSchema = z
  .object({
    providerId: z.enum(PAYMENT_PROVIDER_ALLOWLIST),
    displayName: trimString(1, 120),
    logo: PublicAssetReferenceSchema.optional(),
    enabled: z.boolean(),
    displayOrder: z.number().int().nonnegative(),
    publicDescription: trimString(1, 300).optional(),
    supportedCurrencies: z.array(z.enum(SUPPORTED_STORE_CURRENCIES)).min(1),
  })
  .strict();

export const paymentSchema = z
  .object({
    checkoutMode: z.enum(["disabled", "manual", "online"]),
    methods: z.array(paymentMethodSchema).max(20),
  })
  .strict()
  .superRefine((value, context) => {
    const enabledMethods = value.methods.filter((method) => method.enabled);
    const uniqueProviders = new Set(value.methods.map((method) => method.providerId));

    if (uniqueProviders.size !== value.methods.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["methods"],
        message: "Payment providers must be unique",
      });
    }

    if (value.checkoutMode === "disabled" && enabledMethods.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["methods"],
        message: "Disabled checkout cannot expose enabled payment methods",
      });
    }

    const hasOnlineProvider = enabledMethods.some(
      (method) =>
        method.providerId !== "cash-on-delivery" && method.providerId !== "bank-transfer",
    );
    if (value.checkoutMode === "online" && !hasOnlineProvider) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["methods"],
        message: "Online checkout requires an enabled online payment provider",
      });
    }
  });

const pricePresentationSchema = z
  .object({
    currency: z.enum(SUPPORTED_STORE_CURRENCIES),
    locale: localeSchema,
    unitLabel: trimString(1, 40),
    amountDivisor: z.number().int().positive(),
    minimumFractionDigits: z.number().int().min(0).max(6),
    maximumFractionDigits: z.number().int().min(0).max(6),
    useGrouping: z.boolean(),
  })
  .strict()
  .refine((value) => value.minimumFractionDigits <= value.maximumFractionDigits, {
    path: ["maximumFractionDigits"],
    message: "Maximum fraction digits must be greater than or equal to minimum",
  });

export const currencySchema = z
  .object({
    defaultCurrency: z.enum(SUPPORTED_STORE_CURRENCIES),
    supportedCurrencies: z.array(z.enum(SUPPORTED_STORE_CURRENCIES)).min(1),
    defaultLocale: localeSchema,
    supportedLocales: z.array(localeSchema).min(1),
    prices: z.array(pricePresentationSchema).min(1),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.supportedCurrencies.includes(value.defaultCurrency)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultCurrency"],
        message: "Default currency must be included in supported currencies",
      });
    }

    if (!value.supportedLocales.includes(value.defaultLocale)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultLocale"],
        message: "Default locale must be included in supported locales",
      });
    }

    const presentationCurrencies = new Set(value.prices.map((price) => price.currency));
    for (const currency of value.supportedCurrencies) {
      if (!presentationCurrencies.has(currency)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["prices"],
          message: `Missing price presentation for ${currency}`,
        });
      }
    }
  });

export const featureFlagsSchema = z
  .object({
    wishlist: z.boolean(),
    compare: z.boolean(),
    recentlyViewed: z.boolean(),
    quickView: z.boolean(),
    reviews: z.boolean(),
    ratings: z.boolean(),
    newsletter: z.boolean(),
    contactForm: z.boolean(),
    auth: z.boolean(),
    checkout: z.boolean(),
    enamad: z.boolean(),
    paymentMethods: z.boolean(),
    shippingEstimator: z.boolean(),
    returnPolicy: z.boolean(),
    warranty: z.boolean(),
  })
  .strict();

export const seoDefaultsSchema = z
  .object({
    siteUrl: httpUrlSchema,
    defaultTitle: trimString(1, 120),
    titleTemplate: trimString(1, 160).refine((value) => value.includes("%s"), {
      message: "Title template must contain %s",
    }),
    defaultDescription: trimString(1, 320),
    defaultLocale: localeSchema,
    robots: z.enum(["index,follow", "noindex,follow", "noindex,nofollow"]),
    defaultImage: PublicAssetReferenceSchema.optional(),
  })
  .strict();

export const organizationSchema = z
  .object({
    publicName: trimString(1, 160),
    legalName: trimString(1, 200).optional(),
    url: httpUrlSchema,
    logo: PublicAssetReferenceSchema.optional(),
    sameAs: z.array(httpsUrlSchema).max(24),
  })
  .strict();

export const contentVisibilitySchema = z
  .object({
    legalIdentity: z.boolean(),
    contact: z.boolean(),
    supportHours: z.boolean(),
    socialLinks: z.boolean(),
    shipping: z.boolean(),
    returns: z.boolean(),
    warranty: z.boolean(),
    authenticity: z.boolean(),
    trustProviders: z.boolean(),
    enamad: z.boolean(),
    paymentMethods: z.boolean(),
  })
  .strict();

const capabilitiesSchema = z
  .object({
    auth: z.enum(["unavailable", "configured"]),
    contactForm: z.enum(["unavailable", "configured"]),
    newsletter: z.enum(["unavailable", "configured"]),
    reviews: z.enum(["unavailable", "configured"]),
    checkout: z.enum(["disabled", "manual", "online"]),
  })
  .strict();

export const environmentSchema = z
  .object({
    name: z.enum(STORE_SETTING_ENVIRONMENTS),
    source: z.enum(["static", "environment", "fixture"]),
    fixture: z.boolean(),
    configurationVersion: z.string().trim().regex(/^\d+\.\d+\.\d+$/),
    updatedAt: isoDateTimeSchema.optional(),
    capabilities: capabilitiesSchema,
  })
  .strict();
