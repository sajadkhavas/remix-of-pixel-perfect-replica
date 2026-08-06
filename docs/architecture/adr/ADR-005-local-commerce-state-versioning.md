# ADR-005: Versioned local commerce state

- **Status:** Accepted
- **Date:** 2026-08-05
- **Owners:** F2 Information Architecture

## Context

The baseline stores `{id, qty}` cart lines and numeric wishlist IDs in unversioned localStorage. JSON is cast without validation; variants, stock limits, price snapshots, migrations, and cross-tab synchronization are absent.

## Decision

Use a versioned `kronos-commerce` persistence envelope. Cart lines identify product and variant, contain bounded quantity plus non-authoritative display/price snapshots, and are reconciled with repositories. Runtime parsing rejects malformed state. Version-to-version migration is explicit. Cross-tab synchronization uses revisions through a storage/BroadcastChannel adapter. Monetary arithmetic uses integer minor units and one currency/fraction system per calculation.

## Consequences

- invalid storage cannot crash hydration or silently become trusted state;
- schema changes have a migration path;
- stale products, variants, prices, and stock are detected during reconciliation;
- legacy numeric cart lines are not guessed into variants;
- a future server cart can replace local truth while preserving frontend projections.

## Alternatives rejected

- **Keep unversioned arrays:** makes safe evolution impossible.
- **Persist complete Product objects:** creates large stale snapshots and duplicates catalog truth.
- **Infer a default variant for every legacy cart ID:** risks purchasing the wrong SKU.
