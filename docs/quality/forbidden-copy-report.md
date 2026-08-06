# Forbidden Production Copy Report

**Current exact debt:** 31 findings.

`scripts/quality/forbidden-copy.mjs` scans rendered source under `src/**/*.{ts,tsx,js,jsx,mjs,cjs}` and excludes docs, tests, controlled fixtures, dependencies, generated output, and quality registries.

It detects explicit demo/experimental wording, deferred-feature wording, no-real-order/payment notices, generic placeholders, placeholder contact details, unsupported authenticity/free-shipping claims, hard-coded review counts, and suspicious satisfaction statistics.

Every baseline entry contains file, line, column, rule, excerpt hash, owner, reason, removal condition, and expiry. New or moved debt fails; resolved debt is reported for removal. Wildcards and directory-level exceptions are unsupported.

Content/trust owners must reconcile findings with `docs/content/current-content-audit.md` and `docs/content/trust-claims-registry.md`. Release surfaces require zero unsupported production-copy debt.
