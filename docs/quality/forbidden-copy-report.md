# Forbidden Production Copy Report

The executable scanner is `scripts/quality/forbidden-copy.mjs`.

## Coverage

- Scans `src/**/*.{ts,tsx,js,jsx,mjs,cjs}`.
- Excludes documentation, tests, controlled fixtures, generated output, dependencies, and quality registry files.
- Detects explicit demo/experimental wording, deferred-feature wording, no-real-order/payment notices, generic placeholders, placeholder contacts, unsupported authenticity/free-shipping claims, hard-coded review counts, and suspicious satisfaction statistics.
- Each baseline entry is exact: file, line, column, rule, excerpt hash, owner, reason, removal condition, and expiry.
- `--write-baseline` exists only for controlled initial inventory. It is not used by release CI.

## Governance

- New finding: fail.
- Existing finding at a different line or with different excerpt: fail as new debt.
- Resolved finding: pass while reporting that the obsolete baseline entry must be removed.
- Wildcards, directory-level exceptions, and ignored rule families are not supported.
- Content/trust owners must reconcile findings with `docs/content/current-content-audit.md` and `docs/content/trust-claims-registry.md`.
