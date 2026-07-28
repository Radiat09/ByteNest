"use client";

import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { useCart } from "@/contexts/CartContext";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    appliedCoupon,
    discount,
    couponLoading,
    applyCoupon,
    clearCoupon,
    discountedTotal,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    await applyCoupon(couponCode.trim(), cartTotal);
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
    setCouponCode("");
  };

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 card-modern p-10">
            <FaShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm mb-6">Looks like you haven&apos;t added anything yet</p>
            <Link href="/products" className="btn-primary inline-block">
              Return To Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 card-modern">
                  {item.imageUrl?.[0] ? (
                    <img src={item.imageUrl[0]} alt={item.title} className="w-20 h-20 object-contain bg-gray-50 rounded-xl p-2 flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <p className="text-brand font-semibold text-sm mt-1">৳{item.discountedPrice || item.price}</p>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      className="px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                    <button
                      className="px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-sm">৳{(item.discountedPrice || item.price) * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors mt-1 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              <Link href="/products" className="btn-outline inline-block text-sm mt-4">
                Return To Shop
              </Link>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="card-modern p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-5">Cart Total</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">৳{cartTotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-৳{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand">৳{discountedTotal}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="input-modern flex-1 !py-2.5 !text-sm"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                  <button
                    onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                    disabled={couponLoading}
                    className="btn-primary !px-4 !py-2.5 !text-sm flex items-center gap-1 flex-shrink-0"
                  >
                    {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {appliedCoupon ? "Remove" : "Apply"}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Coupon &quot;{appliedCoupon.code}&quot; applied
                  </p>
                )}

                <Link
                  href="/checkout"
                  className="btn-primary block w-full text-center mt-6"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
