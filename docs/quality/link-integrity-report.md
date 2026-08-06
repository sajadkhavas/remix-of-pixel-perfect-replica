# Link Integrity Report

**Current exact debt:** 3 findings.

`scripts/quality/link-integrity.mjs` distinguishes implemented, planned, invalid, unknown, and placeholder destinations using `quality/route-coverage.json`.

The scanner detects `href="#"`, empty targets, JavaScript URLs, `/watches`, unknown internal paths, planned-but-missing route CTAs, static buttons without an observable action, and external `_blank` anchors without safe `rel` values.

A planned route is never treated as implemented and receives no fake green smoke test. Every debt entry is exact and owned. Release requires no placeholder, invalid, unknown, or planned-but-unimplemented production destination.
