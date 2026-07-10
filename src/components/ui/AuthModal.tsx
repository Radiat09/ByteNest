"use client";

import Link from "next/link";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
        <p className="text-gray-500 mb-6">
          Please sign in or create an account to continue.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full bg-[rgb(219,68,68)] text-white py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Create Account
          </Link>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
