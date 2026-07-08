"use client";

import MainLayout from "@/components/layout/MainLayout";
import { FaTruck, FaShieldAlt, FaHeadset, FaTag } from "react-icons/fa";

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
        <div className="text-sm text-gray-500 mb-6">
          <span>Home</span> / <span className="text-gray-800">About Us</span>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              ByteNest is your one-stop destination for the latest electronics
              in Bangladesh. Founded with a mission to make quality technology accessible
              to everyone, we bring you the best products at competitive prices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From smartphones and laptops to audio gear and accessories, we curate
              only the best products from top brands. Our commitment to customer
              satisfaction means fast delivery, secure payments, and dedicated support.
            </p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg h-[300px] flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/banner/JBL.png"
              alt="ByteNest"
              className="max-h-[250px] object-contain"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="border rounded-lg p-6 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-2xl text-[rgb(219,68,68)]" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mission */}
        <div className="bg-[rgb(219,68,68)] text-white rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-white/90 max-w-2xl mx-auto leading-relaxed">
            To provide the best online shopping experience for electronics in Bangladesh
            with genuine products, competitive prices, fast delivery, and exceptional
            customer service.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
