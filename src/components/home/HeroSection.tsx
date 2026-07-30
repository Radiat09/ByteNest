"use client";

import Image from "next/image";
import Link from "next/link";
import hero from "../../../public/hero.png";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-white via-gray-50 to-blue-100">
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-24 md:py-32 lg:py-36">
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
              Shop from thousands of products across every category —
              electronics, fashion, home goods and more — all at the best
              prices.
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
          <div className="flex items-center justify-center">
            <div className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-none aspect-square md:aspect-[4/3] lg:aspect-auto lg:w-full lg:h-[520px]">
              <Image
                src={hero}
                alt={"hero section image"}
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
