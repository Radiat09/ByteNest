"use client";

import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="py-8">
      <div className="relative bg-gradient-to-r from-[#111] via-gray-900 to-[#111] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/JBL.png')] bg-contain bg-no-repeat bg-right opacity-20" />
        <div className="relative z-10 px-8 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left">
            <p className="text-brand text-sm font-semibold mb-3 uppercase tracking-wider">
              Featured Collection
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Enhance Your <br className="hidden md:block" />
              Lifestyle Today
            </h2>
            <Link
              href="/products"
              className="inline-block bg-brand text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-900 transition-colors shadow-lg shadow-brand/25"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
