# Frontend Commerce State Contract

## Scope

This contract defines local frontend state before backend cart, account, promotion, inventory-reservation, and checkout services exist. It does not modify the current `StoreProvider`; migration is deferred to a later phase.

## Source of truth and snapshots

A cart line identifies both `productId` and `variantId`. It also stores a small display snapshot and unit-price snapshot so the UI can render after restoration. Snapshots are not authoritative for checkout. On every repository refresh and before checkout, the application must reconcile product existence, variant status, current price, currency, quantity rules, and stock.

`lineId` is deterministically `${productId}::${variantId}`. Adding the same variant increments the existing line; a different variant creates another line.

## Quantity rules

- Quantity is an integer greater than or equal to the variant minimum.
- It must follow `orderIncrement`.
- It cannot exceed the smallest defined value among variant maximum, current available stock, and store policy cap.
- Out-of-stock or discontinued variants cannot be incremented.
- A reconciliation that lowers the cap clamps quantity and surfaces a user-visible notice.
- Quantity zero removes the line at the command layer; persisted lines never store zero.

`clampQuantity` centralizes this calculation.

## Monetary calculations

- All arithmetic uses integer `amountMinor` values.
- Values with different currency codes or fraction digits cannot be combined.
- Cart subtotal is sum of `unitPriceSnapshot × quantity`.
- Discount, shipping, tax, and final payable total remain separate lines.
- The frontend total is an estimate until validated by the future checkout service.
- Formatting and Persian digits are presentation concerns.

## State entities

| Entity               | Identity                             | Purpose                                                  |
| -------------------- | ------------------------------------ | -------------------------------------------------------- |
| `Cart`               | one local cart                       | variant-aware line collection and currency               |
| `CartItem`           | `lineId`                             | quantity, price snapshot, product snapshot, timestamps   |
| `WishlistItem`       | product + optional preferred variant | durable interest without assuming purchase configuration |
| `CompareItem`        | product + optional variant           | bounded comparison selection                             |
| `RecentlyViewedItem` | product + optional variant           | recency history, newest occurrence wins                  |
| `CouponState`        | discriminated union                  | empty/checking/valid/invalid without ambiguous booleans  |
| `ShippingSelection`  | shipping method ID                   | selected method plus display/price snapshot              |
| `CheckoutDraft`      | one draft                            | contact, address, shipping, note, and terms acceptance   |

## Persistence envelope

Storage key: `kronos_commerce_v1`

```ts
{
  schema: "kronos-commerce",
  version: 1,
  state: CommerceStateV1
}
```

The envelope is parsed at runtime. Malformed JSON, unknown schemas, unsupported versions, invalid required fields, invalid money, or invalid lines are rejected rather than cast.

## Migration strategy

1. Read the current-version key.
2. Parse and validate the envelope.
3. If absent, inspect known legacy keys.
4. Run an explicit version-to-version migration.
5. Reconcile IDs and variants with catalog repositories.
6. Write the current envelope atomically.
7. Remove legacy keys only after successful write.
8. On migration failure, preserve the invalid payload for diagnostics only in development and start from safe empty state.

The legacy numeric cart cannot safely infer variants. F2 therefore migrates no guessed cart lines. Numeric wishlist IDs may be retained as `legacy:*` placeholders for later catalog reconciliation.

## Invalid persisted data behavior

- Never crash app boot.
- Never trust a TypeScript cast after `JSON.parse`.
- Drop invalid optional entries only when the envelope remains semantically valid; otherwise reset the envelope.
- Remove products/variants no longer present after repository reconciliation.
- Mark temporarily unavailable variants rather than silently replacing them.
- Never convert currency implicitly.

## Cross-tab synchronization

Use the browser `storage` event and optionally `BroadcastChannel` under one adapter. Messages include `sourceTabId`, monotonically increasing `revision`, and `stateUpdatedAt`.

Rules:

- Ignore messages from the current tab.
- Ignore revisions older than the applied revision.
- Apply one normalized envelope, then emit one domain change event (`kronos:commerce-state-changed`).
- Do not replay UI toasts for remote-tab changes.
- Last valid revision wins for the local-only phase; backend carts later require server reconciliation.

## Wishlist, compare, and recency policies

- Wishlist uniqueness is by product ID; preferred variant may update.
- Compare uniqueness is by product ID and is capped by store settings (fixture default: 4).
- Recently viewed uniqueness is by product ID; revisiting moves it to the front.
- Recency list has a bounded maximum and can expire by policy.
- Account wishlist and anonymous wishlist require an explicit merge strategy after authentication; no silent destructive overwrite.

## Checkout draft

The draft contains no payment credentials and no authoritative totals. `acceptedPurchaseTerms` must be false when material purchase terms change. Sensitive fields should be minimized, and a future privacy review must define retention.

## Future backend transition

Repository/service integration should replace local cart mutation with commands, maintain optimistic UI only with rollback, use server-calculated promotions/tax/shipping/totals, and preserve the domain entities as frontend projections. The local persistence adapter becomes a cache, not the source of truth.
