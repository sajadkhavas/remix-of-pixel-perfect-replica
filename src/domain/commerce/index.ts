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

export function clampQuantity(
  requested: number,
  rule: QuantityRule,
  availableQuantity?: number,
): number {
  if (!Number.isSafeInteger(rule.min) || rule.min < 1) {
    throw new RangeError("Quantity rule min must be a positive safe integer");
  }
  if (!Number.isSafeInteger(rule.increment) || rule.increment < 1) {
    throw new RangeError("Quantity rule increment must be a positive safe integer");
  }
  if (rule.max !== undefined && (!Number.isSafeInteger(rule.max) || rule.max < rule.min)) {
    throw new RangeError("Quantity rule max must be a safe integer greater than or equal to min");
  }
  if (
    availableQuantity !== undefined &&
    (!Number.isSafeInteger(availableQuantity) || availableQuantity < 0)
  ) {
    throw new RangeError("Available quantity must be a non-negative safe integer");
  }

  const safeRequested = Number.isFinite(requested) ? Math.trunc(requested) : rule.min;
  const hardMax = Math.min(
    rule.max ?? Number.MAX_SAFE_INTEGER,
    availableQuantity ?? Number.MAX_SAFE_INTEGER,
  );

  if (hardMax < rule.min) return hardMax;

  const cappedRequested = Math.min(Math.max(rule.min, safeRequested), hardMax);
  return rule.min + Math.floor((cappedRequested - rule.min) / rule.increment) * rule.increment;
}

export function makeLineId(productId: EntityId, variantId: EntityId): string {
  return `${productId}::${variantId}`;
}

export function sumMoney(values: readonly Money[]): Money | null {
  if (!values.length) return null;

  const first = values[0];
  if (
    !values.every(
      (value) => value.currency === first.currency && value.fractionDigits === first.fractionDigits,
    )
  ) {
    throw new Error("Cannot add money with different currencies or fraction digits");
  }

  return {
    amountMinor: values.reduce((total, value) => total + value.amountMinor, 0),
    currency: first.currency,
    fractionDigits: first.fractionDigits,
  };
}

