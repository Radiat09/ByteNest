"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "./types";

export default function HeroSection({ featured }: { featured?: Product }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <span className="inline-block bg-brand/10 text-brand text-sm font-semibold px-4 py-1.5 rounded-full">
              Welcome to ByteNest
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Discover Products{" "}
              <span className="text-brand">You&apos;ll Love</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto lg:mx-0">
              Shop from thousands of products across every category — electronics,
              fashion, home goods and more — all at the best prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="bg-brand text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-900 transition-colors shadow-lg shadow-brand/25"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:border-brand hover:text-brand transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: Featured Product */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-brand/10 rounded-full blur-3xl" />
            <div className="absolute w-48 h-48 md:w-60 md:h-60 bg-brand/5 rounded-full blur-2xl translate-x-12 translate-y-12" />
            {featured?.imageUrl?.[0] ? (
              <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px]">
                <Image
                  src={featured.imageUrl[0]}
                  alt={featured.title}
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            ) : (
              <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-gray-200 to-gray-100 rounded-3xl flex items-center justify-center">
                <span className="text-gray-400 text-lg font-medium">Featured Product</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
