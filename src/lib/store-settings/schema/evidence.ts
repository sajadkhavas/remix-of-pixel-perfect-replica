import { z } from "zod";
import { CLAIM_STATUSES, isoDateTimeSchema, trimString } from "./primitives";

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

export const confirmationStatusSchema = z.enum(CLAIM_STATUSES);

export function validateConfirmedValue(
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

export const EvidenceAwareClaimSchema = z
  .object({
    id: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
    status: confirmationStatusSchema,
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
