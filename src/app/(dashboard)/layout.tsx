"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaUser, FaShoppingBag, FaBan, FaArrowLeft } from "react-icons/fa";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/myaccount", label: "My Account", icon: FaUser },
  { href: "/dashboard/myorders", label: "My Orders", icon: FaShoppingBag },
  { href: "/dashboard/mycancellations", label: "My Cancellations", icon: FaBan },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
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
            <h2 className="text-lg font-bold mb-4 hidden lg:block">Dashboard</h2>
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-[rgb(219,68,68)] text-white"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <Icon className="text-lg" />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft className="text-lg" />
                Back to Shop
              </Link>
            </nav>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
