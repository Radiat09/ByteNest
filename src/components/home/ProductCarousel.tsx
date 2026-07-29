"use client";

import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Product } from "./types";

function ModernCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.has(product._id);
  const discount = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-300 border border-gray-100">
        <div className="relative bg-gray-50 h-[220px] flex items-center justify-center">
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-2.5 py-1 rounded-lg z-10">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product._id);
            }}
            className={`absolute top-3 right-3 rounded-xl p-2 transition-all z-10 ${
              isWishlisted
                ? "bg-brand text-white shadow-sm shadow-brand/20"
                : "bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-brand hover:text-white shadow-sm"
            }`}
          >
            <FaHeart className="text-xs" />
          </button>
          {product.imageUrl?.[0] ? (
            <Image
              src={product.imageUrl[0]}
              alt={product.title}
              width={160}
              height={160}
              className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500"
              priority={priority}
              loading={priority ? undefined : "lazy"}
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
          <h3 className="text-sm font-medium text-gray-800 truncate">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            {product.discountedPrice ? (
              <>
                <span className="text-brand font-bold">
                  ৳{product.discountedPrice}
                </span>
                <span className="text-gray-400 line-through text-xs">
                  ৳{product.price}
                </span>
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

export default function ProductCarousel({
  products,
  title,
  label,
  sortBy,
}: {
  products: Product[];
  title: string;
  label: string;
  sortBy?: string;
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (products.length === 0) {
    return (
      <section className="py-16">
        <SectionHeader title={title} label={label} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-[220px] rounded-2xl" />
              <div className="mt-3 space-y-2 px-1">
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <SectionHeader title={title} label={label} />
      <div className="relative">
        <Swiper
          modules={[Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          pagination={{ clickable: true, type: "bullets" }}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="!pb-12"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product._id}>
              <ModernCard product={product} priority={index < 2} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        {products.length > 4 && (
          <>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute -left-2.5 top-[45%] -translate-y-1/2 -translate-x-3 z-10 w-11 h-11 rounded-full bg-white shadow-lg shadow-black/8 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white hover:border-brand hover:shadow-brand/20 transition-all duration-300"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute -right-2.5 top-[45%] -translate-y-1/2 translate-x-3 z-10 w-11 h-11 rounded-full bg-white shadow-lg shadow-black/8 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white hover:border-brand hover:shadow-brand/20 transition-all duration-300"
              aria-label="Next"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </>
        )}
      </div>

      <div className="text-center mt-8">
        <Link
          href={sortBy ? `/products?sortBy=${sortBy}` : "/products"}
          className="inline-block btn-primary px-10 py-3.5"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}

function SectionHeader({ title, label }: { title: string; label: string }) {
  return (
    <div className="text-center mb-10">
      <span className="section-heading">{label}</span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
        {title}
      </h2>
    </div>
  );
}
