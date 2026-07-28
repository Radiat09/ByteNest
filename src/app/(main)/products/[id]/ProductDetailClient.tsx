"use client";

import { useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import AuthModal from "@/components/ui/AuthModal";
import ProductCard from "@/components/ui/ProductCard";

interface ProductDetailClientProps {
  product: {
    _id: string;
    title: string;
    description?: string;
    detailedDescription?: string;
    price: number;
    discountedPrice?: number | null;
    category: string;
    imageUrl: string[];
    sellCount: number;
  };
  relatedProducts: Array<{
    _id: string;
    title: string;
    price: number;
    discountedPrice?: number | null;
    imageUrl: string[];
    category: string;
    sellCount: number;
  }>;
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
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
        <div className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
          <span className="hover:text-brand cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-brand cursor-pointer transition-colors">{product.category}</span>
          <span>/</span>
          <span className="text-gray-800">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <figure className="mb-4 bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-[400px] lg:h-[480px]">
              {product.imageUrl[selectedImage] ? (
                <img
                  src={product.imageUrl[selectedImage]}
                  alt={product.title}
                  className="max-h-full object-contain hover:scale-110 transition-transform duration-500 ease-out"
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
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-50 p-2 transition-all duration-200 ${
                      selectedImage === i
                        ? "border-brand shadow-md shadow-brand/10"
                        : "border-gray-100 hover:border-gray-300"
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
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.title}</h1>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              {product.sellCount > 0 && (
                <span className="bg-brand/5 text-brand px-2.5 py-1 rounded-lg text-xs font-medium">
                  {product.sellCount} sold
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-5">
              {product.discountedPrice ? (
                <>
                  <span className="text-3xl lg:text-4xl font-bold text-brand">৳{product.discountedPrice}</span>
                  <span className="text-xl line-through text-gray-400">৳{product.price}</span>
                  <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                    -{discount}%
                  </span>
                </>
              ) : (
                <span className="text-3xl lg:text-4xl font-bold text-brand">৳{product.price}</span>
              )}
            </div>

            <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

            {product.detailedDescription && (
              <div className="mt-6 prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.detailedDescription}</p>
              </div>
            )}

            <div className="border-t border-gray-100 mt-6 pt-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Category:</span>
                <span className="text-sm font-medium bg-gray-50 px-3 py-1 rounded-lg">{product.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              {/* Quantity */}
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden">
                <button
                  className="px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-3 font-semibold text-sm border-x-2 border-gray-100">{quantity}</span>
                <button
                  className="px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
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
                className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
                  isWishlisted
                    ? "border-brand bg-brand/5 text-brand"
                    : "border-gray-100 hover:border-brand/30 hover:bg-brand/5 text-gray-400 hover:text-brand"
                }`}
              >
                <FaHeart className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