export function calculateCartSubtotal(cart: Cart): Money | null {
  return sumMoney(
    cart.items.map((item) => ({
      ...item.unitPriceSnapshot,
      amountMinor: item.unitPriceSnapshot.amountMinor * item.quantity,
    })),
  );
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stringValue = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const optionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

const safeNonNegativeInteger = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0;

const validMoney = (value: unknown): value is Money =>
  record(value) &&
  safeNonNegativeInteger(value.amountMinor) &&
  stringValue(value.currency) &&
  safeNonNegativeInteger(value.fractionDigits);

function validProductSnapshot(value: unknown): value is ProductSnapshot {
  return (
    record(value) &&
    stringValue(value.productId) &&
    stringValue(value.variantId) &&
    stringValue(value.productSlug) &&
    stringValue(value.name) &&
    optionalString(value.variantLabel) &&
    stringValue(value.sku) &&
    optionalString(value.imageUrl)
  );
}

function validCartItem(value: unknown, cartCurrency: string): value is CartItem {
  return (
    record(value) &&
    stringValue(value.lineId) &&
    stringValue(value.productId) &&
    stringValue(value.variantId) &&
    Number.isSafeInteger(value.quantity) &&
    Number(value.quantity) >= 1 &&
    validMoney(value.unitPriceSnapshot) &&
    value.unitPriceSnapshot.currency === cartCurrency &&
    validProductSnapshot(value.productSnapshot) &&
    value.productSnapshot.productId === value.productId &&
    value.productSnapshot.variantId === value.variantId &&
    stringValue(value.addedAt) &&
    stringValue(value.updatedAt)
  );
}

function validCartItems(value: unknown, cartCurrency: string): value is CartItem[] {
  return Array.isArray(value) && value.every((item) => validCartItem(item, cartCurrency));
}

function validWishlistItem(value: unknown): value is WishlistItem {
  return (
    record(value) &&
    stringValue(value.productId) &&
    (value.preferredVariantId === undefined || stringValue(value.preferredVariantId)) &&
    stringValue(value.addedAt)
  );
}

function validCompareItem(value: unknown): value is CompareItem {
  return (
    record(value) &&
    stringValue(value.productId) &&
    (value.variantId === undefined || stringValue(value.variantId)) &&
    stringValue(value.addedAt)
  );
}

function validRecentlyViewedItem(value: unknown): value is RecentlyViewedItem {
  return (
    record(value) &&
    stringValue(value.productId) &&
    (value.variantId === undefined || stringValue(value.variantId)) &&
    stringValue(value.viewedAt)
  );
}

function validCoupon(value: unknown): value is CouponState {
  if (!record(value) || !stringValue(value.status)) return false;

  switch (value.status) {
    case "empty":
      return true;
    case "checking":
      return stringValue(value.code);
    case "valid":
      return (
        stringValue(value.code) &&
        safeNonNegativeInteger(value.discountMinor) &&
        optionalString(value.message)
      );
    case "invalid":
      return stringValue(value.code) && stringValue(value.reason);
    default:
      return false;
  }
}

function validAddress(value: unknown): value is CheckoutAddressDraft {
  return (
    record(value) &&
    optionalString(value.recipientName) &&
    optionalString(value.phone) &&
    optionalString(value.countryCode) &&
    optionalString(value.province) &&
    optionalString(value.city) &&
    optionalString(value.postalCode) &&
    optionalString(value.addressLine)
  );
}

function validShipping(value: unknown): value is ShippingSelection {
  return (
    record(value) &&
    stringValue(value.methodId) &&
    stringValue(value.labelSnapshot) &&
    validMoney(value.priceSnapshot) &&
    stringValue(value.selectedAt)
  );
}

function validCheckoutDraft(value: unknown): value is CheckoutDraft {
  return (
    record(value) &&
    optionalString(value.email) &&
    validAddress(value.address) &&
    (value.shipping === undefined || validShipping(value.shipping)) &&
    optionalString(value.customerNote) &&
    typeof value.acceptedPurchaseTerms === "boolean" &&
    stringValue(value.updatedAt)
  );
}

function hasUniqueValues(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function validPersistedEnvelope(value: unknown): value is PersistedCommerceEnvelopeV1 {
  if (
    !record(value) ||
    value.schema !== "kronos-commerce" ||
    value.version !== COMMERCE_SCHEMA_VERSION ||
    !record(value.state)
  ) {
    return false;
  }

  const state = value.state;
  if (state.version !== COMMERCE_SCHEMA_VERSION || !record(state.cart)) return false;

  const cart = state.cart;
  const cartCurrency = cart.currency;
  if (!stringValue(cartCurrency) || !stringValue(cart.updatedAt)) return false;

  const cartItems = cart.items;
  if (!validCartItems(cartItems, cartCurrency)) return false;
  if (!hasUniqueValues(cartItems.map((item) => item.lineId))) return false;

  const wishlist = state.wishlist;
  if (!Array.isArray(wishlist) || !wishlist.every(validWishlistItem)) return false;

  const compare = state.compare;
  if (!Array.isArray(compare) || !compare.every(validCompareItem)) return false;

  const recentlyViewed = state.recentlyViewed;
  if (!Array.isArray(recentlyViewed) || !recentlyViewed.every(validRecentlyViewedItem)) {
    return false;
  }

  if (!validCoupon(state.coupon)) return false;
  if (state.checkoutDraft !== undefined && !validCheckoutDraft(state.checkoutDraft)) {
    return false;
  }

  return stringValue(state.updatedAt);
}

export function parsePersistedCommerce(input: string): PersistedCommerceEnvelopeV1 | null {
  let value: unknown;

  try {
    value = JSON.parse(input);
  } catch {
    return null;
  }

  return validPersistedEnvelope(value) ? value : null;
}

export type CommerceMigration = (legacy: unknown) => PersistedCommerceEnvelopeV1 | null;

export function migrateLegacyCommerce(
  legacyCart: unknown,
  legacyWishlist: unknown,
  now: ISODateTime,
): PersistedCommerceEnvelopeV1 | null {
  if (!Array.isArray(legacyCart) || !Array.isArray(legacyWishlist)) return null;

  // Numeric legacy IDs cannot safely resolve variants. Keep no guessed cart lines;
  // later integration may reconcile wishlist entries with catalog data.
  const wishlist: WishlistItem[] = legacyWishlist
    .filter((id): id is number => Number.isInteger(id))
    .map((id) => ({ productId: `legacy:${id}`, addedAt: now }));

  return {
    schema: "kronos-commerce",
    version: COMMERCE_SCHEMA_VERSION,
    state: {
      version: COMMERCE_SCHEMA_VERSION,
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
