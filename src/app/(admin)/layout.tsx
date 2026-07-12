"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
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
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const isAdmin = (session?.user as any)?.role === "admin";

  if (!session?.user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-500">You do not have admin privileges.</p>
        <Link href="/" className="text-[rgb(219,68,68)] hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

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
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 mb-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[rgb(219,68,68)] text-white flex items-center justify-center text-sm font-bold">
                {session.user.name?.[0] || session.user.email?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user.name || "Admin"}</p>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
              </div>
            </div>
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
              <div className="border-t pt-2 space-y-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                >
                  <FiLogOut className="text-base" />
                  Logout
                </button>
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
