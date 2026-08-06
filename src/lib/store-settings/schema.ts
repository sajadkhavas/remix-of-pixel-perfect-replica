import { z } from "zod";

export const STORE_SETTING_ENVIRONMENTS = ["development", "staging", "production"] as const;
export const CLAIM_STATUSES = [
  "confirmed",
  "requires-client-confirmation",
  "hidden-until-configured",
  "prohibited",
] as const;
export const SUPPORTED_STORE_CURRENCIES = ["IRR", "USD", "EUR", "AED", "GBP"] as const;
export const PAYMENT_PROVIDER_ALLOWLIST = [
  "zarinpal",
  "idpay",
  "nextpay",
  "saman",
  "mellat",
  "parsian",
  "pasargad",
  "shaparak",
  "cash-on-delivery",
  "bank-transfer",
] as const;
export const ENAMAD_PROVIDER_ALLOWLIST = ["enamad"] as const;

const trimString = (minimum = 1, maximum = 240) =>
  z.string().trim().min(minimum).max(maximum);

const isoDateTimeSchema = z.string().datetime({ offset: true });
const localeSchema = z.string().regex(/^[a-z]{2,3}(?:-[A-Z]{2})?$/, "Invalid locale code");
const countryCodeSchema = z.string().regex(/^[A-Z]{2}$/, "Country code must be ISO alpha-2");
const relativePathSchema = z
  .string()
  .trim()
  .regex(/^\/(?!\/)[^\s]*$/, "Expected a root-relative public path");
const hostnameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/,
    "Expected a hostname without protocol or path",
  );

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const httpUrlSchema = z.string().url().refine(isHttpUrl, "Only HTTP(S) URLs are allowed");
const httpsUrlSchema = z.string().url().refine(isHttpsUrl, "Only HTTPS URLs are allowed");
const publicAssetSourceSchema = z.string().trim().refine((value) => {
  if (/^\/(?!\/)[^\s]*$/.test(value)) return true;
  return isHttpsUrl(value);
}, "Asset source must be a root-relative path or HTTPS URL");

export const PublicAssetReferenceSchema = z
  .object({
    src: publicAssetSourceSchema,
    alt: trimString(1, 180),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  })
  .strict();

export const PublicEvidenceSchema = z
  .object({
    reference: trimString(1, 500),
    verifiedAt: isoDateTimeSchema,
    verifiedBy: trimString(1, 160),
    expiresAt: isoDateTimeSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.expiresAt && Date.parse(value.expiresAt) <= Date.parse(value.verifiedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiresAt"],
        message: "Evidence expiry must be later than verification time",
      });
    }
  });

export const EvidenceAwareClaimSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
    status: z.enum(CLAIM_STATUSES),
    sourceText: trimString(1, 500).optional(),
    evidence: PublicEvidenceSchema.optional(),
    onMissingEvidence: z.enum(["hide", "use-neutral-fallback"]),
    neutralFallbackText: trimString(1, 500).optional(),
  })
  .strict()
  .superRefine((claim, context) => {
    if (claim.status === "confirmed") {
      if (!claim.sourceText) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourceText"],
          message: "A confirmed claim requires source text",
        });
      }
      if (!claim.evidence) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["evidence"],
          message: "A confirmed claim requires public evidence metadata",
        });
      }
    }

    if (claim.onMissingEvidence === "use-neutral-fallback" && !claim.neutralFallbackText) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["neutralFallbackText"],
        message: "Neutral fallback text is required when fallback presentation is enabled",
      });
    }

    if (claim.status === "prohibited" && claim.onMissingEvidence !== "hide") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["onMissingEvidence"],
        message: "Prohibited claims must always remain hidden",
      });
    }
  });

const confirmationStatusSchema = z.enum(CLAIM_STATUSES);

function validateConfirmedValue(
  value: { status: (typeof CLAIM_STATUSES)[number]; evidence?: unknown },
  context: z.RefinementCtx,
): void {
  if (value.status === "confirmed" && !value.evidence) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["evidence"],
      message: "Confirmed public data requires evidence metadata",
    });
  }
}

const phoneSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
    label: trimString(1, 80),
    e164: z.string().regex(/^\+[1-9]\d{7,14}$/, "Phone number must use E.164 format"),
    displayValue: trimString(1, 80).optional(),
    status: confirmationStatusSchema,
    evidence: PublicEvidenceSchema.optional(),
  })
  .strict()
  .superRefine(validateConfirmedValue);

const emailSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
    label: trimString(1, 80),
    address: z.string().trim().email().max(254),
    status: confirmationStatusSchema,
    evidence: PublicEvidenceSchema.optional(),
  })
  .strict()
  .superRefine(validateConfirmedValue);

