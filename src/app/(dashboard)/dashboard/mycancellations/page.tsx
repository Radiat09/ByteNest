"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function MyCancellationsPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${API_URL}/cancelledOrder`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load cancellations");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Cancellations</h1>
        <div className="space-y-4">
          {[1, 2].map((i) => (
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
      <h1 className="text-2xl font-bold mb-6">My Cancellations</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No cancelled orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4">
              <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total: ৳{order.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
