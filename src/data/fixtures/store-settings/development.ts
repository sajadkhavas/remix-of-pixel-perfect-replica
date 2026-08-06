import type { PublicStoreSettings } from "../../../domain/store-settings";

/**
 * Development-only fixture. It contains no public contact, trust badge, payment provider,
 * shipping promise, returns promise, warranty promise, or official-representative claim.
 */
export const DEVELOPMENT_STORE_SETTINGS_FIXTURE = {
  schemaVersion: 1,
  brand: {
    name: "KRONOS",
    localizedName: "کرونوس",
    slogan: "ساعت را آگاهانه انتخاب کنید.",
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
    claims: [
      {
        id: "authenticity.global",
        status: "hidden-until-configured",
        onMissingEvidence: "hide",
      },
      {
        id: "shipping.free",
        status: "hidden-until-configured",
        onMissingEvidence: "hide",
      },
    ],
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
    wishlist: true,
    compare: true,
    recentlyViewed: true,
    quickView: true,
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
    siteUrl: "http://localhost:3000",
    defaultTitle: "KRONOS",
    titleTemplate: "%s | KRONOS",
    defaultDescription: "بررسی و مقایسه مشخصات ساعت‌ها برای انتخاب آگاهانه.",
    defaultLocale: "fa-IR",
    robots: "noindex,nofollow",
  },
  organization: {
    publicName: "KRONOS",
    url: "http://localhost:3000",
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
    name: "development",
    source: "fixture",
    fixture: true,
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
