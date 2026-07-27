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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 glass border-t border-gray-100/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const needsAuth = ["/wishlist", "/cart", "/dashboard/myaccount"].includes(item.href);

          if (needsAuth && !session) {
            return (
              <Link
                key={item.href}
                href="/login"
                className="flex flex-col items-center gap-1 text-gray-400 py-2 px-3 rounded-xl transition-colors"
              >
                <Icon className="text-lg" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 relative",
                isActive ? "text-brand" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand rounded-full" />
              )}
              <Icon className={cn("text-lg transition-all", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
