import { z } from "zod";
import {
  EvidenceAwareClaimSchema,
  PublicEvidenceSchema,
  confirmationStatusSchema,
  validateConfirmedValue,
} from "./evidence";
import {
  PublicAssetReferenceSchema,
  countryCodeSchema,
  httpsUrlSchema,
  trimString,
} from "./primitives";

export const brandSchema = z
  .object({
    name: trimString(1, 120),
    localizedName: trimString(1, 120).optional(),
    shortName: trimString(1, 80).optional(),
    slogan: trimString(1, 240).optional(),
    logo: PublicAssetReferenceSchema.optional(),
  })
  .strict();

export const legalSchema = z
  .object({
    legalName: trimString(1, 200).optional(),
    nationalId: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9-]{5,40}$/)
      .optional(),
    registrationNumber: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9-]{2,40}$/)
      .optional(),
    legalRepresentative: trimString(1, 160).optional(),
    privacyContactEmail: z.string().trim().email().max(254).optional(),
  })
  .strict();

const phoneSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
    label: trimString(1, 80),
    e164: z
      .string()
      .regex(/^\+[1-9]\d{7,14}$/, "Phone number must use E.164 format"),
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
    postalCode: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9 -]{3,20}$/)
      .optional(),
    status: confirmationStatusSchema,
    evidence: PublicEvidenceSchema.optional(),
  })
  .strict()
  .superRefine(validateConfirmedValue);

export const contactSchema = z
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
    if (new Set(value.days.map((day) => day.day)).size !== value.days.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days"],
        message: "Business-hours days must be unique",
      });
    }
  });

export const supportSchema = z
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

type SocialPlatform = z.infer<typeof socialPlatformSchema>;

const socialHosts: Readonly<Record<SocialPlatform, readonly string[]>> = {
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

export const socialSchema = z
  .object({
    links: z.array(socialLinkSchema).max(24),
  })
  .strict();
