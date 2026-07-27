"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gray-50">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-2">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
      </div>
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-gray-500 text-center max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="btn-primary mt-2 cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
