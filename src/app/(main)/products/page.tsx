"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/pagination";
import DualRangeSlider from "@/components/ui/dual-range-slider";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "sellCount_desc", label: "Best Selling" },
  { value: "discountedPrice_asc", label: "Discounted: Low to High" },
];

interface Product {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  imageUrl: string[];
  category: string;
  sellCount: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    sort: true,
  });

  const PRICE_MAX = 1000000;

  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const searchText = searchParams.get("searchText") || "";
  const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";

  const priceRangeFromUrl: [number, number] = [
    parseInt(minPrice) || 0,
    parseInt(maxPrice) || PRICE_MAX,
  ];
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRangeFromUrl);

  useEffect(() => {
    fetch(`${API_URL}/categories`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const cats = Array.isArray(data) ? data.map((c: any) => c.title) : [];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const buildURL = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || (Array.isArray(value) && value.length === 0) || value === "") {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      return `/products?${params.toString()}`;
    },
    [searchParams]
  );

  const updateFilter = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      router.push(buildURL(updates), { scroll: false });
    },
    [router, buildURL]
  );

  const toggleCategory = useCallback(
    (cat: string) => {
      const updated = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
      updateFilter({ categories: updated });
    },
    [selectedCategories, updateFilter]
  );

  const clearAllFilters = useCallback(() => {
    router.push("/products", { scroll: false });
  }, [router]);

  const handlePriceChange = useCallback(
    (range: [number, number]) => {
      setLocalPriceRange(range);
      const updates: Record<string, string | null> = {};
      updates.minPrice = range[0] > 0 ? String(range[0]) : null;
      updates.maxPrice = range[1] < PRICE_MAX ? String(range[1]) : null;
      updateFilter(updates);
    },
    [updateFilter],
  );

  useEffect(() => {
    setLocalPriceRange(priceRangeFromUrl);
  }, [searchParams.get("minPrice"), searchParams.get("maxPrice")]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(ITEMS_PER_PAGE),
      page: String(currentPage),
    });
    if (searchText) params.set("searchText", searchText);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    fetch(`${API_URL}/products?${params.toString()}`, { next: { revalidate: 60 } } as any)
      .then((r) => r.json())
      .then((data: ProductsResponse) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
        setLoading(false);
      });
  }, [currentPage, searchText, selectedCategories, minPrice, maxPrice, sortBy, sortOrder]);

  const hasActiveFilters = selectedCategories.length > 0 || localPriceRange[0] > 0 || localPriceRange[1] < PRICE_MAX || sortBy;

  const FilterSidebar = ({ className = "" }: { className?: string }) => (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FaFilter className="text-sm" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-[rgb(219,68,68)] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left font-medium mb-3"
        >
          Categories
          {expandedSections.category ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
        {expandedSections.category && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded border-gray-300 text-[rgb(219,68,68)] focus:ring-[rgb(219,68,68)]"
                />
                <span className="truncate">{cat}</span>
              </label>
            ))}
            {categories.length === 0 && (
              <p className="text-gray-400 text-sm">No categories found</p>
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-medium mb-3"
        >
          Price Range
          {expandedSections.price ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
        {expandedSections.price && (
          <DualRangeSlider
            min={0}
            max={PRICE_MAX}
            step={100}
            value={localPriceRange}
            onChange={handlePriceChange}
          />
        )}
      </div>

      {/* Sort */}
      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection("sort")}
          className="flex items-center justify-between w-full text-left font-medium mb-3"
        >
          Sort By
          {expandedSections.sort ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
        {expandedSections.sort && (
          <div className="space-y-2">
            {SORT_OPTIONS.map((opt) => {
              const [field, order] = opt.value ? opt.value.split("_") : ["", ""];
              const isActive = sortBy === field && sortOrder === order;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (opt.value === "") {
                      updateFilter({ sortBy: null, sortOrder: null });
                    } else {
                      updateFilter({ sortBy: field, sortOrder: order });
                    }
                  }}
                  className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                    isActive
                      ? "bg-[rgb(219,68,68)] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {searchText ? `Search results for "${searchText}"` : "All Products"}
          </h1>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Active filter tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active:</span>
            {selectedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200"
              >
                {cat}
                <FaTimes className="text-[10px]" />
              </button>
            ))}
            {localPriceRange[0] > 0 && (
              <button
                onClick={() => {
                  setLocalPriceRange([0, PRICE_MAX]);
                  updateFilter({ minPrice: null });
                }}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200"
              >
                Min: ৳{localPriceRange[0].toLocaleString()}
                <FaTimes className="text-[10px]" />
              </button>
            )}
            {localPriceRange[1] < PRICE_MAX && (
              <button
                onClick={() => {
                  setLocalPriceRange([0, PRICE_MAX]);
                  updateFilter({ maxPrice: null });
                }}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200"
              >
                Max: ৳{localPriceRange[1].toLocaleString()}
                <FaTimes className="text-[10px]" />
              </button>
            )}
            {sortBy && (
              <button
                onClick={() => updateFilter({ sortBy: null, sortOrder: null })}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200"
              >
                {SORT_OPTIONS.find((o) => o.value === `${sortBy}_${sortOrder}`)?.label || sortBy}
                <FaTimes className="text-[10px]" />
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        {total > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} products
          </p>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-[250px] rounded-lg" />
                    <div className="mt-3 space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4" />
                      <div className="bg-gray-200 h-4 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                {searchText ? `No products found for "${searchText}"` : "No products found"}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <ProductCard key={product._id} product={product} priority={index < 2} />
                  ))}
                </div>
                <Suspense>
                  <Pagination currentPage={currentPage} totalPages={totalPages} />
                </Suspense>
              </>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <FilterSidebar />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 bg-[rgb(219,68,68)] text-white py-3 rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="bg-gray-200 h-8 rounded w-1/3" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <div className="bg-gray-200 h-[250px] rounded-lg" />
                    <div className="mt-3 space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4" />
                      <div className="bg-gray-200 h-4 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