const addressSchema = z
  .object({
    countryCode: countryCodeSchema,
    province: trimString(1, 120).optional(),
    city: trimString(1, 120).optional(),
    district: trimString(1, 120).optional(),
    street: trimString(1, 240).optional(),
    building: trimString(1, 120).optional(),
    postalCode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,20}$/).optional(),
    status: confirmationStatusSchema,
    evidence: PublicEvidenceSchema.optional(),
  })
  .strict()
  .superRefine(validateConfirmedValue);

const brandSchema = z
  .object({
    name: trimString(1, 120),
    localizedName: trimString(1, 120).optional(),
    shortName: trimString(1, 80).optional(),
    slogan: trimString(1, 240).optional(),
    logo: PublicAssetReferenceSchema.optional(),
  })
  .strict();

const legalSchema = z
  .object({
    legalName: trimString(1, 200).optional(),
    nationalId: z.string().trim().regex(/^[A-Za-z0-9-]{5,40}$/).optional(),
    registrationNumber: z.string().trim().regex(/^[A-Za-z0-9-]{2,40}$/).optional(),
    legalRepresentative: trimString(1, 160).optional(),
    privacyContactEmail: z.string().trim().email().max(254).optional(),
  })
  .strict();

const contactSchema = z
  .object({
    phones: z.array(phoneSchema).max(12),
    emails: z.array(emailSchema).max(12),
    address: addressSchema.optional(),
  })
  .strict();

const businessHoursIntervalSchema = z
  .object({
    opensAt: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    closesAt: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  })
  .strict()
  .refine((value) => value.opensAt < value.closesAt, {
    message: "Business-hours interval must close after it opens",
    path: ["closesAt"],
  });

const weekdaySchema = z.enum([
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
]);

const businessHoursDaySchema = z
  .object({
    day: weekdaySchema,
    closed: z.boolean(),
    intervals: z.array(businessHoursIntervalSchema).max(4),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.closed && value.intervals.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["intervals"],
        message: "Closed days cannot contain opening intervals",
      });
    }
    if (!value.closed && value.intervals.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["intervals"],
        message: "Open days require at least one opening interval",
      });
    }
  });

const businessHoursSchema = z
  .object({
    timezone: trimString(1, 80),
    days: z.array(businessHoursDaySchema).max(7),
    status: confirmationStatusSchema,
    evidence: PublicEvidenceSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    validateConfirmedValue(value, context);
    const uniqueDays = new Set(value.days.map((day) => day.day));
    if (uniqueDays.size !== value.days.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days"],
        message: "Business-hours days must be unique",
      });
    }
  });

const supportSchema = z
  .object({
    businessHours: businessHoursSchema.optional(),
    responseTimeClaim: EvidenceAwareClaimSchema.optional(),
  })
  .strict();

const socialPlatformSchema = z.enum([
  "instagram",
  "telegram",
  "linkedin",
  "x",
  "youtube",
  "facebook",
  "whatsapp",
  "aparat",
]);

const socialHosts: Readonly<Record<z.infer<typeof socialPlatformSchema>, readonly string[]>> = {
  instagram: ["instagram.com", "www.instagram.com"],
  telegram: ["t.me", "telegram.me"],
  linkedin: ["linkedin.com", "www.linkedin.com"],
  x: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"],
  youtube: ["youtube.com", "www.youtube.com", "youtu.be"],
  facebook: ["facebook.com", "www.facebook.com"],
  whatsapp: ["wa.me", "whatsapp.com", "www.whatsapp.com"],
  aparat: ["aparat.com", "www.aparat.com"],
};

const socialLinkSchema = z
  .object({
    platform: socialPlatformSchema,
    url: httpsUrlSchema,
    label: trimString(1, 100),
    status: confirmationStatusSchema,
    evidence: PublicEvidenceSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    validateConfirmedValue(value, context);
    const hostname = new URL(value.url).hostname.toLowerCase();
    if (!socialHosts[value.platform].includes(hostname)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["url"],
        message: `URL host does not match social platform ${value.platform}`,
      });
    }
  });

const socialSchema = z.object({ links: z.array(socialLinkSchema).max(24) }).strict();

const shippingSchema = z
  .object({
    configured: z.boolean(),
    enabled: z.boolean(),
    policyPath: relativePathSchema.optional(),
    estimatorConfigured: z.boolean(),
    freeShippingThresholdMinor: z.number().int().nonnegative().optional(),
    freeShippingCurrency: z.enum(SUPPORTED_STORE_CURRENCIES).optional(),
    presentationClaim: EvidenceAwareClaimSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.enabled && !value.configured) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["enabled"],
        message: "Shipping cannot be enabled before it is configured",
      });
    }
    if (
      (value.freeShippingThresholdMinor === undefined) !==
      (value.freeShippingCurrency === undefined)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["freeShippingThresholdMinor"],
        message: "Free-shipping threshold and currency must be configured together",
      });
    }
  });

