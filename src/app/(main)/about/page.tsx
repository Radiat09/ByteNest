"use client";

import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import { FaHeadset, FaShieldAlt, FaTag, FaTruck } from "react-icons/fa";
import about from "../../../../public/about.png";

const features = [
  {
    icon: FaTruck,
    title: "Free Delivery",
    description: "Free shipping on orders over ৳1000",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Payment",
    description: "100% secure payment with Stripe",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description: "Round-the-clock customer support",
  },
  {
    icon: FaTag,
    title: "Best Prices",
    description: "Competitive prices on all products",
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-8">
          <span className="hover:text-brand cursor-pointer transition-colors">
            Home
          </span>{" "}
          / <span className="text-gray-800">About Us</span>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="section-heading block mb-3">Our Story</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Shopping Made <span className="text-brand">Simple</span>
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              ByteNest is your one-stop destination for the latest products in
              Bangladesh. Founded with a mission to make quality products
              accessible to everyone, we bring you the best items at competitive
              prices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From electronics to accessories, we curate only the best products
              from top brands. Our commitment to customer satisfaction means
              fast delivery, secure payments, and dedicated support.
            </p>
          </div>
          <div className="bg-linear-to-br from-blue-50/80 via-indigo-50/50 to-white rounded-2xl h-75 lg:h-95 relative flex items-center justify-center overflow-hidden p-6">
            <Image
              src={about}
              alt="ByteNest"
              fill
              className="object-contain p-4 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-modern p-6 text-center group"
              >
                <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/10 transition-colors duration-300">
                  <Icon className="text-2xl text-brand" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-brand to-blue-800 text-white rounded-2xl p-10 lg:p-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            To provide the best online shopping experience in Bangladesh with
            genuine products, competitive prices, fast delivery, and exceptional
            customer service.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
