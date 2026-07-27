"use client";

import { FaTruck, FaHeadset, FaUndo, FaLock } from "react-icons/fa";

const benefits = [
  {
    icon: FaTruck,
    title: "Free Shipping",
    desc: "Free delivery on orders over ৳1000",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    desc: "Friendly customer support anytime",
  },
  {
    icon: FaUndo,
    title: "Easy Returns",
    desc: "Hassle-free returns within 30 days",
  },
  {
    icon: FaLock,
    title: "Secure Payment",
    desc: "100% secure checkout with Stripe",
  },
];

export default function BenefitsStrip() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {benefits.map((b) => (
          <div key={b.title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-brand/5 transition-colors">
            <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <b.icon className="text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{b.title}</h3>
            <p className="text-gray-500 text-xs mt-1">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
