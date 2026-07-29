"use client";

import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";
import AuthModal from "./AuthModal";

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    discountedPrice?: number | null;
    imageUrl: string[];
    category: string;
    sellCount: number;
    mostPopular?: boolean;
  };
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist, authModalOpen, setAuthModalOpen } =
    useWishlist();
  const isWishlisted = wishlistIds.has(product._id);
  const discount = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
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
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <>
      <Link
        href={`/products/${product._id}`}
        className="group block relative z-0 hover:z-10"
      >
        <div className="bg-gray-50 rounded-2xl relative shadow-[var(--shadow-card)] transition-all duration-300 group-hover:shadow-[var(--shadow-card-hover)] group-hover:-translate-y-1">
          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-brand text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg z-20">
              -{discount}%
            </span>
          )}

          {/* Most Popular Badge */}
          {product.mostPopular && (
            <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg z-20">
              Most Popular
            </span>
          )}

          {/* Image */}
          <div className="aspect-square w-full bg-gray-50 overflow-hidden rounded-t-2xl">
            {product?.imageUrl?.[0] ? (
              <Image
                src={product.imageUrl[0]}
                alt={product.title}
                width={400}
                height={400}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                priority={priority}
                loading={priority ? undefined : "lazy"}
              />
            ) : (
              <div className="text-gray-400 text-sm">No Image</div>
            )}
          </div>

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-start justify-end ${product.mostPopular ? "pt-12" : "pt-3"} px-3 gap-2 opacity-0 group-hover:opacity-100`}
          >
            <button
              onClick={handleAddToWishlist}
              className={`rounded-xl p-2.5 shadow-md transition-all duration-200 ${
                isWishlisted
                  ? "text-brand bg-brand/10"
                  : "bg-white hover:bg-brand hover:text-white"
              }`}
            >
              <FaHeart className="text-xs" />
            </button>
            <span className="bg-white rounded-xl p-2.5 shadow-md hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer">
              <FaEye className="text-xs" />
            </span>
          </div>

          {/* Add to Cart Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-2.5 transition-all duration-300 cursor-pointer md:opacity-0 md:translate-y-full md:group-hover:opacity-100 md:group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full text-sm font-medium"
            >
              <FaShoppingCart className="text-xs" />
              Add To Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3 px-1">
          <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-brand transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            {product.discountedPrice ? (
              <>
                <span className="text-brand font-bold text-sm">
                  ৳{product.discountedPrice}
                </span>
                <span className="text-gray-400 line-through text-xs">
                  ৳{product.price}
                </span>
              </>
            ) : (
              <span className="text-brand font-bold text-sm">
                ৳{product.price}
              </span>
            )}
          </div>
          {product.sellCount > 0 && (
            <p className="text-[10px] text-gray-400 mt-1">
              {product.sellCount} sold
            </p>
          )}
        </div>
      </Link>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
