"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Nav() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "All Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];

  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => { setMounted(true); }, []);

  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`${API_URL}/products/suggestions?searchText=${encodeURIComponent(text)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchValue);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?searchText=${encodeURIComponent(searchValue.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title: string) => {
    setSearchValue(title);
    setShowSuggestions(false);
    router.push(`/products?searchText=${encodeURIComponent(title)}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 glass border-b border-gray-100/80 shadow-[var(--shadow-modern)]">
      <div className="max-w-screen-2xl mx-auto lg:px-10">
         {/* Desktop Nav */}
         <div className="hidden lg:flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-brand tracking-tight">
            ByteNest
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-brand relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-brand after:rounded-full"
                    : "text-gray-600 hover:text-brand"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-5">
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-gray-50 rounded-xl px-4 py-2.5 pl-10 text-sm w-64 outline-none border border-gray-100 focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all duration-200"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                />
                <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-xs" />
              </form>
              {showSuggestions && searchValue.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[var(--shadow-elevated)] border border-gray-100 z-50 max-h-80 overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="p-4 text-sm text-gray-500 text-center">Searching...</div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.map((item: any) => (
                        <button
                          key={item._id}
                          onClick={() => handleSuggestionClick(item.title)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          {item.imageUrl?.[0] ? (
                            <img src={item.imageUrl[0]} alt={item.title} className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No img</div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 text-sm text-brand font-medium hover:bg-gray-50 text-left border-t border-gray-100 rounded-b-2xl"
                      >
                        Search for &quot;{searchValue}&quot;
                      </button>
                    </>
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">No suggestions found</div>
                  )}
                </div>
              )}
            </div>

            <Link href="/wishlist" className="relative text-gray-600 hover:text-brand transition-all duration-200 p-2 rounded-xl hover:bg-brand/5">
              <FaHeart className="text-lg" />
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-brand transition-all duration-200 p-2 rounded-xl hover:bg-brand/5">
              <FaShoppingCart className="text-lg" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {session ? (
              <div className="relative group">
                <button className="text-gray-600 hover:text-brand transition-all duration-200 p-2 rounded-xl hover:bg-brand/5">
                  <FaUser className="text-lg" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[var(--shadow-elevated)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-semibold truncate">{session.user?.name || session.user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{session.user?.role}</p>
                  </div>
                  <div className="py-1.5">
                    {session.user?.role === "admin" && (
                      <Link href="/admin/overview" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link href="/dashboard/myaccount" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                      My Account
                    </Link>
                    <Link href="/dashboard/myorders" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                      My Orders
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm px-5 py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>

         {/* Mobile Nav */}
         <div className="lg:hidden flex items-center justify-between py-3 px-4">
          <Link href="/" className="text-lg font-bold text-brand tracking-tight">
            ByteNest
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/wishlist" className="relative text-gray-600 p-2 rounded-xl">
              <FaHeart className="text-lg" />
            </Link>
            <Link href="/cart" className="relative text-gray-600 p-2 rounded-xl">
              <FaShoppingCart className="text-lg" />
              {mounted && cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl">
              {mobileMenuOpen ? <IoClose className="text-xl" /> : <HiMenuAlt2 className="text-xl" />}
            </button>
          </div>
        </div>

         {/* Mobile Menu Dropdown */}
         {mobileMenuOpen && (
           <div className="lg:hidden border-t border-gray-100 bg-white/95 glass px-4 py-4 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                placeholder="Search products..."
                className="input-modern pl-10 w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-3 px-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href ? "text-brand bg-brand/5" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2">
              {session ? (
                <>
                  <Link href="/dashboard/myaccount" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    My Account
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="block py-3 px-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-3 rounded-xl text-sm font-medium text-brand hover:bg-brand/5 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
