"use client";

import HeroSection from "./HeroSection";
import CategoryTicker from "./CategoryTicker";
import ProductCarousel from "./ProductCarousel";
import PromoBanner from "./PromoBanner";
import TabbedProducts from "./TabbedProducts";
import Testimonials from "./Testimonials";
import BenefitsStrip from "./BenefitsStrip";
import type { Product, Category, FlashSale } from "./types";
import Image from "next/image";
import { FaBolt } from "react-icons/fa";

function FlashSaleSection({ flashSales }: { flashSales: FlashSale[] }) {
  if (!flashSales.length) return null;

  return (
    <section className="py-10">
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4">
        {flashSales.map((flashSale) => (
          <div key={flashSale._id} className="mb-10 last:mb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full">
                <FaBolt className="text-lg" />
                <span className="font-bold text-sm uppercase tracking-wider">
                  Flash Sale
                </span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {flashSale.title}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Up to {flashSale.discountPercent}% off • Limited time offer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {flashSale.products.map((product, index) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-300 border border-gray-100"
                >
                  <div className="relative bg-gray-50 p-4 md:p-6 h-[180px] md:h-[220px] flex items-center justify-center">
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg z-10">
                      -{flashSale.discountPercent}%
                    </span>
                    {product.imageUrl?.[0] ? (
                      <Image
                        src={product.imageUrl[0]}
                        alt={product.title}
                        width={160}
                        height={160}
                        className="max-h-full w-auto object-contain"
                        priority={index < 2}
                        loading={index < 2 ? undefined : "lazy"}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-red-600 font-bold">
                        ৳
                        {product.discountedPrice
                          ? product.discountedPrice
                          : product.price}
                      </span>
                      {product.discountedPrice && (
                        <span className="text-gray-400 line-through text-xs">
                          ৳{product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ModernHome({
  products,
  categories,
  bestSelling,
  flashSales,
}: {
  products: Product[];
  categories: Category[];
  bestSelling: Product[];
  flashSales: FlashSale[];
}) {
  const featured = bestSelling.length > 0 ? bestSelling[0] : products[0];

  return (
    <>
      <HeroSection featured={featured} />
      <FlashSaleSection flashSales={flashSales} />
      <CategoryTicker categories={categories} />
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4">
        <ProductCarousel
          products={products.slice(0, 8)}
          title="Most Popular Products"
          label="Featured"
        />
        <PromoBanner />
        <TabbedProducts products={products} categories={categories} />
        <ProductCarousel
          products={bestSelling}
          title="Best Sellers"
          label="Top Rated"
        />
        <Testimonials />
        <BenefitsStrip />
      </div>
    </>
  );
}
