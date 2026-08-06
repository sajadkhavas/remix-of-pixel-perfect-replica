import type { ClaimPresentation, EvidenceAwareClaim, PublicEvidence } from "./types";

export function hasCurrentEvidence(
  evidence: PublicEvidence | undefined,
  now: Date = new Date(),
): evidence is PublicEvidence {
  if (!evidence) return false;

  const verifiedAt = Date.parse(evidence.verifiedAt);
  if (!Number.isFinite(verifiedAt)) return false;

  if (evidence.expiresAt) {
    const expiresAt = Date.parse(evidence.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= now.getTime()) return false;
  }

  return true;
}

export function isTrustClaimVisible(
  claim: EvidenceAwareClaim | undefined,
  now: Date = new Date(),
): boolean {
  return Boolean(
    claim &&
    claim.status === "confirmed" &&
    claim.sourceText?.trim() &&
    hasCurrentEvidence(claim.evidence, now),
  );
}

export function resolveClaimPresentation(
  claim: EvidenceAwareClaim | undefined,
  now: Date = new Date(),
): ClaimPresentation {
  if (!claim) return { kind: "hidden" };

  if (isTrustClaimVisible(claim, now)) {
    return {
      kind: "claim",
      text: claim.sourceText!.trim(),
      claimId: claim.id,
    };
  }

  if (
    claim.status !== "prohibited" &&
    claim.onMissingEvidence === "use-neutral-fallback" &&
    claim.neutralFallbackText?.trim()
  ) {
    return {
      kind: "neutral",
      text: claim.neutralFallbackText.trim(),
      claimId: claim.id,
    };
  }

  return { kind: "hidden", claimId: claim.id };
}
