"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setSearchText, setCategories } from "@/redux/features/filter/filterSlice";
import { useState } from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { cn } from "@/lib/utils";

export default function Nav() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "All Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      dispatch(setSearchText(searchValue));
      dispatch(setCategories(""));
      router.push("/products");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto lg:px-10">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[rgb(219,68,68)]">
            ByteNest
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium hover:text-[rgb(219,68,68)] transition-colors",
                  pathname === link.href
                    ? "text-[rgb(219,68,68)] border-b-2 border-[rgb(219,68,68)] pb-1"
                    : "text-gray-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-[rgb(245,245,245)] rounded-lg px-4 py-2 pl-10 text-sm w-64 outline-none focus:ring-2 focus:ring-[rgb(219,68,68)]/30"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </form>

            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/wishlist" className="relative text-gray-700 hover:text-[rgb(219,68,68)] transition-colors">
                  <FaHeart className="text-xl" />
                </Link>
                <Link href="/cart" className="relative text-gray-700 hover:text-[rgb(219,68,68)] transition-colors">
                  <FaShoppingCart className="text-xl" />
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-[rgb(219,68,68)] transition-colors">
                    <FaUser className="text-xl" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium">{session.user?.name || session.user?.email}</p>
                      <p className="text-xs text-gray-500">{session.user?.role}</p>
                    </div>
                    <div className="py-1">
                      {session.user?.role === "admin" && (
                        <Link href="/admin/overview" className="block px-4 py-2 text-sm hover:bg-gray-50">
                          Admin Dashboard
                        </Link>
                      )}
                      <Link href="/dashboard/myaccount" className="block px-4 py-2 text-sm hover:bg-gray-50">
                        My Account
                      </Link>
                      <Link href="/dashboard/myorders" className="block px-4 py-2 text-sm hover:bg-gray-50">
                        My Orders
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[rgb(219,68,68)] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[rgb(200,55,55)] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center justify-between py-3 px-4">
          <Link href="/" className="text-lg font-bold text-[rgb(219,68,68)]">
            ByteNest
          </Link>
          <div className="flex items-center gap-4">
            {session && (
              <>
                <Link href="/wishlist" className="text-gray-700">
                  <FaHeart className="text-lg" />
                </Link>
                <Link href="/cart" className="text-gray-700">
                  <FaShoppingCart className="text-lg" />
                </Link>
              </>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <IoClose className="text-2xl" /> : <HiMenuAlt2 className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-[rgb(245,245,245)] rounded-lg px-4 py-2 pl-10 text-sm w-full outline-none"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium",
                  pathname === link.href ? "text-[rgb(219,68,68)]" : "text-gray-700"
                )}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/dashboard/myaccount" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm">
                  My Account
                </Link>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="block py-2 text-sm text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[rgb(219,68,68)]"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
