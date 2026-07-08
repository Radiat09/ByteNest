"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import {
  FaTachometerAlt,
  FaBox,
  FaList,
  FaTags,
  FaUsers,
  FaUserFriends,
  FaShoppingCart,
  FaBolt,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

const sidebarGroups = [
  {
    title: "Overview",
    items: [
      { href: "/admin/overview", label: "Overview", icon: FaTachometerAlt },
    ],
  },
  {
    title: "Product Management",
    items: [
      { href: "/admin/products/new", label: "Add Product", icon: FaBox },
      { href: "/admin/products/bestsellings", label: "Best Selling", icon: FaStar },
      { href: "/admin/flash-sales", label: "Flash Sale", icon: FaBolt },
    ],
  },
  {
    title: "Category & Coupon",
    items: [
      { href: "/admin/categories", label: "Manage Category", icon: FaList },
      { href: "/admin/coupons", label: "Manage Coupon", icon: FaTags },
    ],
  },
  {
    title: "User Management",
    items: [
      { href: "/admin/users", label: "Site Users List", icon: FaUsers },
      { href: "/admin/customers", label: "Customers List", icon: FaUserFriends },
    ],
  },
  {
    title: "Order Management",
    items: [
      { href: "/admin/orders", label: "All Orders", icon: FaShoppingCart },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <IoClose className="text-2xl" /> : <HiMenuAlt2 className="text-2xl" />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className={cn(
          "w-full lg:w-64 shrink-0",
          sidebarOpen ? "block" : "hidden lg:block"
        )}>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4 hidden lg:block">Admin Panel</h2>
            <nav className="space-y-4">
              {sidebarGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "bg-[rgb(219,68,68)] text-white"
                              : "hover:bg-gray-100"
                          )}
                        >
                          <Icon className="text-base" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="border-t pt-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <FaArrowLeft className="text-base" />
                  Back to Shop
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
