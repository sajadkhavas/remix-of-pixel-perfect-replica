# ADR-002: Normalized product domain model

- **Status:** Accepted
- **Date:** 2026-08-05
- **Owners:** F2 Information Architecture

## Context

The baseline `Watch` type is declared inside `ProductCard`, uses numeric public identity, brand text, one image, implicit sale pricing, a stock number, and no variants. Catalog data imports this UI type, so presentation owns the commerce contract.

## Decision

Create a React-independent normalized Product model with separate identity/slug, localized content, typed media, money, pricing, inventory, variants, specifications, reviews, policies, SEO, status, and evidence references. Relations use stable IDs. API DTOs remain `unknown` at the transport boundary and adapters validate/normalize them before repositories return domain entities.

## Consequences

- UI no longer defines the source data shape;
- variants can own SKU, price, media, and inventory;
- money and availability semantics become testable;
- adapters add mapping work but isolate backend changes;
- page-specific view models may project the domain without mutating it.

## Alternatives rejected

- **Extend the current `Watch` interface:** preserves UI coupling and ambiguous fields.
- **Use API DTOs directly:** leaks transport naming/nullability and prevents stable frontend semantics.
- **Embed full Brand/Category objects in every Product:** creates stale duplication and difficult updates.
