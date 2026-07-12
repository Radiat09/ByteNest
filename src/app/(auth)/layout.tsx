"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <div className="p-4 lg:p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Back to Shop
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="hidden lg:block w-1/2">
            <img
              src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/signup/Login_bro1.png"
              alt="Auth"
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full lg:w-1/2 max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
