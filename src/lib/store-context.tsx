import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem { id: number; qty: number }

interface StoreCtx {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
}

const Ctx = createContext<StoreCtx | null>(null);

function read<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fb; } catch { return fb; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartItem[]>("kronos_cart", []));
    setWishlist(read<number[]>("kronos_wishlist", []));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("kronos_cart", JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("kronos_wishlist", JSON.stringify(wishlist)); }, [wishlist, hydrated]);

  const value: StoreCtx = {
    cart, wishlist,
    addToCart: (id) => {
      setCart((prev) => {
        const ex = prev.find((i) => i.id === id);
        return ex ? prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { id, qty: 1 }];
      });
      toast.success("به سبد خرید اضافه شد");
    },
    removeFromCart: (id) => setCart((p) => p.filter((i) => i.id !== id)),
    setQty: (id, qty) => setCart((p) => qty <= 0 ? p.filter((i) => i.id !== id) : p.map((i) => i.id === id ? { ...i, qty } : i)),
    clearCart: () => setCart([]),
    toggleWishlist: (id) => {
      setWishlist((p) => {
        const has = p.includes(id);
        toast.success(has ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
        return has ? p.filter((x) => x !== id) : [...p, id];
      });
    },
    isWishlisted: (id) => wishlist.includes(id),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
