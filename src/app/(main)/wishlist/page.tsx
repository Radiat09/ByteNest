"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/ui/ProductCard";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function WishlistPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${API_URL}/wishlist`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setWishlistItems(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load wishlist");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleMoveAllToCart = () => {
    toast.success("All items moved to cart");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-[250px] rounded-lg"></div>
                <div className="mt-3 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Wishlist ({wishlistItems.length})</h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Move All To Cart
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
            <Link
              href="/products"
              className="inline-block bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Just For You */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-5 h-10 rounded-sm bg-[rgb(219,68,68)]"></span>
            <span className="text-sm font-semibold text-[rgb(219,68,68)]">Just For You</span>
          </div>
          <h2 className="text-2xl font-bold mb-8">Recommended Products</h2>
          <div className="text-center py-8 text-gray-500">
            <Link href="/products" className="text-[rgb(219,68,68)] hover:underline">
              Browse all products
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
