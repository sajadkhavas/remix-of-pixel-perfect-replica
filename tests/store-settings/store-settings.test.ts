import { describe, expect, test } from "bun:test";
import { DEVELOPMENT_STORE_SETTINGS_FIXTURE } from "../../src/data/fixtures/store-settings";
import {
  EnvironmentStoreSettingsRepository,
  getDisplayContacts,
  getEnabledPaymentMethods,
  getVisibleSocialLinks,
  StaticStoreSettingsRepository,
  validatePublicStoreSettings,
} from "../../src/lib/store-settings";
import {
  isTrustClaimVisible,
  resolveClaimPresentation,
  type PublicStoreSettings,
} from "../../src/domain/store-settings";

function cloneFixture(): PublicStoreSettings {
  return structuredClone(DEVELOPMENT_STORE_SETTINGS_FIXTURE);
}

describe("public store settings validation", () => {
  test("accepts a valid development fixture", () => {
    const result = validatePublicStoreSettings(DEVELOPMENT_STORE_SETTINGS_FIXTURE);

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
    expect(result.settings.brand.name).toBe("KRONOS");
  });

  test("rejects malformed URLs and malformed social links", () => {
    const invalidSite = cloneFixture() as PublicStoreSettings & {
      seo: { siteUrl: string };
    };
    invalidSite.seo.siteUrl = "javascript:alert(1)";
    expect(validatePublicStoreSettings(invalidSite).ok).toBe(false);

    const invalidSocial = cloneFixture() as PublicStoreSettings & {
      social: { links: unknown[] };
    };
    invalidSocial.social.links = [
      {
        platform: "instagram",
        url: "https://example.com/not-instagram",
        label: "Instagram",
        status: "hidden-until-configured",
      },
    ];
    expect(validatePublicStoreSettings(invalidSocial).ok).toBe(false);
  });

  test("keeps incomplete optional contact data safely hidden", () => {
    const settings = cloneFixture();
    const result = validatePublicStoreSettings(settings);

    expect(result.ok).toBe(true);
    expect(getDisplayContacts(result.settings)).toEqual({ phones: [], emails: [] });
    expect(getVisibleSocialLinks(result.settings)).toEqual([]);
  });

  test("rejects invalid phone and email shapes", () => {
    const invalid = cloneFixture() as PublicStoreSettings & {
      contact: { phones: unknown[]; emails: unknown[] };
    };
    invalid.contact.phones = [
      {
        id: "support",
        label: "Support",
        e164: "021-00000000",
        status: "hidden-until-configured",
      },
    ];
    invalid.contact.emails = [
      {
        id: "support",
        label: "Support",
        address: "not-an-email",
        status: "hidden-until-configured",
      },
    ];

    expect(validatePublicStoreSettings(invalid).ok).toBe(false);
  });

  test("rejects negative shipping thresholds and invalid return days", () => {
    const invalidShipping = cloneFixture() as PublicStoreSettings & {
      shipping: { freeShippingThresholdMinor: number; freeShippingCurrency: "IRR" };
    };
    invalidShipping.shipping.freeShippingThresholdMinor = -1;
    invalidShipping.shipping.freeShippingCurrency = "IRR";
    expect(validatePublicStoreSettings(invalidShipping).ok).toBe(false);

    const invalidReturns = cloneFixture() as PublicStoreSettings & {
      returns: { windowDays: number };
    };
    invalidReturns.returns.windowDays = 0;
    expect(validatePublicStoreSettings(invalidReturns).ok).toBe(false);
  });

  test("rejects unsupported currency and payment provider enums", () => {
    const invalidCurrency = cloneFixture() as PublicStoreSettings & {
      currency: { defaultCurrency: string };
    };
    invalidCurrency.currency.defaultCurrency = "BTC";
    expect(validatePublicStoreSettings(invalidCurrency).ok).toBe(false);

    const invalidProvider = cloneFixture() as PublicStoreSettings & {
      payment: { checkoutMode: "manual"; methods: unknown[] };
    };
    invalidProvider.payment.checkoutMode = "manual";
    invalidProvider.payment.methods = [
      {
        providerId: "unknown-gateway",
        displayName: "Unknown",
        enabled: true,
        displayOrder: 0,
        supportedCurrencies: ["IRR"],
      },
    ];
    expect(validatePublicStoreSettings(invalidProvider).ok).toBe(false);
  });
});

