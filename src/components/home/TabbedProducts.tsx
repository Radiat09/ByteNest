"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product, Category } from "./types";

function GridCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.has(product._id);
  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative bg-[#F5F5F5] aspect-square w-full overflow-hidden">
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-2.5 py-1 rounded-lg z-10">
              -{discount}%
            </span>
          )}
          <span className="absolute top-3 right-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase z-10">
            New
          </span>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
            className={`absolute bottom-3 right-3 rounded-full p-2 transition-all z-10 ${
              isWishlisted
                ? "bg-brand text-white"
                : "bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-brand hover:text-white"
            }`}
          >
            <FaHeart className="text-xs" />
          </button>
          {product.imageUrl?.[0] ? (
            <Image
              src={product.imageUrl[0]}
              alt={product.title}
              width={400}
              height={400}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 text-sm">No Image</div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                _id: product._id,
                productId: product._id,
                title: product.title,
                price: product.price,
                discountedPrice: product.discountedPrice,
                imageUrl: product.imageUrl,
                category: product.category,
              });
            }}
            className="absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-2.5 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0 flex items-center justify-center gap-2"
          >
            <FaShoppingCart className="text-xs" />
            Add To Cart
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 truncate">{product.title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            {product.discountedPrice ? (
              <>
                <span className="text-brand font-bold">৳{product.discountedPrice}</span>
                <span className="text-gray-400 line-through text-xs">৳{product.price}</span>
              </>
            ) : (
              <span className="text-brand font-bold">৳{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function TabbedProducts({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const tabs = ["All", ...categories.map((c) => c.title)];
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <span className="text-brand text-sm font-semibold">Best Selling</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
          Shop By Category
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-brand text-white shadow-lg shadow-brand/25"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 8).map((product) => (
            <GridCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/products"
          className="inline-block border-2 border-brand text-brand px-10 py-3.5 rounded-xl font-semibold hover:bg-brand hover:text-white transition-colors"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
