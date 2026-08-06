import type {
  BusinessHoursSettings,
  ContactSettings,
  PublicAddress,
  PublicPaymentMethod,
  PublicStoreSettings,
  SocialLink,
  TrustProvider,
  Weekday,
} from "../../domain/store-settings";
import { hasCurrentEvidence } from "../../domain/store-settings";

function hasDisplayEvidence(
  status: PublicStoreSettings["trust"]["claims"][number]["status"],
  evidence: PublicStoreSettings["trust"]["claims"][number]["evidence"],
  now: Date,
): boolean {
  return status === "confirmed" && hasCurrentEvidence(evidence, now);
}

export function getStoreDisplayName(settings: PublicStoreSettings, locale = "fa-IR"): string {
  if (locale.toLowerCase().startsWith("fa") && settings.brand.localizedName?.trim()) {
    return settings.brand.localizedName.trim();
  }
  return settings.brand.name.trim();
}

export function getDisplayContacts(
  settings: Pick<PublicStoreSettings, "contact" | "contentVisibility">,
  now: Date = new Date(),
): ContactSettings {
  if (!settings.contentVisibility.contact) {
    return { phones: [], emails: [] };
  }

  const phones = settings.contact.phones.filter((phone) =>
    hasDisplayEvidence(phone.status, phone.evidence, now),
  );
  const emails = settings.contact.emails.filter((email) =>
    hasDisplayEvidence(email.status, email.evidence, now),
  );
  const address =
    settings.contact.address &&
    hasDisplayEvidence(settings.contact.address.status, settings.contact.address.evidence, now)
      ? settings.contact.address
      : undefined;

  return { phones, emails, address };
}

export function formatPublicAddress(address: PublicAddress | undefined): string | null {
  if (!address) return null;
  const parts = [
    address.province,
    address.city,
    address.district,
    address.street,
    address.building,
    address.postalCode,
  ].filter((part): part is string => Boolean(part?.trim()));
  return parts.length > 0 ? parts.join("، ") : null;
}

const weekdayLabels: Readonly<Record<Weekday, string>> = {
  saturday: "شنبه",
  sunday: "یکشنبه",
  monday: "دوشنبه",
  tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه",
  thursday: "پنجشنبه",
  friday: "جمعه",
};

export function formatBusinessHours(
  businessHours: BusinessHoursSettings | undefined,
): readonly string[] {
  if (!businessHours || businessHours.status !== "confirmed" || !businessHours.evidence) return [];

  return businessHours.days.map((day) => {
    if (day.closed) return `${weekdayLabels[day.day]}: تعطیل`;
    const intervals = day.intervals
      .map((interval) => `${interval.opensAt} تا ${interval.closesAt}`)
      .join("، ");
    return `${weekdayLabels[day.day]}: ${intervals}`;
  });
}

export function formatPrice(
  amountMinor: number,
  currency: string,
  settings: Pick<PublicStoreSettings, "currency">,
): string | null {
  if (!Number.isSafeInteger(amountMinor)) return null;
  const presentation = settings.currency.prices.find((price) => price.currency === currency);
  if (!presentation) return null;

  const displayAmount = amountMinor / presentation.amountDivisor;
  const number = new Intl.NumberFormat(presentation.locale, {
    useGrouping: presentation.useGrouping,
    minimumFractionDigits: presentation.minimumFractionDigits,
    maximumFractionDigits: presentation.maximumFractionDigits,
  }).format(displayAmount);

  return `${number} ${presentation.unitLabel}`;
}

export function getVisibleSocialLinks(
  settings: Pick<PublicStoreSettings, "social" | "contentVisibility">,
  now: Date = new Date(),
): readonly SocialLink[] {
  if (!settings.contentVisibility.socialLinks) return [];
  return settings.social.links.filter((link) =>
    hasDisplayEvidence(link.status, link.evidence, now),
  );
}

export function getEnabledPaymentMethods(
  settings: Pick<PublicStoreSettings, "payment" | "contentVisibility" | "features">,
): readonly PublicPaymentMethod[] {
  if (!settings.features.paymentMethods || !settings.contentVisibility.paymentMethods) return [];
  return settings.payment.methods
    .filter((method) => method.enabled)
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function getVisibleTrustProviders(
  settings: Pick<PublicStoreSettings, "trust" | "contentVisibility">,
  now: Date = new Date(),
): readonly TrustProvider[] {
  if (!settings.contentVisibility.trustProviders) return [];
  return settings.trust.providers.filter(
    (provider) =>
      provider.enabled &&
      provider.claim !== undefined &&
      provider.claim.status === "confirmed" &&
      hasDisplayEvidence(provider.claim.status, provider.claim.evidence, now),
  );
}
