"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useJwtSynced } from "@/components/Providers";

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
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="bg-gray-200 h-4 rounded w-1/3 mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-1/4"></div>
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
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  order.orderStatus === "completed"
                    ? "bg-green-100 text-green-700"
                    : order.orderStatus === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Total: ৳{order.totalPrice}</p>
                <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
