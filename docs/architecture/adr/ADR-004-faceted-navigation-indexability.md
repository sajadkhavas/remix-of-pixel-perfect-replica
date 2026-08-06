# ADR-004: Faceted navigation indexability

- **Status:** Accepted
- **Date:** 2026-08-05
- **Owners:** F2 Information Architecture and Technical SEO

## Context

Watch discovery has many combinable dimensions. Allowing every combination to be indexable creates a very large duplicate/thin URL space. Canonical alone is not a reliable crawl-control strategy, while blocking every filtered URL would also prevent useful curated landings.

## Decision

Arbitrary query-based facets are `noindex,follow`. Indexable taxonomy demand is served through a finite set of clean, curated routes with unique content and stable inventory. Sort/view parameters are stripped from canonical URLs. Valid unfiltered pagination pages self-canonical. Internal links avoid generating unbounded combinations, and invalid/default values normalize away.

## Consequences

- crawl space is finite and intentional;
- new indexable landings require content/SEO approval rather than a filter flag;
- filtered pages still function and can pass link discovery while noindexed;
- canonical target depends on semantic equivalence; not every filtered URL blindly points to the base page;
- route, sitemap, robots, links, and canonical tests must stay aligned.

## Alternatives rejected

- **Index every filter URL:** creates combinatorial duplication and crawl waste.
- **Canonical every facet to base:** can falsely claim materially different pages are duplicates.
- **Block all parameters only in robots.txt:** hides crawling without reliably removing known URLs from indexing and prevents canonical signals from being seen.
