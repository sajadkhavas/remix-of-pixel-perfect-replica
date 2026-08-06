import type { CurrencyCode, ISODateTime, LocaleCode } from "../shared";

export type StoreEnvironmentName = "development" | "staging" | "production";
export type StoreSettingsSource = "static" | "environment" | "fixture";
export type ConfirmationStatus =
  | "confirmed"
  | "requires-client-confirmation"
  | "hidden-until-configured"
  | "prohibited";

export interface PublicEvidence {
  readonly reference: string;
  readonly verifiedAt: ISODateTime;
  readonly verifiedBy: string;
  readonly expiresAt?: ISODateTime;
}

export interface EvidenceAwareClaim {
  readonly id: string;
  readonly status: ConfirmationStatus;
  readonly sourceText?: string;
  readonly evidence?: PublicEvidence;
  readonly onMissingEvidence: "hide" | "use-neutral-fallback";
  readonly neutralFallbackText?: string;
}

export type ClaimPresentation =
  | Readonly<{ kind: "claim"; text: string; claimId: string }>
  | Readonly<{ kind: "neutral"; text: string; claimId: string }>
  | Readonly<{ kind: "hidden"; claimId?: string }>;

export interface PublicAssetReference {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
}

export interface BrandSettings {
  readonly name: string;
  readonly localizedName?: string;
  readonly shortName?: string;
  readonly slogan?: string;
  readonly logo?: PublicAssetReference;
}

export interface LegalSettings {
  readonly legalName?: string;
  readonly nationalId?: string;
  readonly registrationNumber?: string;
  readonly legalRepresentative?: string;
  readonly privacyContactEmail?: string;
}

export interface ConfirmedPublicValue<T> {
  readonly value: T;
  readonly status: ConfirmationStatus;
  readonly evidence?: PublicEvidence;
}

export interface PublicPhone {
  readonly id: string;
  readonly label: string;
  readonly e164: string;
  readonly displayValue?: string;
  readonly status: ConfirmationStatus;
  readonly evidence?: PublicEvidence;
}

export interface PublicEmail {
  readonly id: string;
  readonly label: string;
  readonly address: string;
  readonly status: ConfirmationStatus;
  readonly evidence?: PublicEvidence;
}

export interface PublicAddress {
  readonly countryCode: string;
  readonly province?: string;
  readonly city?: string;
  readonly district?: string;
  readonly street?: string;
  readonly building?: string;
  readonly postalCode?: string;
  readonly status: ConfirmationStatus;
  readonly evidence?: PublicEvidence;
}

export interface ContactSettings {
  readonly phones: readonly PublicPhone[];
  readonly emails: readonly PublicEmail[];
  readonly address?: PublicAddress;
}

export type Weekday =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export interface BusinessHoursInterval {
  readonly opensAt: string;
  readonly closesAt: string;
}

export interface BusinessHoursDay {
  readonly day: Weekday;
  readonly closed: boolean;
  readonly intervals: readonly BusinessHoursInterval[];
}

export interface BusinessHoursSettings {
  readonly timezone: string;
  readonly days: readonly BusinessHoursDay[];
  readonly status: ConfirmationStatus;
  readonly evidence?: PublicEvidence;
}

export interface SupportSettings {
  readonly businessHours?: BusinessHoursSettings;
  readonly responseTimeClaim?: EvidenceAwareClaim;
}

export type SocialPlatform =
  | "instagram"
  | "telegram"
  | "linkedin"
  | "x"
  | "youtube"
  | "facebook"
  | "whatsapp"
  | "aparat";

export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly url: string;
  readonly label: string;
  readonly status: ConfirmationStatus;
  readonly evidence?: PublicEvidence;
}

export interface SocialSettings {
  readonly links: readonly SocialLink[];
}

export interface ShippingSettings {
  readonly configured: boolean;
  readonly enabled: boolean;
  readonly policyPath?: string;
  readonly estimatorConfigured: boolean;
  readonly freeShippingThresholdMinor?: number;
  readonly freeShippingCurrency?: CurrencyCode;
  readonly presentationClaim?: EvidenceAwareClaim;
}

export interface ReturnSettings {
  readonly configured: boolean;
  readonly enabled: boolean;
  readonly policyPath?: string;
  readonly windowDays?: number;
  readonly presentationClaim?: EvidenceAwareClaim;
}

export interface WarrantySettings {
  readonly configured: boolean;
  readonly enabled: boolean;
  readonly policyPath?: string;
  readonly presentationClaim?: EvidenceAwareClaim;
}

export interface AuthenticitySettings {
  readonly configured: boolean;
  readonly enabled: boolean;
  readonly policyPath?: string;
  readonly presentationClaim?: EvidenceAwareClaim;
}

export interface TrustProvider {
  readonly providerId: string;
  readonly displayName: string;
  readonly enabled: boolean;
  readonly verificationUrl?: string;
  readonly logo?: PublicAssetReference;
  readonly claim?: EvidenceAwareClaim;
}

export interface TrustSettings {
  readonly claims: readonly EvidenceAwareClaim[];
  readonly providers: readonly TrustProvider[];
}

export type EnamadStatus = "unconfigured" | "pending" | "verified" | "suspended";

