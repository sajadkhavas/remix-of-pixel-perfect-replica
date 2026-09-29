import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import {
  COMMERCE_SCHEMA_VERSION,
  COMMERCE_STORAGE_KEY,
  clampQuantity,
  makeLineId,
  parsePersistedCommerce,
  type CommerceStateV1,
  type PersistedCommerceEnvelopeV1,
} from "@/domain/commerce";
import type { Money } from "@/domain/shared";

export interface AddToCartInput {
  readonly productId: string;
  readonly variantId: string;
  readonly productSlug: string;
  readonly name: string;
  readonly variantLabel?: string;
  readonly sku: string;
  readonly imageUrl?: string;
  readonly unitPrice: Money;
  readonly quantity?: number;
  readonly minQuantity: number;
  readonly maxQuantity?: number;
  readonly increment: number;
  readonly availableQuantity?: number;
}

interface StoreCtx {
  readonly commerce: CommerceStateV1;
  readonly cart: CommerceStateV1["cart"];
  readonly wishlist: CommerceStateV1["wishlist"];
  readonly hydrated: boolean;
  readonly addToCart: (input: AddToCartInput) => void;
  readonly removeFromCart: (lineId: string) => void;
  readonly setQty: (
    lineId: string,
    quantity: number,
  ) => void;
  readonly clearCart: () => void;
  readonly toggleWishlist: (
    productId: string,
    preferredVariantId?: string,
  ) => void;
  readonly isWishlisted: (
    productId: string,
  ) => boolean;
}

const Ctx = createContext<StoreCtx | null>(null);

const nowIso = () => new Date().toISOString();

function createEmptyState(): CommerceStateV1 {
  const now = nowIso();

  return {
    version: COMMERCE_SCHEMA_VERSION,
    cart: {
      items: [],
      currency: "USD",
      updatedAt: now,
    },
    wishlist: [],
    compare: [],
    recentlyViewed: [],
    coupon: { status: "empty" },
    updatedAt: now,
  };
}

function readStoredState(): CommerceStateV1 | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(
      COMMERCE_STORAGE_KEY,
    );

    if (!raw) return null;

    return parsePersistedCommerce(raw)?.state ?? null;
  } catch {
    return null;
  }
}

