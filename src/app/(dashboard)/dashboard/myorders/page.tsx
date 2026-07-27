"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useJwtSynced } from "@/components/Providers";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const { synced } = useJwtSynced();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !synced || !session?.user?.email) return;

    let cancelled = false;

    fetch(`${API_URL}/orders`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load orders");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [session?.user?.email, status, synced]);

  if (status === "loading" || !synced || loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse card-modern p-5">
              <div className="bg-gray-200 h-4 rounded-lg w-1/3 mb-3"></div>
              <div className="bg-gray-200 h-4 rounded-lg w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="card-modern p-10 text-center">
          <p className="text-gray-500 text-lg mb-2">No orders found</p>
          <p className="text-gray-400 text-sm">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card-modern p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} &bull; {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  order.orderStatus === "completed"
                    ? "bg-green-50 text-green-700"
                    : order.orderStatus === "cancelled"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(order.cartData || []).map((item: any, idx: number) => {
                    const product = item.productId;
                    const image = product?.imageUrl?.[0] || product?.image?.[0] || "/placeholder.png";
                    const title = product?.title || item?.title || "Product";
                    const price = product?.discountedPrice || product?.price || item?.price || item?.discountedPrice;
                    const quantity = item?.quantity || 1;
                    const lineTotal = (price || 0) * quantity;

                    return (
                      <div key={`${idx}-${product?._id || item._id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg relative bg-white">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{title}</p>
                          <p className="text-xs text-gray-500">Qty: {quantity}</p>
                          <p className="text-sm font-semibold text-brand">৳{price?.toLocaleString()}</p>
                        </div>
                        <p className="text-right text-sm font-medium text-gray-700 whitespace-nowrap">
                          ৳{lineTotal?.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Total: <span className="font-bold text-brand">৳{order.totalPrice?.toLocaleString()}</span></p>
                  <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                  {order.discount && <p>Discount: {order.discount}%</p>}
                </div>
                <div className="text-sm text-gray-500">
                  Customer: {order.customerDetail?.name} ({order.customerDetail?.email})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
