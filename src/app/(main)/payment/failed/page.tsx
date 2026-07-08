"use client";

import MainLayout from "@/components/layout/MainLayout";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-20 text-center">
        <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">Something went wrong with your payment.</p>
        <Link
          href="/checkout"
          className="inline-block bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
        >
          Try Again
        </Link>
      </div>
    </MainLayout>
  );
}
