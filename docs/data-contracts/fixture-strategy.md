# Fixture Strategy

## Purpose

Fixtures enable frontend development before backend integration without becoming a second product model. Routes should ultimately depend on repository interfaces rather than importing fixture arrays.

## Rules

- all new fixture brands, products, stories, claims, and IDs are explicitly fictional;
- the UI does not need a “demo version” label; development provenance is documented in source and fixture SEO is noindex;
- IDs are deterministic strings;
- slugs are lowercase ASCII kebab-case;
- asset URLs resolve from existing repository assets using `new URL(..., import.meta.url)`;
- fixtures include active, low-stock, out-of-stock, untracked, sale, non-sale, multiple variants, and missing optional data;
- error, empty, and loading behavior belongs in development wrappers, not artificial production delays;
- fixture adapters implement the same interfaces as future API adapters;
- fixtures are immutable normalized domain entities.

## API replacement path

1. Add a transport client outside `src/domain`.
2. Validate `ProductDtoV1`, `BrandDtoV1`, and `CategoryDtoV1` at the adapter boundary.
3. Normalize DTOs to domain entities.
4. Implement repository interfaces.
5. Swap repository composition in application wiring.
6. Run contract tests against fixture and API implementations.
7. Remove direct fixture imports from production routes.
8. Keep fixtures for deterministic tests and isolated component development.

## Development scenarios

A development-only adapter wrapper may return repository unavailable, malformed DTO rejected, product not found, empty category, stale persisted variant, delayed response, or partial optional media. No endpoint URL is defined or hard-coded in F2.
