# ADR-001: URL-driven discovery state

- **Status:** Accepted
- **Date:** 2026-08-05
- **Owners:** F2 Information Architecture

## Context

The baseline shop stores query, category, and sort in React component state. Refresh loses selections, deep links cannot reproduce results, browser history is incomplete, and SEO rules cannot consistently inspect discovery state.

## Decision

Applied search, filter, sort, pagination, and view state is represented by normalized URL search parameters. `src/domain/search` owns parsing, normalization, stable serialization, defaults, and SEO classification. TanStack Router integration later calls these pure contracts through route search validation. Transient UI details such as an open mobile drawer remain local.

## Consequences

- refresh, sharing, deep linking, and back/forward become deterministic;
- loaders and repositories receive one normalized state shape;
- invalid values can be removed or replaced without entering domain queries;
- URL changes require deliberate history semantics and tests;
- arbitrary facet URLs require separate noindex/canonical policy.

## Alternatives rejected

- **Component state only:** fails persistence, history, and SEO.
- **Global React context as source of truth:** still duplicates the URL and creates hydration synchronization problems.
- **One opaque JSON parameter:** harms readability, cacheability, analytics, and canonical stability.
