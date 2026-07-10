"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CheckoutPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const { cartItems, cartTotal, clearCart } = useCart();
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

  const discount = 0;
  const discountedTotal = cartTotal - discount;

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
          paymentMethod,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to place order");
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
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <a
              href="/products"
              className="inline-block bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Billing Details */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-6">Billing Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Company Name</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address *</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apartment, floor, etc.</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                      value={formData.apartMentFloor}
                      onChange={(e) => setFormData({ ...formData, apartMentFloor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                      value={formData.PhoneNumber}
                      onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      className={cn(
                        "w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors",
                        session?.user?.email && "bg-gray-50"
                      )}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!!session?.user?.email}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="truncate mr-2">{item.title} x{item.quantity}</span>
                        <span>৳{(item.discountedPrice || item.price) * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t pt-3 flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>৳{cartTotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-৳{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>৳{discountedTotal}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <h3 className="font-bold mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    <label
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                        paymentMethod === "COD" ? "border-[rgb(219,68,68)] bg-[rgb(219,68,68)]/5" : "hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="accent-[rgb(219,68,68)]"
                      />
                      <FaMoneyBillWave className="text-green-600" />
                      <span className="text-sm font-medium">Cash on Delivery</span>
                    </label>
                    <label
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                        paymentMethod === "Stripe" ? "border-[rgb(219,68,68)] bg-[rgb(219,68,68)]/5" : "hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="Stripe"
                        checked={paymentMethod === "Stripe"}
                        onChange={() => setPaymentMethod("Stripe")}
                        className="accent-[rgb(219,68,68)]"
                      />
                      <FaCreditCard className="text-blue-600" />
                      <span className="text-sm font-medium">Stripe</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[rgb(219,68,68)] text-white py-3 rounded-lg font-medium mt-6 hover:bg-[rgb(200,55,55)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
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