export interface EnamadSettings {
  readonly enabled: boolean;
  readonly provider: "enamad";
  readonly publicIdentifier?: string;
  readonly verificationUrl?: string;
  readonly logoAsset?: PublicAssetReference;
  readonly verifiedDomain?: string;
  readonly status: EnamadStatus;
  readonly lastVerifiedAt?: ISODateTime;
}

export type PublicPaymentProviderId =
  | "zarinpal"
  | "idpay"
  | "nextpay"
  | "saman"
  | "mellat"
  | "parsian"
  | "pasargad"
  | "shaparak"
  | "cash-on-delivery"
  | "bank-transfer";

export interface PublicPaymentMethod {
  readonly providerId: PublicPaymentProviderId;
  readonly displayName: string;
  readonly logo?: PublicAssetReference;
  readonly enabled: boolean;
  readonly displayOrder: number;
  readonly publicDescription?: string;
  readonly supportedCurrencies: readonly CurrencyCode[];
}

export type CheckoutMode = "disabled" | "manual" | "online";

export interface PaymentPresentationSettings {
  readonly checkoutMode: CheckoutMode;
  readonly methods: readonly PublicPaymentMethod[];
}

export type SupportedStoreCurrency = "IRR" | "USD" | "EUR" | "AED" | "GBP";

export interface PricePresentation {
  readonly currency: SupportedStoreCurrency;
  readonly locale: LocaleCode;
  readonly unitLabel: string;
  readonly amountDivisor: number;
  readonly minimumFractionDigits: number;
  readonly maximumFractionDigits: number;
  readonly useGrouping: boolean;
}

export interface CurrencySettings {
  readonly defaultCurrency: SupportedStoreCurrency;
  readonly supportedCurrencies: readonly SupportedStoreCurrency[];
  readonly defaultLocale: LocaleCode;
  readonly supportedLocales: readonly LocaleCode[];
  readonly prices: readonly PricePresentation[];
}

export interface FeatureFlags {
  readonly wishlist: boolean;
  readonly compare: boolean;
  readonly recentlyViewed: boolean;
  readonly quickView: boolean;
  readonly reviews: boolean;
  readonly ratings: boolean;
  readonly newsletter: boolean;
  readonly contactForm: boolean;
  readonly auth: boolean;
  readonly checkout: boolean;
  readonly enamad: boolean;
  readonly paymentMethods: boolean;
  readonly shippingEstimator: boolean;
  readonly returnPolicy: boolean;
  readonly warranty: boolean;
}

export type PublicCapabilityStatus = "unavailable" | "configured";

export interface PublicIntegrationCapabilities {
  readonly auth: PublicCapabilityStatus;
  readonly contactForm: PublicCapabilityStatus;
  readonly newsletter: PublicCapabilityStatus;
  readonly reviews: PublicCapabilityStatus;
  readonly checkout: CheckoutMode;
}

export interface StoreEnvironmentSettings {
  readonly name: StoreEnvironmentName;
  readonly source: StoreSettingsSource;
  readonly fixture: boolean;
  readonly configurationVersion: string;
  readonly updatedAt?: ISODateTime;
  readonly capabilities: PublicIntegrationCapabilities;
}

export interface SeoDefaults {
  readonly siteUrl: string;
  readonly defaultTitle: string;
  readonly titleTemplate: string;
  readonly defaultDescription: string;
  readonly defaultLocale: LocaleCode;
  readonly robots: "index,follow" | "noindex,follow" | "noindex,nofollow";
  readonly defaultImage?: PublicAssetReference;
}

export interface PublicOrganizationData {
  readonly publicName: string;
  readonly legalName?: string;
  readonly url: string;
  readonly logo?: PublicAssetReference;
  readonly sameAs: readonly string[];
}

export interface ContentVisibility {
  readonly legalIdentity: boolean;
  readonly contact: boolean;
  readonly supportHours: boolean;
  readonly socialLinks: boolean;
  readonly shipping: boolean;
  readonly returns: boolean;
  readonly warranty: boolean;
  readonly authenticity: boolean;
  readonly trustProviders: boolean;
  readonly enamad: boolean;
  readonly paymentMethods: boolean;
}

export interface PublicStoreSettings {
  readonly schemaVersion: 1;
  readonly brand: BrandSettings;
  readonly legal: LegalSettings;
  readonly contact: ContactSettings;
  readonly support: SupportSettings;
  readonly social: SocialSettings;
  readonly shipping: ShippingSettings;
  readonly returns: ReturnSettings;
  readonly warranty: WarrantySettings;
  readonly authenticity: AuthenticitySettings;
  readonly trust: TrustSettings;
  readonly enamad: EnamadSettings;
  readonly payment: PaymentPresentationSettings;
  readonly currency: CurrencySettings;
  readonly features: FeatureFlags;
  readonly seo: SeoDefaults;
  readonly organization: PublicOrganizationData;
  readonly contentVisibility: ContentVisibility;
  readonly environment: StoreEnvironmentSettings;
}

declare const validatedPublicStoreSettings: unique symbol;

export type ValidatedPublicStoreSettings = PublicStoreSettings & {
  readonly [validatedPublicStoreSettings]: true;
};