describe("evidence-aware visibility", () => {
  test("keeps an unconfirmed claim hidden", () => {
    const claim = {
      id: "authenticity.global",
      status: "requires-client-confirmation" as const,
      sourceText: "اصالت همه محصولات تضمین شده است.",
      onMissingEvidence: "hide" as const,
    };

    expect(isTrustClaimVisible(claim)).toBe(false);
    expect(resolveClaimPresentation(claim)).toEqual({
      kind: "hidden",
      claimId: "authenticity.global",
    });
  });

  test("accepts confirmed claim only with evidence", () => {
    const withoutEvidence = cloneFixture() as PublicStoreSettings & {
      trust: { claims: unknown[]; providers: readonly [] };
    };
    withoutEvidence.trust.claims = [
      {
        id: "shipping.safe",
        status: "confirmed",
        sourceText: "ارسال طبق فرایند ثبت‌شده انجام می‌شود.",
        onMissingEvidence: "hide",
      },
    ];
    expect(validatePublicStoreSettings(withoutEvidence).ok).toBe(false);

    const claim = {
      id: "shipping.safe",
      status: "confirmed" as const,
      sourceText: "ارسال طبق فرایند ثبت‌شده انجام می‌شود.",
      onMissingEvidence: "hide" as const,
      evidence: {
        reference: "ops-policy-v1",
        verifiedAt: "2026-08-06T00:00:00.000Z",
        verifiedBy: "Operations",
      },
    };
    expect(isTrustClaimVisible(claim, new Date("2026-08-06T01:00:00.000Z"))).toBe(true);
  });
});

describe("Enamad and payment public boundary", () => {
  test("does not activate incomplete Enamad data", () => {
    const invalid = cloneFixture() as PublicStoreSettings & {
      enamad: { enabled: boolean; status: string; provider: "enamad" };
      features: { enamad: boolean };
    };
    invalid.enamad.enabled = true;
    invalid.enamad.status = "verified";
    invalid.features.enamad = true;

    const result = validatePublicStoreSettings(invalid);
    expect(result.ok).toBe(false);
    expect(result.settings.enamad.enabled).toBe(false);
  });

  test("rejects every forbidden payment secret from the strict public model", () => {
    const forbiddenKeys = [
      "merchantSecret",
      "privateKey",
      "apiSecret",
      "webhookSecret",
      "callbackSecret",
      "gatewayPassword",
      "signingKey",
      "accessToken",
    ] as const;

    for (const key of forbiddenKeys) {
      const invalid = structuredClone(DEVELOPMENT_STORE_SETTINGS_FIXTURE) as unknown as Record<
        string,
        unknown
      >;
      const payment = invalid.payment as Record<string, unknown>;
      payment[key] = "must-not-enter-browser-config";

      const result = validatePublicStoreSettings(invalid);
      expect(result.ok).toBe(false);
      expect(key in result.settings.payment).toBe(false);
    }
  });

  test("filters disabled payment providers", () => {
    const configured = cloneFixture() as PublicStoreSettings & {
      payment: { checkoutMode: "manual"; methods: unknown[] };
      features: { paymentMethods: boolean };
      contentVisibility: { paymentMethods: boolean };
      environment: { capabilities: { checkout: "manual" } };
    };
    configured.payment.checkoutMode = "manual";
    configured.payment.methods = [
      {
        providerId: "bank-transfer",
        displayName: "انتقال بانکی",
        enabled: true,
        displayOrder: 2,
        supportedCurrencies: ["IRR"],
      },
      {
        providerId: "cash-on-delivery",
        displayName: "پرداخت هنگام تحویل",
        enabled: false,
        displayOrder: 1,
        supportedCurrencies: ["IRR"],
      },
    ];
    configured.features.paymentMethods = true;
    configured.contentVisibility.paymentMethods = true;
    configured.environment.capabilities.checkout = "manual";

    const result = validatePublicStoreSettings(configured);
    expect(result.ok).toBe(true);
    expect(getEnabledPaymentMethods(result.settings).map((method) => method.providerId)).toEqual([
      "bank-transfer",
    ]);
  });
});

