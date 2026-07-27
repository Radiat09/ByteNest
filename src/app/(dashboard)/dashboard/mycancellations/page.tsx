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
      fetch(`${API_URL}/orders/cancelled`, { credentials: "include" })
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
      <h1 className="text-2xl font-bold mb-6">My Cancellations</h1>
      {orders.length === 0 ? (
        <div className="card-modern p-10 text-center">
          <p className="text-gray-500 text-lg mb-2">No cancelled orders</p>
          <p className="text-gray-400 text-sm">You&apos;re all good - no cancelled orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card-modern p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700">
                  Cancelled
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-3">Total: ৳{order.totalPrice?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
