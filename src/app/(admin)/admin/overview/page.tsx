"use client";

import { useEffect, useState } from "react";
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";

interface Order {
  _id: string;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  customerDetail: { name: string; email: string };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.get<Order[]>("/orders/all").catch(() => []),
      adminApi.get<{ total: number }>("/products/count").catch(() => ({ total: 0 })),
      adminApi.get<any[]>("/users/").catch(() => []),
    ])
      .then(([orders, productCount, users]) => {
        const orderArray = Array.isArray(orders) ? orders : [];
        const revenue = orderArray
          .filter((o) => o.orderStatus === "completed")
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        setStats({
          totalRevenue: revenue,
          totalOrders: orderArray.length,
          totalProducts: typeof productCount === "object" ? (productCount as any).total || 0 : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
        });
        setRecentOrders(orderArray.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load dashboard stats");
        setLoading(false);
      });
  }, []);

  const cards = [
    { label: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, icon: FaDollarSign, color: "text-blue-600" },
    { label: "Total Orders", value: stats.totalOrders, icon: FaShoppingCart, color: "text-green-600" },
    { label: "Total Products", value: stats.totalProducts, icon: FaBox, color: "text-purple-600" },
    { label: "Total Users", value: stats.totalUsers, icon: FaUsers, color: "text-orange-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[rgb(219,68,68)]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="border rounded-lg p-5">
                  <div className="flex items-center gap-3">
                    <Icon className={`text-2xl ${card.color}`} />
                    <div>
                      <p className="text-sm text-gray-500">{card.label}</p>
                      <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{order.customerDetail?.name || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">৳{order.totalPrice}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        order.orderStatus === "completed" ? "bg-green-100 text-green-700" :
                        order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
