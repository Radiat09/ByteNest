"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold text-gray-300">!</h1>
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-gray-500 text-center max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-4 bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
