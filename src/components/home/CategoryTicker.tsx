"use client";

import Link from "next/link";
import type { Category } from "./types";

export default function CategoryTicker({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-[#111] py-4 overflow-hidden">
      <div className="ticker-track flex items-center gap-12 whitespace-nowrap">
        {[...categories, ...categories, ...categories].map((cat, i) => (
          <Link
            key={`${cat._id}-${i}`}
            href={`/products?categories=${cat.title}`}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors shrink-0"
          >
            {cat.imageUrl ? (
              <img src={cat.imageUrl} alt={cat.title} className="w-8 h-8 object-contain brightness-0 invert opacity-60" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700" />
            )}
            <span className="text-sm font-medium uppercase tracking-wider">{cat.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
