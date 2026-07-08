"use client";

import Link from "next/link";
import { FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    discountedPrice?: number | null;
    imageUrl: string[];
    category: string;
    sellCount: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success("Added to cart");
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success("Added to wishlist");
  };

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-[#F5F5F5] rounded-lg overflow-hidden relative">
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[rgb(219,68,68)] text-white text-xs px-2 py-1 rounded z-10">
            -{discount}%
          </span>
        )}

        {/* Image */}
        <div className="p-6 h-[250px] flex items-center justify-center">
          {product.imageUrl?.[0] ? (
            <img
              src={product.imageUrl[0]}
              alt={product.title}
              className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-400 text-sm">No Image</div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-start justify-end p-3 gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToWishlist}
            className="bg-white rounded-full p-2 shadow-md hover:bg-[rgb(219,68,68)] hover:text-white transition-colors"
          >
            <FaHeart className="text-sm" />
          </button>
          <Link
            href={`/products/${product._id}`}
            className="bg-white rounded-full p-2 shadow-md hover:bg-[rgb(219,68,68)] hover:text-white transition-colors"
          >
            <FaEye className="text-sm" />
          </Link>
        </div>

        {/* Add to Cart Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0 cursor-pointer">
          <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 w-full text-sm font-medium">
            <FaShoppingCart className="text-sm" />
            Add To Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-800 truncate">{product.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {product.discountedPrice ? (
            <>
              <span className="text-[rgb(219,68,68)] font-semibold">৳{product.discountedPrice}</span>
              <span className="text-gray-400 line-through text-sm">৳{product.price}</span>
            </>
          ) : (
            <span className="text-[rgb(219,68,68)] font-semibold">৳{product.price}</span>
          )}
        </div>
        {product.sellCount > 0 && (
          <p className="text-xs text-gray-400 mt-1">({product.sellCount} sold)</p>
        )}
      </div>
    </Link>
  );
}
