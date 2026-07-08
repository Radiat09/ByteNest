"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setCartTotal, setDiscount, setDiscountedCartTotal } from "@/redux/features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CartPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const dispatch = useAppDispatch();
  const { cartTotal, discount, discountedCartTotal } = useAppSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${API_URL}/cart`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setCartItems(Array.isArray(data) ? data : []);
          const total = (Array.isArray(data) ? data : []).reduce(
            (sum: number, item: any) => sum + (item.discountedPrice || item.price) * item.quantity,
            0
          );
          dispatch(setCartTotal(total));
          dispatch(setDiscountedCartTotal(total));
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load cart items");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session, dispatch]);

  const handleQuantityUpdate = async (id: string, quantity: number) => {
    try {
      await fetch(`${API_URL}/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.success("Coupon applied!");
      const discountAmount = cartTotal * 0.1;
      dispatch(setDiscount(discountAmount));
      dispatch(setDiscountedCartTotal(cartTotal - discountAmount));
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
            >
              Return To Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 font-medium">Product</th>
                    <th className="text-left py-4 font-medium">Price</th>
                    <th className="text-left py-4 font-medium">Quantity</th>
                    <th className="text-left py-4 font-medium">Subtotal</th>
                    <th className="py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrl?.[0] ? (
                            <img src={item.imageUrl[0]} alt={item.title} className="w-16 h-16 object-contain bg-[#F5F5F5] rounded p-1" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                          )}
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm">
                        ৳{item.discountedPrice || item.price}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center border rounded w-fit">
                          <button
                            className="px-3 py-1 hover:bg-gray-100"
                            onClick={() => handleQuantityUpdate(item._id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            className="px-3 py-1 hover:bg-gray-100"
                            onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 font-medium">
                        ৳{(item.discountedPrice || item.price) * item.quantity}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-6">
                <Link
                  href="/products"
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Return To Shop
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Cart Total</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
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
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>৳{discountedCartTotal}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgb(219,68,68)]"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[rgb(219,68,68)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[rgb(200,55,55)] transition-colors"
                  >
                    Apply
                  </button>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-[rgb(219,68,68)] text-white text-center py-3 rounded-lg font-medium mt-4 hover:bg-[rgb(200,55,55)] transition-colors"
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
