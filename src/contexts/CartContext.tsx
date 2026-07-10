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

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (
    product: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCartItems(getLocalCart());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveLocalCart(cartItems);
    }
  }, [cartItems, loading]);

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
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0,
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
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