describe("feature dependencies and safe repositories", () => {
  test("rejects feature flags whose dependencies are unavailable", () => {
    const invalid = cloneFixture() as PublicStoreSettings & {
      features: { auth: boolean; ratings: boolean; reviews: boolean };
    };
    invalid.features.auth = true;
    invalid.features.ratings = true;
    invalid.features.reviews = false;

    const result = validatePublicStoreSettings(invalid);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.path === "features.auth")).toBe(true);
    expect(result.issues.some((issue) => issue.path === "features.ratings")).toBe(true);
  });

  test("rejects visible policy surfaces when their configuration is missing", () => {
    const invalid = cloneFixture() as PublicStoreSettings & {
      contentVisibility: { shipping: boolean; warranty: boolean };
    };
    invalid.contentVisibility.shipping = true;
    invalid.contentVisibility.warranty = true;

    const result = validatePublicStoreSettings(invalid);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.path === "contentVisibility.shipping")).toBe(true);
    expect(result.issues.some((issue) => issue.path === "contentVisibility.warranty")).toBe(true);
  });

  test("returns a safe hidden fallback for malformed static config", async () => {
    const repository = new StaticStoreSettingsRepository({ brand: { name: "" } });
    const settings = await repository.getPublicSettings();

    expect(repository.getValidationResult().ok).toBe(false);
    expect(settings.brand.name).toBe("KRONOS");
    expect(settings.contact.phones).toEqual([]);
    expect(settings.trust.claims).toEqual([]);
    expect(settings.payment.methods).toEqual([]);
    expect(settings.features.checkout).toBe(false);
  });

  test("validates environment mode and malformed JSON", async () => {
    const invalidMode = new EnvironmentStoreSettingsRepository({
      MODE: "preview",
      VITE_PUBLIC_STORE_SETTINGS_JSON: JSON.stringify(DEVELOPMENT_STORE_SETTINGS_FIXTURE),
    });
    expect(invalidMode.getValidationResult().ok).toBe(false);
    expect((await invalidMode.getPublicSettings()).environment.name).toBe("development");

    const malformedJson = new EnvironmentStoreSettingsRepository({
      MODE: "staging",
      VITE_PUBLIC_STORE_SETTINGS_JSON: "{not-json",
    });
    expect(malformedJson.getValidationResult().ok).toBe(false);
    expect((await malformedJson.getPublicSettings()).environment.name).toBe("staging");

    const mismatchedEnvironment = new EnvironmentStoreSettingsRepository({
      MODE: "staging",
      VITE_PUBLIC_STORE_SETTINGS_JSON: JSON.stringify(DEVELOPMENT_STORE_SETTINGS_FIXTURE),
    });
    expect(mismatchedEnvironment.getValidationResult().ok).toBe(false);
    expect((await mismatchedEnvironment.getPublicSettings()).environment.name).toBe("staging");
  });

  test("missing optional fields never create public claims or contacts", async () => {
    const repository = new StaticStoreSettingsRepository(DEVELOPMENT_STORE_SETTINGS_FIXTURE);
    const settings = await repository.getPublicSettings();

    expect(getDisplayContacts(settings)).toEqual({ phones: [], emails: [] });
    expect(getVisibleSocialLinks(settings)).toEqual([]);
    expect(getEnabledPaymentMethods(settings)).toEqual([]);
    expect(settings.enamad.enabled).toBe(false);
  });
});
