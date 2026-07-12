"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-gray-500 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-4 bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
