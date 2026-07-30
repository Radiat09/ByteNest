"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { FaPhoneAlt, FaEnvelope, FaHeadset } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number to track your order on our website or the courier's website.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) and online payments via Stripe (Visa, Mastercard). All online transactions are securely processed.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery within Dhaka takes 1-3 business days. Outside Dhaka, delivery takes 3-7 business days. Free delivery is available for orders over ৳1000.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return products within 7 days of delivery if they are defective or damaged. Contact our support team to initiate a return. Refunds are processed within 7-10 business days.",
  },
  {
    question: "Are all products genuine?",
    answer:
      "Yes, we only sell 100% genuine products sourced directly from authorized distributors. All products come with manufacturer warranty where applicable.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel your order before it is shipped. Once shipped, cancellation is not possible, but you can refuse delivery or initiate a return after receiving the product.",
  },
  {
    question: "Do you offer warranty?",
    answer:
      "Yes, most products come with manufacturer warranty. The warranty period varies by product and is mentioned on the product page. Warranty claims are handled through the respective brand's service center.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us via email at info@bytenest.com or call us at +880 1XXXXXXXXX. Our support team is available Saturday to Thursday, 9 AM to 8 PM.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <div className="text-sm text-gray-400 mb-8">
          <span className="hover:text-brand cursor-pointer transition-colors">
            Home
          </span>{" "}
          / <span className="text-gray-800">FAQ</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: FAQ Accordion */}
          <div>
            <span className="section-heading block mb-2">Support</span>
            <h1 className="text-3xl font-bold mb-3 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-500 mb-10">
              Find answers to common questions about orders, delivery, returns,
              and more.
            </p>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`card-modern overflow-hidden transition-all duration-300 ${openIndex === i ? "ring-2 ring-brand/10" : ""}`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="font-medium text-sm pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                        openIndex === i
                          ? "bg-brand text-white rotate-180"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <IoChevronDown className="text-sm" />
                    </div>
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Support Card */}
          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="card-modern p-6 text-center">
                <div className="relative w-full max-w-xs mx-auto mb-4">
                  <Image
                    src="/FAQ.svg"
                    alt="FAQ Illustration"
                    width={400}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Can&apos;t find the answer you&apos;re looking for? Please
                  chat with our friendly team.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaPhoneAlt className="text-brand" />
                    <span>+880 1XXXXXXXXX</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaEnvelope className="text-brand" />
                    <span>support@bytenest.com</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
                >
                  <FaHeadset />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
