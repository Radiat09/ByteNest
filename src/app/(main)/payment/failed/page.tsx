"use client";

import MainLayout from "@/components/layout/MainLayout";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-20 text-center">
        <div className="card-modern p-10 max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-8">Something went wrong with your payment.</p>
          <Link href="/checkout" className="btn-primary inline-block">
            Try Again
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
