"use client";

import { useEffect, useState } from "react";
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/revenue`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_URL}/allOrders`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_URL}/product/count`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_URL}/user/count`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([revenue, orders, productCount, userCount]) => {
        setStats({
          totalRevenue: revenue.total || 0,
          totalOrders: orders.length || 0,
          totalProducts: productCount.total || 0,
          totalUsers: userCount.total || 0,
        });
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
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            <p className="text-gray-500 text-sm">Dashboard charts coming soon.</p>
          </div>
        </>
      )}
    </div>
  );
}
