# Link Integrity Report

The executable scanner is `scripts/quality/link-integrity.mjs`.

## Route-aware classification

- **implemented:** matches one of the 13 current generated route patterns.
- **planned:** appears in the accepted 39-route final architecture but is not currently implemented.
- **invalid:** explicitly rejected by Gate 1, currently `/watches`.
- **unknown:** absent from both implemented and planned maps.
- **placeholder:** `href="#"`, empty target, JavaScript URL, or static actionless button.

The scanner also reports external `target="_blank"` anchors without `noopener`/`noreferrer`.

## Policy

A planned route is not treated as implemented and may not receive a fake green smoke test. A source CTA pointing to a planned-but-missing route remains exact debt until the owning route phase ships it. The baseline cannot contain wildcard routes or selectors.