export function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [commerce, setCommerce] =
    useState<CommerceStateV1>(() =>
      createEmptyState(),
    );

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    const stored = readStoredState();

    if (stored) {
      setCommerce(stored);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (
      !hydrated ||
      typeof window === "undefined"
    ) {
      return;
    }

    const envelope: PersistedCommerceEnvelopeV1 = {
      schema: "kronos-commerce",
      version: COMMERCE_SCHEMA_VERSION,
      state: commerce,
    };

    try {
      window.localStorage.setItem(
        COMMERCE_STORAGE_KEY,
        JSON.stringify(envelope),
      );
    } catch {
      // Keep the in-memory store available.
    }
  }, [commerce, hydrated]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const onStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key !== COMMERCE_STORAGE_KEY ||
        !event.newValue
      ) {
        return;
      }

      const parsed =
        parsePersistedCommerce(
          event.newValue,
        );

      if (parsed) {
        setCommerce(parsed.state);
      }
    };

    window.addEventListener(
      "storage",
      onStorage,
    );

    return () =>
      window.removeEventListener(
        "storage",
        onStorage,
      );
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      commerce,
      cart: commerce.cart,
      wishlist: commerce.wishlist,
      hydrated,

      addToCart: (input) => {
        const rule = {
          min: input.minQuantity,
          max: input.maxQuantity,
          increment: input.increment,
        };

        const lineId = makeLineId(
          input.productId,
          input.variantId,
        );

        const existing =
          commerce.cart.items.find(
            (item) =>
              item.lineId === lineId,
          );

        if (
          commerce.cart.items.length > 0 &&
          commerce.cart.currency !==
            input.unitPrice.currency
        ) {
          toast.error(
            "واحد پول این محصول با سبد فعلی هماهنگ نیست",
          );
          return;
        }

        const requested =
          (existing?.quantity ?? 0) +
          (input.quantity ??
            input.minQuantity);

        const quantity =
          clampQuantity(
            requested,
            rule,
            input.availableQuantity,
          );

        if (
          quantity < input.minQuantity
        ) {
          toast.error(
            "این محصول در حال حاضر موجود نیست",
          );
          return;
        }

        setCommerce((current) => {
          const now = nowIso();

          const currentExisting =
            current.cart.items.find(
              (item) =>
                item.lineId === lineId,
            );

          const nextItem = {
            lineId,
            productId: input.productId,
            variantId: input.variantId,
            quantity,
            unitPriceSnapshot:
              input.unitPrice,
            productSnapshot: {
              productId:
                input.productId,
              variantId:
                input.variantId,
              productSlug:
                input.productSlug,
              name: input.name,
              variantLabel:
                input.variantLabel,
              sku: input.sku,
              imageUrl:
                input.imageUrl,
            },
            addedAt:
              currentExisting?.addedAt ??
              now,
            updatedAt: now,
          };

          const items = currentExisting
            ? current.cart.items.map(
                (item) =>
                  item.lineId ===
                  lineId
                    ? nextItem
                    : item,
              )
            : [
                ...current.cart.items,
                nextItem,
              ];

          return {
            ...current,
            cart: {
              items,
              currency:
                input.unitPrice.currency,
              updatedAt: now,
            },
            updatedAt: now,
          };
        });

        toast.success(
          "به سبد خرید اضافه شد",
        );
      },

      removeFromCart: (lineId) => {
        setCommerce((current) => {
          const now = nowIso();

          return {
            ...current,
            cart: {
              ...current.cart,
              items:
                current.cart.items.filter(
                  (item) =>
                    item.lineId !==
                    lineId,
                ),
              updatedAt: now,
            },
            updatedAt: now,
          };
        });
      },

      setQty: (
        lineId,
        requestedQuantity,
      ) => {
        setCommerce((current) => {
          const line =
            current.cart.items.find(
              (item) =>
                item.lineId === lineId,
            );

          if (!line) {
            return current;
          }

          const quantity = Math.max(
            0,
            Math.trunc(
              requestedQuantity,
            ),
          );

          const now = nowIso();

          if (quantity <= 0) {
            return {
              ...current,
              cart: {
                ...current.cart,
                items:
                  current.cart.items.filter(
                    (item) =>
                      item.lineId !==
                      lineId,
                  ),
                updatedAt: now,
              },
              updatedAt: now,
            };
          }

          return {
            ...current,
            cart: {
              ...current.cart,
              items:
                current.cart.items.map(
                  (item) =>
                    item.lineId ===
                    lineId
                      ? {
                          ...item,
                          quantity,
                          updatedAt:
                            now,
                        }
                      : item,
                ),
              updatedAt: now,
            },
            updatedAt: now,
          };
        });
      },

      clearCart: () => {
        setCommerce((current) => {
          const now = nowIso();

          return {
            ...current,
            cart: {
              ...current.cart,
              items: [],
              updatedAt: now,
            },
            updatedAt: now,
          };
        });
      },

      toggleWishlist: (
        productId,
        preferredVariantId,
      ) => {
        const currentlySaved =
          commerce.wishlist.some(
            (item) =>
              item.productId ===
              productId,
          );

        setCommerce((current) => {
          const now = nowIso();

          const exists =
            current.wishlist.some(
              (item) =>
                item.productId ===
                productId,
            );

          return {
            ...current,
            wishlist: exists
              ? current.wishlist.filter(
                  (item) =>
                    item.productId !==
                    productId,
                )
              : [
                  ...current.wishlist,
                  {
                    productId,
                    preferredVariantId,
                    addedAt: now,
                  },
                ],
            updatedAt: now,
          };
        });

        toast.success(
          currentlySaved
            ? "از علاقه‌مندی‌ها حذف شد"
            : "به علاقه‌مندی‌ها اضافه شد",
        );
      },

      isWishlisted: (productId) =>
        commerce.wishlist.some(
          (item) =>
            item.productId ===
            productId,
        ),
    }),
    [commerce, hydrated],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const value = useContext(Ctx);

  if (!value) {
    throw new Error(
      "useStore must be used inside StoreProvider",
    );
  }

  return value;
}
