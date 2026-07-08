"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaHome, FaThLarge, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: FaHome, label: "Home" },
  { href: "/products", icon: FaThLarge, label: "Products" },
  { href: "/wishlist", icon: FaHeart, label: "Wishlist" },
  { href: "/cart", icon: FaShoppingCart, label: "Cart" },
  { href: "/dashboard/myaccount", icon: FaUser, label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const needsAuth = ["/wishlist", "/cart", "/dashboard/myaccount"].includes(item.href);

          if (needsAuth && !session) {
            return (
              <Link
                key={item.href}
                href="/login"
                className="flex flex-col items-center gap-1 text-gray-500 py-1 px-3"
              >
                <Icon className="text-lg" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 transition-colors relative",
                isActive ? "text-[rgb(219,68,68)]" : "text-gray-500"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[rgb(219,68,68)] rounded-full" />
              )}
              <Icon className="text-lg" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
