"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CartSliderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSlider({ open, onOpenChange }: CartSliderProps) {
  const router = useRouter();
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: couponCode.trim(), orderTotal: cartTotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid coupon");
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }
      const pct = data.data.discountPercent;
      const discountAmount = cartTotal * (pct / 100);
      setDiscount(discountAmount);
      setAppliedCoupon(data.data.code);
      toast.success(`Coupon applied: ${pct}% off`);
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const discountedTotal = cartTotal - discount;

  const handleCheckout = () => {
    onOpenChange(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    onOpenChange(false);
    router.push("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-gray-100">
          <SheetTitle className="text-base font-semibold">
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 h-3 rounded-lg w-2/3" />
                    <div className="bg-gray-200 h-3 rounded-lg w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FaShoppingBag className="text-4xl text-gray-200 mb-3" />
              <p className="text-gray-500 text-sm mb-1">Your cart is empty</p>
              <p className="text-gray-400 text-xs mb-4">
                Looks like you haven&apos;t added anything yet
              </p>
              <Button
                onClick={handleViewCart}
                className="w-full"
                variant="outline"
              >
                Return To Shop
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 bg-gray-50/60 rounded-2xl"
                >
                  {item.imageUrl?.[0] ? (
                    <img
                      src={item.imageUrl[0]}
                      alt={item.title}
                      className="w-14 h-14 object-contain bg-white rounded-xl p-1.5 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs truncate">{item.title}</h3>
                    <p className="text-brand font-semibold text-xs mt-0.5">
                      ৳{item.discountedPrice || item.price}
                    </p>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="px-2 py-1 hover:bg-gray-100 transition-colors text-xs"
                      onClick={() =>
                        updateQuantity(item._id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-xs font-medium border-x border-gray-200 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="px-2 py-1 hover:bg-gray-100 transition-colors text-xs"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-xs flex-shrink-0"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <Link
                href="/products"
                onClick={handleViewCart}
                className="block text-center text-xs text-brand font-medium hover:underline"
              >
                Return To Shop
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="p-4 border-t border-gray-100 flex-col gap-3">
            <div className="space-y-2 w-full">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">৳{cartTotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-৳{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm">
                <span>Total</span>
                <span className="text-brand">৳{discountedTotal}</span>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <input
                type="text"
                placeholder="Coupon"
                className="input-modern flex-1 !py-2 !text-xs"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!appliedCoupon}
              />
              <Button
                onClick={
                  appliedCoupon
                    ? () => {
                        setDiscount(0);
                        setAppliedCoupon(null);
                        setCouponCode("");
                      }
                    : handleApplyCoupon
                }
                disabled={couponLoading}
                size="sm"
                variant="outline"
                className="!px-3"
              >
                {couponLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : appliedCoupon ? (
                  "Remove"
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {appliedCoupon && (
              <p className="text-[11px] text-green-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full" />
                Coupon &quot;{appliedCoupon}&quot; applied
              </p>
            )}

            <div className="flex gap-2 w-full">
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="flex-1 !text-xs"
              >
                View Cart
              </Button>
              <Button onClick={handleCheckout} className="flex-1 !text-xs">
                Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
