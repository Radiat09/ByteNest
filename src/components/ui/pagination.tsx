"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParamKey?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  searchParamKey = "page",
}: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(searchParamKey, String(pageNumber));
    return "?" + params.toString();
  };

  const getVisiblePages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="inline-flex items-center justify-center size-9 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
          aria-label="Previous page"
        >
          <FaChevronLeft className="size-3" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center size-9 rounded-lg border border-border bg-background text-sm font-medium opacity-40 cursor-not-allowed" aria-disabled>
          <FaChevronLeft className="size-3" />
        </span>
      )}

      {visiblePages.map((page, index) =>
        page === "..." ? (
          <span
            key={`dot-${index}`}
            className="inline-flex items-center justify-center size-9 text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={createPageURL(page)}
            className={`inline-flex items-center justify-center size-9 rounded-lg border text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-[rgb(219,68,68)] text-white border-[rgb(219,68,68)]"
                : "border-border bg-background hover:bg-muted"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="inline-flex items-center justify-center size-9 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
          aria-label="Next page"
        >
          <FaChevronRight className="size-3" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center size-9 rounded-lg border border-border bg-background text-sm font-medium opacity-40 cursor-not-allowed" aria-disabled>
          <FaChevronRight className="size-3" />
        </span>
      )}
    </nav>
  );
}
