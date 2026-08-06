import type { EntityId, ISODateTime, Money } from "../shared";

export const COMMERCE_SCHEMA_VERSION = 1 as const;
export const COMMERCE_STORAGE_KEY = "kronos_commerce_v1";
export const COMMERCE_SYNC_EVENT = "kronos:commerce-state-changed";

export interface ProductSnapshot {
  readonly productId: EntityId;
  readonly variantId: EntityId;
  readonly productSlug: string;
  readonly name: string;
  readonly variantLabel?: string;
  readonly sku: string;
  readonly imageUrl?: string;
}

export interface CartItem {
  readonly lineId: string;
  readonly productId: EntityId;
  readonly variantId: EntityId;
  readonly quantity: number;
  readonly unitPriceSnapshot: Money;
  readonly productSnapshot: ProductSnapshot;
  readonly addedAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}

export interface Cart {
  readonly items: readonly CartItem[];
  readonly currency: string;
  readonly updatedAt: ISODateTime;
}

export interface WishlistItem {
  readonly productId: EntityId;
  readonly preferredVariantId?: EntityId;
  readonly addedAt: ISODateTime;
}

export interface CompareItem {
  readonly productId: EntityId;
  readonly variantId?: EntityId;
  readonly addedAt: ISODateTime;
}

export interface RecentlyViewedItem {
  readonly productId: EntityId;
  readonly variantId?: EntityId;
  readonly viewedAt: ISODateTime;
}

export type CouponState =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "checking"; code: string }>
  | Readonly<{ status: "valid"; code: string; discountMinor: number; message?: string }>
  | Readonly<{ status: "invalid"; code: string; reason: string }>;

export interface ShippingSelection {
  readonly methodId: EntityId;
  readonly labelSnapshot: string;
  readonly priceSnapshot: Money;
  readonly selectedAt: ISODateTime;
}

export interface CheckoutAddressDraft {
  readonly recipientName?: string;
  readonly phone?: string;
  readonly countryCode?: string;
  readonly province?: string;
  readonly city?: string;
  readonly postalCode?: string;
  readonly addressLine?: string;
}

export interface CheckoutDraft {
  readonly email?: string;
  readonly address: CheckoutAddressDraft;
  readonly shipping?: ShippingSelection;
  readonly customerNote?: string;
  readonly acceptedPurchaseTerms: boolean;
  readonly updatedAt: ISODateTime;
}

export interface CommerceStateV1 {
  readonly version: 1;
  readonly cart: Cart;
  readonly wishlist: readonly WishlistItem[];
  readonly compare: readonly CompareItem[];
  readonly recentlyViewed: readonly RecentlyViewedItem[];
  readonly coupon: CouponState;
  readonly checkoutDraft?: CheckoutDraft;
  readonly updatedAt: ISODateTime;
}

export interface PersistedCommerceEnvelopeV1 {
  readonly schema: "kronos-commerce";
  readonly version: 1;
  readonly state: CommerceStateV1;
}

export interface QuantityRule {
  readonly min: number;
  readonly max?: number;
  readonly increment: number;
}

export function clampQuantity(requested: number, rule: QuantityRule, availableQuantity?: number): number {
  const hardMax = Math.min(rule.max ?? Number.MAX_SAFE_INTEGER, availableQuantity ?? Number.MAX_SAFE_INTEGER);
  const normalized = rule.min + Math.floor((Math.max(rule.min, requested) - rule.min) / rule.increment) * rule.increment;
  return Math.min(normalized, hardMax);
}

export function makeLineId(productId: EntityId, variantId: EntityId): string {
  return `${productId}::${variantId}`;
}

export function sumMoney(values: readonly Money[]): Money | null {
  if (!values.length) return null;
  const first = values[0];
  if (!values.every((value) => value.currency === first.currency && value.fractionDigits === first.fractionDigits)) throw new Error("Cannot add money with different currencies or fraction digits");
  return { amountMinor: values.reduce((total, value) => total + value.amountMinor, 0), currency: first.currency, fractionDigits: first.fractionDigits };
}

export function calculateCartSubtotal(cart: Cart): Money | null {
  return sumMoney(cart.items.map((item) => ({ ...item.unitPriceSnapshot, amountMinor: item.unitPriceSnapshot.amountMinor * item.quantity })));
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const stringValue = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const validMoney = (value: unknown): value is Money => record(value) && Number.isSafeInteger(value.amountMinor) && Number(value.amountMinor) >= 0 && stringValue(value.currency) && Number.isInteger(value.fractionDigits) && Number(value.fractionDigits) >= 0;

function validCartItem(value: unknown): value is CartItem {
  if (!record(value) || !stringValue(value.lineId) || !stringValue(value.productId) || !stringValue(value.variantId)) return false;
  if (!Number.isInteger(value.quantity) || Number(value.quantity) < 1 || !validMoney(value.unitPriceSnapshot)) return false;
  if (!record(value.productSnapshot) || !stringValue(value.productSnapshot.productId) || !stringValue(value.productSnapshot.variantId) || !stringValue(value.productSnapshot.productSlug) || !stringValue(value.productSnapshot.name) || !stringValue(value.productSnapshot.sku)) return false;
  return stringValue(value.addedAt) && stringValue(value.updatedAt);
}

export function parsePersistedCommerce(input: string): PersistedCommerceEnvelopeV1 | null {
  let value: unknown;
  try { value = JSON.parse(input); } catch { return null; }
  if (!record(value) || value.schema !== "kronos-commerce" || value.version !== 1 || !record(value.state)) return null;
  const state = value.state;
  if (state.version !== 1 || !record(state.cart) || !Array.isArray(state.cart.items) || !state.cart.items.every(validCartItem)) return null;
  if (!stringValue(state.cart.currency) || !stringValue(state.cart.updatedAt) || !Array.isArray(state.wishlist) || !Array.isArray(state.compare) || !Array.isArray(state.recentlyViewed) || !record(state.coupon) || !stringValue(state.updatedAt)) return null;
  return value as unknown as PersistedCommerceEnvelopeV1;
}

export type CommerceMigration = (legacy: unknown) => PersistedCommerceEnvelopeV1 | null;

export function migrateLegacyCommerce(legacyCart: unknown, legacyWishlist: unknown, now: ISODateTime): PersistedCommerceEnvelopeV1 | null {
  if (!Array.isArray(legacyCart) || !Array.isArray(legacyWishlist)) return null;
  /* Numeric legacy IDs cannot safely resolve variants. Keep no guessed cart lines; later integration may reconcile with catalog data. */
  const wishlist: WishlistItem[] = legacyWishlist.filter((id): id is number => Number.isInteger(id)).map((id) => ({ productId: `legacy:${id}`, addedAt: now }));
  return {
    schema: "kronos-commerce",
    version: 1,
    state: {
      version: 1,
      cart: { items: [], currency: "IRR", updatedAt: now },
      wishlist,
      compare: [],
      recentlyViewed: [],
      coupon: { status: "empty" },
      updatedAt: now,
    },
  };
}

export interface CrossTabCommerceMessage {
  readonly sourceTabId: string;
  readonly revision: number;
  readonly stateUpdatedAt: ISODateTime;
}
