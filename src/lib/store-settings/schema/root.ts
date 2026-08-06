import { z } from "zod";
import { brandSchema, contactSchema, legalSchema, socialSchema, supportSchema } from "./contact";
import {
  EnamadSettingsSchema,
  contentVisibilitySchema,
  currencySchema,
  environmentSchema,
  featureFlagsSchema,
  organizationSchema,
  paymentSchema,
  seoDefaultsSchema,
} from "./integrations";
import {
  authenticitySchema,
  returnSchema,
  shippingSchema,
  trustSchema,
  warrantySchema,
} from "./policies";
import { isHttpsUrl } from "./primitives";

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
      path: "auth" | "contactForm" | "newsletter" | "reviews",
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

    if (
      settings.features.returnPolicy &&
      !(settings.returns.enabled && settings.returns.configured)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["features", "returnPolicy"],
        message: "Return-policy feature requires configured return policy",
      });
    }

    if (
      settings.features.warranty &&
      !(settings.warranty.enabled && settings.warranty.configured)
    ) {
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
      settings.features.enamad && settings.enamad.enabled && settings.enamad.status === "verified",
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
