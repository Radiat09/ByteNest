"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/ui/ProductCard";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function WishlistPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${API_URL}/wishlist`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
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
    wishlistItems.forEach((product) => {
      addToCart({
        _id: product._id,
        productId: product._id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        imageUrl: product.imageUrl,
        category: product.category,
      });
    });
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
                <div className="bg-gray-200 h-[250px] rounded-2xl"></div>
                <div className="mt-3 space-y-2">
                  <div className="bg-gray-200 h-4 rounded-lg w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded-lg w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return (
      <MainLayout>
        <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
          <div className="text-center py-20 card-modern p-10">
            <FaHeart className="text-6xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Sign in to view your wishlist</p>
            <p className="text-gray-400 text-sm mb-6">Save your favorite items for later</p>
            <Link href="/login" className="btn-primary inline-block">
              Sign In
            </Link>
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
            <button onClick={handleMoveAllToCart} className="btn-outline text-sm">
              Move All To Cart
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 card-modern p-10">
            <FaHeart className="text-6xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mb-6">Browse products and save your favorites</p>
            <Link href="/products" className="btn-primary inline-block">
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
          <span className="section-heading block mb-2">Just For You</span>
          <h2 className="text-2xl font-bold mb-8">Recommended Products</h2>
          <div className="text-center py-8 text-gray-500">
            <Link href="/products" className="text-brand hover:underline font-medium">
              Browse all products
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