function createPolicySchema() {
  return z
    .object({
      configured: z.boolean(),
      enabled: z.boolean(),
      policyPath: relativePathSchema.optional(),
      presentationClaim: EvidenceAwareClaimSchema.optional(),
    })
    .strict()
    .superRefine((value, context) => {
      if (value.enabled && !value.configured) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["enabled"],
          message: "Policy presentation cannot be enabled before it is configured",
        });
      }
      if (value.enabled && !value.policyPath) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["policyPath"],
          message: "Enabled policy presentation requires a public policy path",
        });
      }
    });
}

const returnSchema = z
  .object({
    configured: z.boolean(),
    enabled: z.boolean(),
    policyPath: relativePathSchema.optional(),
    windowDays: z.number().int().positive().max(365).optional(),
    presentationClaim: EvidenceAwareClaimSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.enabled && (!value.configured || !value.policyPath)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["enabled"],
        message: "Returns require configured policy content and a public policy path",
      });
    }
  });

const warrantySchema = createPolicySchema();
const authenticitySchema = createPolicySchema();

const trustProviderSchema = z
  .object({
    providerId: z.string().trim().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
    displayName: trimString(1, 120),
    enabled: z.boolean(),
    verificationUrl: httpsUrlSchema.optional(),
    logo: PublicAssetReferenceSchema.optional(),
    claim: EvidenceAwareClaimSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.enabled && (!value.verificationUrl || !value.claim)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["enabled"],
        message: "Enabled trust providers require verification URL and evidence-aware claim",
      });
    }
  });

