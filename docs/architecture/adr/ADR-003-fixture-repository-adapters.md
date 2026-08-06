# ADR-003: Fixture repository adapters

- **Status:** Accepted
- **Date:** 2026-08-05
- **Owners:** F2 Information Architecture

## Context

Frontend development must continue before a backend exists, but current routes import static arrays directly. Replacing those arrays later would require route and component rewrites.

## Decision

Define repository interfaces for catalog, product, brand, search, content, and store settings. Provide deterministic fixture implementations returning normalized domain entities. Fixture brands, products, claims, and stories are explicitly fictional. Routes are not wired in F2.

## Consequences

- future API adapters can replace fixtures at composition time;
- contract tests can run against both implementations;
- fixtures remain useful for deterministic UI/error testing;
- repository interfaces must avoid backend-specific endpoint assumptions;
- no real fetch URL is introduced in this phase.

## Alternatives rejected

- **Direct fixture imports:** creates migration work and duplicate query logic.
- **Mock HTTP endpoints:** invents an unsupported backend contract.
- **Copy a platform SDK model:** couples KRONOS to unrelated platform decisions.
