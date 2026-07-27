"use client";

import MainLayout from "@/components/layout/MainLayout";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-20 text-center">
        <div className="card-modern p-10 max-w-md mx-auto">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-gray-500 mb-8">Your payment was cancelled.</p>
          <Link href="/checkout" className="btn-primary inline-block">
            Try Again
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
