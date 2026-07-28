/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCreditCard, FaMoneyBillWave, FaShoppingBag } from "react-icons/fa";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CheckoutPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const {
    cartItems,
    cartTotal,
    clearCart,
    appliedCoupon,
    discount,
    discountedTotal,
  } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Stripe">("COD");
  const [formData, setFormData] = useState({
    name: "",
    email: session?.user?.email || "",
    companyName: "",
    address: "",
    apartMentFloor: "",
    PhoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!formData.email) {
      toast.error("Email is required for checkout");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerDetail: {
            email: formData.email,
            name: formData.name,
            companyName: formData.companyName,
            address: formData.address,
            apartMentFloor: formData.apartMentFloor,
            PhoneNumber: formData.PhoneNumber,
          },
          cartData: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            title: item.title,
            price: item.discountedPrice || item.price,
            imageUrl: item.imageUrl,
            discountedPrice: item.discountedPrice,
          })),
          totalPrice: discountedTotal,
          discount,
          couponCode: appliedCoupon?.code || null,
          paymentMethod,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to place order");
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast.success("Order placed successfully!");
      clearCart();
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 card-modern p-10">
            <FaShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm mb-6">Add some products before checking out</p>
            <Link href="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Billing Details */}
              <div className="lg:col-span-2">
                <div className="card-modern p-6 lg:p-8">
                  <h2 className="text-xl font-bold mb-6">Billing Details</h2>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Full Name *</label>
                        <input
                          type="text"
                          className="input-modern"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Company Name</label>
                        <input
                          type="text"
                          className="input-modern"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Street Address *</label>
                      <input
                        type="text"
                        className="input-modern"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Apartment, floor, etc.</label>
                      <input
                        type="text"
                        className="input-modern"
                        value={formData.apartMentFloor}
                        onChange={(e) => setFormData({ ...formData, apartMentFloor: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number *</label>
                        <input
                          type="tel"
                          className="input-modern"
                          value={formData.PhoneNumber}
                          onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
                        <input
                          type="email"
                          className={cn("input-modern", session?.user?.email && "!bg-gray-50 !text-gray-500")}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!!session?.user?.email}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card-modern p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-5">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="truncate mr-2 text-gray-600">{item.title} x{item.quantity}</span>
                        <span className="font-medium">৳{(item.discountedPrice || item.price) * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
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

                  {/* Payment Method */}
                  <h3 className="font-bold mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    <label
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        paymentMethod === "COD"
                          ? "border-brand bg-brand/5 shadow-sm"
                          : "border-gray-100 hover:border-gray-200",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="accent-brand"
                      />
                      <FaMoneyBillWave className="text-green-600" />
                      <span className="text-sm font-medium">Cash on Delivery</span>
                    </label>
                    <label
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        paymentMethod === "Stripe"
                          ? "border-brand bg-brand/5 shadow-sm"
                          : "border-gray-100 hover:border-gray-200",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="Stripe"
                        checked={paymentMethod === "Stripe"}
                        onChange={() => setPaymentMethod("Stripe")}
                        className="accent-brand"
                      />
                      <FaCreditCard className="text-brand" />
                      <span className="text-sm font-medium">Stripe</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
