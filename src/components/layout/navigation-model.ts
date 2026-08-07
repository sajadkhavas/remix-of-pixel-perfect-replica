import type {
  PublicEmail,
  PublicPaymentMethod,
  PublicPhone,
  PublicStoreSettings,
  SocialLink,
} from "@/domain/store-settings";
import { hasCurrentEvidence, resolveClaimPresentation } from "@/domain/store-settings";

export const PRIMARY_NAV_ITEMS = [
  { label: "فروشگاه", to: "/shop" },
  { label: "برندها", to: "/brands" },
  { label: "مجله", to: "/blog" },
  { label: "خدمات", to: "/services" },
  { label: "درباره", to: "/about" },
  { label: "تماس", to: "/contact" },
] as const;

export function getAnnouncementText(settings: PublicStoreSettings): string | null {
  const candidates = [
    settings.shipping.presentationClaim,
    settings.authenticity.presentationClaim,
    settings.warranty.presentationClaim,
    ...settings.trust.claims,
  ];

  for (const claim of candidates) {
    const presentation = resolveClaimPresentation(claim);
    if (presentation.kind !== "hidden") return presentation.text;
  }

  return null;
}

export function shouldShowWishlist(settings: PublicStoreSettings): boolean {
  return settings.features.wishlist;
}

export function shouldShowAccount(settings: PublicStoreSettings): boolean {
  return settings.features.auth && settings.environment.capabilities.auth === "configured";
}

export function getConfirmedPhones(settings: PublicStoreSettings): readonly PublicPhone[] {
  if (!settings.contentVisibility.contact) return [];
  return settings.contact.phones.filter(
    (phone) => phone.status === "confirmed" && hasCurrentEvidence(phone.evidence),
  );
}

export function getConfirmedEmails(settings: PublicStoreSettings): readonly PublicEmail[] {
  if (!settings.contentVisibility.contact) return [];
  return settings.contact.emails.filter(
    (email) => email.status === "confirmed" && hasCurrentEvidence(email.evidence),
  );
}

export function getConfirmedSocialLinks(settings: PublicStoreSettings): readonly SocialLink[] {
  if (!settings.contentVisibility.socialLinks) return [];
  return settings.social.links.filter(
    (link) => link.status === "confirmed" && hasCurrentEvidence(link.evidence),
  );
}

export function getVisiblePaymentMethods(settings: PublicStoreSettings): readonly PublicPaymentMethod[] {
  if (!settings.features.paymentMethods || !settings.contentVisibility.paymentMethods) return [];
  return settings.payment.methods
    .filter((method) => method.enabled)
    .slice()
    .sort((a: PublicPaymentMethod, b: PublicPaymentMethod) => a.displayOrder - b.displayOrder);
}
