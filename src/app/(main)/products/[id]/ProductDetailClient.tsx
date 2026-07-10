"use client";

import { useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import AuthModal from "@/components/ui/AuthModal";

interface ProductDetailClientProps {
  product: {
    _id: string;
    title: string;
    description?: string;
    price: number;
    discountedPrice?: number | null;
    category: string;
    imageUrl: string[];
    sellCount: number;
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist, authModalOpen, setAuthModalOpen } =
    useWishlist();
  const isWishlisted = wishlistIds.has(product._id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      addToCart({
        _id: product._id,
        productId: product._id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        imageUrl: product.imageUrl,
        category: product.category,
        quantity,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    toggleWishlist(product._id);
  };

  return (
    <>
    <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span>Home</span> / <span>{product.category}</span> / <span className="text-gray-800">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <figure className="mb-4 bg-[#F5F5F5] rounded-lg p-8 flex items-center justify-center h-[400px]">
            {product.imageUrl[selectedImage] ? (
              <img
                src={product.imageUrl[selectedImage]}
                alt={product.title}
                className="max-h-full object-contain hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </figure>
          {product.imageUrl.length > 1 && (
            <div className="flex gap-3">
              {product.imageUrl.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-[#F5F5F5] p-2 ${
                    selectedImage === i ? "border-[rgb(219,68,68)]" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt={`${product.title} thumbnail ${i + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            {product.sellCount > 0 && <span>({product.sellCount} sold)</span>}
          </div>

          <div className="flex items-center gap-3 mt-4">
            {product.discountedPrice ? (
              <>
                <span className="text-3xl font-bold text-[rgb(219,68,68)]">
                  ৳{product.discountedPrice}
                </span>
                <span className="text-xl line-through text-gray-400">৳{product.price}</span>
                <span className="bg-[rgb(219,68,68)]/10 text-[rgb(219,68,68)] text-sm px-2 py-1 rounded">
                  -{discount}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[rgb(219,68,68)]">
                ৳{product.price}
              </span>
            )}
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="border-t mt-6 pt-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="text-sm">{product.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            {/* Quantity */}
            <div className="flex items-center border rounded-lg">
              <button
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 bg-[rgb(219,68,68)] text-white py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FaShoppingCart className="text-sm" />
              )}
              Add To Cart
            </button>

            {/* Wishlist */}
            <button
              onClick={handleAddToWishlist}
              className={`border p-3 rounded-lg transition-colors ${
                isWishlisted
                  ? "border-[rgb(219,68,68)] bg-[rgb(219,68,68)]/10 text-[rgb(219,68,68)]"
                  : "border-gray-300 hover:bg-gray-100 text-gray-600"
              }`}
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
    <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