const trustSchema = z
  .object({
    claims: z.array(EvidenceAwareClaimSchema).max(100),
    providers: z.array(trustProviderSchema).max(20),
  })
  .strict();

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
      if (!(hostname === "enamad.ir" || hostname.endsWith(".enamad.ir"))) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verificationUrl"],
          message: "Enamad verification URL must use an enamad.ir host",
        });
      }
    }

    if (value.enabled) {
      const requiredFields = [
        ["publicIdentifier", value.publicIdentifier],
        ["verificationUrl", value.verificationUrl],
        ["logoAsset", value.logoAsset],
        ["verifiedDomain", value.verifiedDomain],
        ["lastVerifiedAt", value.lastVerifiedAt],
      ] as const;

      if (value.status !== "verified") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["status"],
          message: "Enabled Enamad must have verified status",
        });
      }

      for (const [field, fieldValue] of requiredFields) {
        if (!fieldValue) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Enabled Enamad requires ${field}`,
          });
        }
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

const paymentSchema = z
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
    if (
      value.checkoutMode === "online" &&
      !enabledMethods.some(
        (method) =>
          method.providerId !== "cash-on-delivery" && method.providerId !== "bank-transfer",
      )
    ) {
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

const currencySchema = z
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

const featureFlagsSchema = z
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

const seoDefaultsSchema = z
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

const organizationSchema = z
  .object({
    publicName: trimString(1, 160),
    legalName: trimString(1, 200).optional(),
    url: httpUrlSchema,
    logo: PublicAssetReferenceSchema.optional(),
    sameAs: z.array(httpsUrlSchema).max(24),
  })
  .strict();

const contentVisibilitySchema = z
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

const environmentSchema = z
  .object({
    name: z.enum(STORE_SETTING_ENVIRONMENTS),
    source: z.enum(["static", "environment", "fixture"]),
    fixture: z.boolean(),
    configurationVersion: z.string().trim().regex(/^\d+\.\d+\.\d+$/),
    updatedAt: isoDateTimeSchema.optional(),
    capabilities: capabilitiesSchema,
  })
  .strict();

export const PublicStoreSettingsSchema = z
  .object({
    schemaVersion: z.literal(1),
    brand: brandSchema,
    legal: legalSchema,
    contact: contactSchema,
    support: supportSchema,
    social: socialSchema,
    shipping: shippingSchema,
    returns: returnSchema,
    warranty: warrantySchema,
    authenticity: authenticitySchema,
    trust: trustSchema,
    enamad: EnamadSettingsSchema,
    payment: paymentSchema,
    currency: currencySchema,
    features: featureFlagsSchema,
    seo: seoDefaultsSchema,
    organization: organizationSchema,
    contentVisibility: contentVisibilitySchema,
    environment: environmentSchema,
  })
  .strict()
  .superRefine((settings, context) => {
    const requireCapability = (
      enabled: boolean,
      capability: "unavailable" | "configured",
      path: string,
    ) => {
      if (enabled && capability !== "configured") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["features", path],
          message: `${path} cannot be enabled without a configured public capability`,
        });
      }
    };

    requireCapability(settings.features.auth, settings.environment.capabilities.auth, "auth");
    requireCapability(
      settings.features.contactForm,
      settings.environment.capabilities.contactForm,
      "contactForm",
    );
    requireCapability(
      settings.features.newsletter,
      settings.environment.capabilities.newsletter,
      "newsletter",
    );
    requireCapability(
      settings.features.reviews,
      settings.environment.capabilities.reviews,
      "reviews",
    );

    if (settings.features.ratings && !settings.features.reviews) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features", "ratings"],
        message: "Ratings cannot be enabled while reviews are disabled",
      });
    }

    if (settings.features.checkout) {
      if (settings.payment.checkoutMode === "disabled") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["features", "checkout"],
          message: "Checkout feature requires an explicit manual or online checkout mode",
        });
      }
      if (settings.environment.capabilities.checkout !== settings.payment.checkoutMode) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["environment", "capabilities", "checkout"],
          message: "Checkout capability must match payment presentation mode",
        });
      }
    }

    if (
      settings.features.enamad &&
      !(settings.enamad.enabled && settings.enamad.status === "verified")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features", "enamad"],
        message: "Enamad feature requires a complete verified Enamad configuration",
      });
    }

    if (
      settings.features.paymentMethods &&
      !settings.payment.methods.some((method) => method.enabled)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features", "paymentMethods"],
        message: "Payment-method presentation requires at least one enabled provider",
      });
    }

    if (
      settings.features.shippingEstimator &&
      !(settings.shipping.enabled && settings.shipping.estimatorConfigured)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features", "shippingEstimator"],
        message: "Shipping estimator requires configured shipping and estimator capability",
      });
    }

    if (settings.features.returnPolicy && !(settings.returns.enabled && settings.returns.configured)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features", "returnPolicy"],
        message: "Return-policy feature requires configured return policy",
      });
    }

    if (settings.features.warranty && !(settings.warranty.enabled && settings.warranty.configured)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features", "warranty"],
        message: "Warranty feature requires configured warranty policy",
      });
    }

    if (settings.contentVisibility.contact) {
      const hasConfirmedContact =
        settings.contact.phones.some((item) => item.status === "confirmed") ||
        settings.contact.emails.some((item) => item.status === "confirmed") ||
        settings.contact.address?.status === "confirmed";
      if (!hasConfirmedContact) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contentVisibility", "contact"],
          message: "Contact visibility requires at least one confirmed contact value",
        });
      }
    }

    const requireVisibleConfiguration = (
      visible: boolean,
      configured: boolean,
      path: keyof typeof settings.contentVisibility,
      message: string,
    ) => {
      if (visible && !configured) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contentVisibility", path],
          message,
        });
      }
    };

    requireVisibleConfiguration(
      settings.contentVisibility.supportHours,
      settings.support.businessHours?.status === "confirmed" &&
        Boolean(settings.support.businessHours.evidence),
      "supportHours",
      "Support-hours visibility requires confirmed evidence-backed business hours",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.socialLinks,
      settings.social.links.some((link) => link.status === "confirmed" && Boolean(link.evidence)),
      "socialLinks",
      "Social-link visibility requires at least one confirmed evidence-backed link",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.shipping,
      settings.shipping.configured && settings.shipping.enabled,
      "shipping",
      "Shipping visibility requires enabled configured shipping presentation",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.returns,
      settings.returns.configured && settings.returns.enabled,
      "returns",
      "Return visibility requires enabled configured policy presentation",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.warranty,
      settings.warranty.configured && settings.warranty.enabled,
      "warranty",
      "Warranty visibility requires enabled configured policy presentation",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.authenticity,
      settings.authenticity.configured && settings.authenticity.enabled,
      "authenticity",
      "Authenticity visibility requires enabled configured policy presentation",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.trustProviders,
      settings.trust.providers.some((provider) => provider.enabled),
      "trustProviders",
      "Trust-provider visibility requires at least one enabled provider",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.enamad,
      settings.features.enamad &&
        settings.enamad.enabled &&
        settings.enamad.status === "verified",
      "enamad",
      "Enamad visibility requires the verified enabled Enamad feature",
    );
    requireVisibleConfiguration(
      settings.contentVisibility.paymentMethods,
      settings.features.paymentMethods &&
        settings.payment.methods.some((method) => method.enabled),
      "paymentMethods",
      "Payment-method visibility requires the feature and at least one enabled method",
    );

    if (settings.environment.name === "production") {
      if (!isHttpsUrl(settings.seo.siteUrl)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["seo", "siteUrl"],
          message: "Production site URL must use HTTPS",
        });
      }
      if (settings.environment.fixture) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["environment", "fixture"],
          message: "Production configuration cannot be marked as fixture data",
        });
      }
    }
  });

export type PublicStoreSettingsInput = z.input<typeof PublicStoreSettingsSchema>;
export type ParsedPublicStoreSettings = z.output<typeof PublicStoreSettingsSchema>;
