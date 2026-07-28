"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

const CART_STORAGE_KEY = "bikroy_guest_cart";

export interface CartItem {
  _id: string;
  productId: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  imageUrl: string[];
  quantity: number;
  category?: string;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  discount: number;
  couponLoading: boolean;
  applyCoupon: (code: string, orderTotal: number) => Promise<void>;
  clearCoupon: () => void;
  discountedTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getLocalCart());
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    saveLocalCart(cartItems);
  }, [cartItems]);

  const addToCart = useCallback(
    (product: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = product.quantity || 1;
      let alreadyInCart = false;
      setCartItems((prev) => {
        const existing = prev.find((i) => i.productId === product.productId);
        if (existing) {
          alreadyInCart = true;
          return prev.map((i) =>
            i.productId === product.productId
              ? { ...i, quantity: i.quantity + qty }
              : i,
          );
        }
        return [...prev, { ...product, quantity: qty }];
      });
      toast.success(alreadyInCart ? "Cart updated" : "Added to cart");
    },
    [],
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
    toast.success("Item removed");
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    setAppliedCoupon(null);
    setDiscount(0);
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0,
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const discountedTotal = cartTotal - discount;

  const applyCoupon = useCallback(async (code: string, orderTotal: number) => {
    setCouponLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/coupons/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code, orderTotal }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid coupon");
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }
      const pct = data.data.discountPercent;
      const discountAmount = orderTotal * (pct / 100);
      setDiscount(discountAmount);
      setAppliedCoupon({ code: data.data.code, discountPercent: pct });
      toast.success(`Coupon applied: ${pct}% off`);
    } catch {
      toast.error("Failed to validate coupon");
      setDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }, []);

  const clearCoupon = useCallback(() => {
    setDiscount(0);
    setAppliedCoupon(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        appliedCoupon,
        discount,
        couponLoading,
        applyCoupon,
        clearCoupon,
        discountedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
