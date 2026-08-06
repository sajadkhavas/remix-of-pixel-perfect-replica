# F14A Frontend Release Gate

## Release decision

The quality harness may be ready for supervisor review while the current storefront remains **not release-ready**. Baselines preserve known debt so new regressions are blocked; they do not approve the debt.

## Mandatory automated gates

A release candidate must satisfy all of the following on the exact candidate SHA:

- zero installation and lockfile errors;
- zero format failures;
- zero build errors;
- zero TypeScript errors;
- zero ESLint errors;
- zero new, expired, moved, or unowned lint warnings;
- final target of zero lint warnings;
- all unit and contract tests pass;
- all route smoke, hydration/console, accessibility, reduced-motion, and keyboard suites pass;
- no new forbidden production copy;
- forbidden-copy debt reduced to zero for release surfaces;
- no placeholder, empty, invalid, unknown, or planned-but-unimplemented production link;
- critical accessibility defects equal zero;
- no unapproved production asset;
- every release asset has verified source, license, identity, dimensions, alt metadata, responsive variants, and mobile crop where required;
- route metadata, canonical, robots, sitemap, and URL-policy validation pass;
- bundle/performance hard limits pass;
- quality summary matches every machine-readable registry.

## Mandatory manual gates

- all mandatory cells in `docs/quality/manual-qa-protocol.md` executed;
- visual acceptance checklist signed for each release page;
- Chrome, Firefox, Safari/WebKit, Edge-compatible Chromium, Android, and iOS coverage signed;
- keyboard, touch, screen reader, 200% zoom, reduced motion, forced colors, slow network, offline, loading, empty, and error states signed;
- content/trust/legal claims approved by their accountable owner;
- no release-blocking issue remains open.

## Current-debt model

Every temporary baseline entry must contain:

1. known defect;
2. exact file/line or route/project/rule/selector;
3. severity or impact;
4. owner phase;
5. reason for temporary baseline;
6. removal condition;
7. expiry date.

Wildcards, broad rule suppression, blanket `eslint-disable`, hidden axe exclusions, directory ignores, empty catch blocks, `continue-on-error`, and `|| true` are prohibited.

## Failure and exception policy

- Any required CI job failure blocks integration and release.
- A baseline may only be updated by intentionally inventorying exact current findings; release CI never runs capture mode.
- Resolved debt must be removed rather than retained as unused permission.
- An exception requires supervisor approval, exact scope, named owner, expiry, customer impact, mitigation, and rollback plan.
- Security, payment, legal, critical accessibility, or data-integrity failures are not eligible for cosmetic waivers.

## Current release blockers

At the F14A baseline, the storefront remains blocked by known lint warnings, forbidden/unsupported copy, placeholder links, unapproved assets, accessibility/touch/focus debt, reduced-motion debt, incomplete route architecture, missing manual sign-off, and a homepage SSR/editorial runtime defect observed during browser execution.

## Approval record

Record:

- release SHA;
- CI workflow run and all job results;
- performance-current file;
- quality-summary file;
- manual QA evidence location;
- QA, accessibility, design, performance, product/content, and supervisor approvals.
