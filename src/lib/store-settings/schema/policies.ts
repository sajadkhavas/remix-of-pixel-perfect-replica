import { z } from "zod";
import { EvidenceAwareClaimSchema } from "./evidence";
import {
  PublicAssetReferenceSchema,
  SUPPORTED_STORE_CURRENCIES,
  httpsUrlSchema,
  relativePathSchema,
  trimString,
} from "./primitives";

export const shippingSchema = z
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

export const returnSchema = z
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

export const warrantySchema = createPolicySchema();
export const authenticitySchema = createPolicySchema();

const trustProviderSchema = z
  .object({
    providerId: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
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

export const trustSchema = z
  .object({
    claims: z.array(EvidenceAwareClaimSchema).max(100),
    providers: z.array(trustProviderSchema).max(20),
  })
  .strict();
