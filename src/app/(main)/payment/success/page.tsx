"use client";

import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const CART_STORAGE_KEY = "bikroy_guest_cart";

export default function PaymentSuccess() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-20 text-center">
        <div className="card-modern p-10 max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-8">Your order has been placed successfully.</p>
          <Link href="/" className="btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
