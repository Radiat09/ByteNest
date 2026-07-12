"use client";

import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { FaTruck, FaTag, FaShieldAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Product {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  imageUrl: string[];
  category: string;
  sellCount: number;
}

interface Category {
  _id: string;
  title: string;
  imageUrl?: string;
}

const bannerImages = [
  "https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/banner1.webp",
  "https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/banner2.webp",
  "https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/banner3.webp",
  "https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/banner4.webp",
  "https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/banner5.webp",
];

export default function HomePageContent({
  products,
  categories,
  bestSelling,
}: {
  products: Product[];
  categories: Category[];
  bestSelling: Product[];
}) {
  return (
    <>
      {/* Hero Banner Slider */}
      <section className="max-w-screen-2xl mx-auto lg:px-10">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
        >
          {bannerImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4">
        {/* Flash Sale / New Arrivals */}
        <section className="py-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-5 h-10 rounded-sm bg-[rgb(219,68,68)]"></span>
            <span className="text-sm font-semibold text-[rgb(219,68,68)]">Today&apos;s</span>
          </div>
          <h2 className="text-3xl font-bold mb-8">Flash Sales</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product, index) => (
                <ProductCard key={product._id} product={product} priority={index < 2} />
              ))}
            </div>
          ) : (
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
          )}
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-block bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 border-t">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-5 h-10 rounded-sm bg-[rgb(219,68,68)]"></span>
            <span className="text-sm font-semibold text-[rgb(219,68,68)]">Categories</span>
          </div>
          <h2 className="text-3xl font-bold mb-8">Browse By Category</h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?categories=${cat.title}`}
                  className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md hover:border-[rgb(219,68,68)] transition-all"
                >
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.title} className="w-16 h-16 object-contain mb-3" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
                  )}
                  <span className="text-sm font-medium">{cat.title}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {["Smartphones", "Laptops", "Accessories", "Audio", "Wearables", "Gaming"].map((cat) => (
                <div key={cat} className="flex flex-col items-center p-6 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
                  <span className="text-sm font-medium">{cat}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Best Selling */}
        <section className="py-12 border-t">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-5 h-10 rounded-sm bg-[rgb(219,68,68)]"></span>
            <span className="text-sm font-semibold text-[rgb(219,68,68)]">This Month</span>
          </div>
          <h2 className="text-3xl font-bold mb-8">Best Selling Products</h2>
          {bestSelling.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSelling.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-[250px] rounded-lg"></div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Promo Banner */}
        <section className="py-12">
          <div className="bg-black rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0">
              <p className="text-sm font-medium text-green-400 mb-2">Categories</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Enhance Your <br /> Music Experience
              </h2>
              <Link
                href="/products"
                className="inline-block bg-[rgb(219,68,68)] text-white px-6 py-2 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
              >
                Shop Now
              </Link>
            </div>
            <img
              src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/JBL.png"
              alt="JBL Speaker"
              className="w-[300px] object-contain"
            />
          </div>
        </section>

        {/* Explore Products */}
        <section className="py-12 border-t">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-5 h-10 rounded-sm bg-[rgb(219,68,68)]"></span>
            <span className="text-sm font-semibold text-[rgb(219,68,68)]">Our Products</span>
          </div>
          <h2 className="text-3xl font-bold mb-8">Explore Our Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product, index) => (
                <ProductCard key={product._id} product={product} priority={index < 2} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-[250px] rounded-lg"></div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-block bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaTruck className="text-2xl text-gray-600" />
              </div>
              <h3 className="font-semibold mb-1">FREE AND FAST DELIVERY</h3>
              <p className="text-gray-500 text-sm">Free delivery for all orders over ৳1000</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaTag className="text-2xl text-gray-600" />
              </div>
              <h3 className="font-semibold mb-1">BEST CUSTOMER SERVICE</h3>
              <p className="text-gray-500 text-sm">Friendly 24/7 customer support</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaShieldAlt className="text-2xl text-gray-600" />
              </div>
              <h3 className="font-semibold mb-1">MONEY BACK GUARANTEE</h3>
              <p className="text-gray-500 text-sm">We return money within 30 days</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
