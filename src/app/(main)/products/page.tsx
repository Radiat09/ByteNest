"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/pagination";
import DualRangeSlider from "@/components/ui/dual-range-slider";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaBolt } from "react-icons/fa";
import Image from "next/image";

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

interface FlashSaleProduct {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  imageUrl: string[];
  category: string;
  sellCount: number;
}

interface FlashSale {
  _id: string;
  title: string;
  discountPercent: number;
  products: FlashSaleProduct[];
  startTime: string;
  endTime: string;
  active: boolean;
}

interface FilterSidebarProps {
  className?: string;
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  clearAllFilters: () => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  localPriceRange: [number, number];
  handlePriceChange: (range: [number, number]) => void;
  sortBy: string;
  sortOrder: string;
  updateFilter: (updates: Record<string, string | string[] | null>) => void;
}

function FlashSaleSection({ flashSales }: { flashSales: FlashSale[] }) {
  if (!flashSales.length) return null;

  return (
    <div className="mb-10">
      {flashSales.map((flashSale) => (
        <div key={flashSale._id} className="mb-8 last:mb-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full">
              <FaBolt className="text-lg" />
              <span className="font-bold text-sm uppercase tracking-wider">
                Flash Sale
              </span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {flashSale.title}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Up to {flashSale.discountPercent}% off • Limited time offer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {flashSale.products.map((product, index) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-300 border border-gray-100"
              >
                <div className="relative bg-gray-50 p-4 md:p-6 h-[180px] md:h-[220px] flex items-center justify-center">
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg z-10">
                    -{flashSale.discountPercent}%
                  </span>
                  {product.imageUrl?.[0] ? (
                    <Image
                      src={product.imageUrl[0]}
                      alt={product.title}
                      width={160}
                      height={160}
                      className="max-h-full w-auto object-contain"
                      priority={index < 2}
                      loading={index < 2 ? undefined : "lazy"}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-800 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-red-600 font-bold">
                      ৳
                      {product.discountedPrice
                        ? product.discountedPrice
                        : product.price}
                    </span>
                    {product.discountedPrice && (
                      <span className="text-gray-400 line-through text-xs">
                        ৳{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FilterSidebar({
  className,
  categories,
  selectedCategories,
  toggleCategory,
  clearAllFilters,
  expandedSections,
  toggleSection,
  localPriceRange,
  handlePriceChange,
  sortBy,
  sortOrder,
  updateFilter,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedCategories.length > 0 || localPriceRange[0] > 0 || localPriceRange[1] < 1000000 || sortBy;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FaFilter className="text-sm" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-brand hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="card-modern p-5">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left font-semibold text-sm mb-3"
        >
          Categories
          {expandedSections.category ? <FaChevronUp className="text-xs text-gray-400" /> : <FaChevronDown className="text-xs text-gray-400" />}
        </button>
        {expandedSections.category && (
          <div className="space-y-2.5 max-h-60 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer text-sm hover:text-brand transition-colors">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded-lg border-gray-300 text-brand focus:ring-brand"
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
      <div className="card-modern p-5">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-semibold text-sm mb-3"
        >
          Price Range
          {expandedSections.price ? <FaChevronUp className="text-xs text-gray-400" /> : <FaChevronDown className="text-xs text-gray-400" />}
        </button>
        {expandedSections.price && (
          <DualRangeSlider
            min={0}
            max={1000000}
            step={100}
            value={localPriceRange}
            onChange={handlePriceChange}
          />
        )}
      </div>

      {/* Sort */}
      <div className="card-modern p-5">
        <button
          onClick={() => toggleSection("sort")}
          className="flex items-center justify-between w-full text-left font-semibold text-sm mb-3"
        >
          Sort By
          {expandedSections.sort ? <FaChevronUp className="text-xs text-gray-400" /> : <FaChevronDown className="text-xs text-gray-400" />}
        </button>
        {expandedSections.sort && (
          <div className="space-y-1.5">
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
                  className={`block w-full text-left text-sm px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-brand text-white font-medium shadow-sm shadow-brand/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);

  const PRICE_MAX = 1000000;

  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const searchText = searchParams.get("searchText") || "";
  const selectedCategoriesParam = searchParams.get("categories");
  const selectedCategories = useMemo(() => selectedCategoriesParam?.split(",").filter(Boolean) || [], [selectedCategoriesParam]);
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";

  const localPriceRange = useMemo<[number, number]>(() => [
    parseInt(minPrice) || 0,
    parseInt(maxPrice) || PRICE_MAX,
  ], [minPrice, maxPrice]);

  useEffect(() => {
    fetch(`${API_URL}/categories`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const cats = Array.isArray(data) ? data.map((c: { title: string }) => c.title) : [];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/flash-sales/active`, { credentials: "include" })
      .then((r) => r.json())
      .then((data: FlashSale[]) => {
        setFlashSales(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setFlashSales([]);
      });
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
      const updates: Record<string, string | null> = {};
      updates.minPrice = range[0] > 0 ? String(range[0]) : null;
      updates.maxPrice = range[1] < PRICE_MAX ? String(range[1]) : null;
      updateFilter(updates);
    },
    [updateFilter],
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    fetch(`${API_URL}/products?${params.toString()}`, {
      next: { revalidate: 60 },
    })
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
            className="lg:hidden flex items-center gap-2 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium hover:border-brand hover:text-brand transition-all duration-200"
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
                className="flex items-center gap-1 bg-brand/5 text-brand text-xs px-3 py-1.5 rounded-full hover:bg-brand/10 transition-colors"
              >
                {cat}
                <FaTimes className="text-[10px]" />
              </button>
            ))}
            {localPriceRange[0] > 0 && (
              <button
                onClick={() => {
                  updateFilter({ minPrice: null });
                }}
                className="flex items-center gap-1 bg-brand/5 text-brand text-xs px-3 py-1.5 rounded-full hover:bg-brand/10 transition-colors"
              >
                Min: ৳{localPriceRange[0].toLocaleString()}
                <FaTimes className="text-[10px]" />
              </button>
            )}
            {localPriceRange[1] < PRICE_MAX && (
              <button
                onClick={() => {
                  updateFilter({ maxPrice: null });
                }}
                className="flex items-center gap-1 bg-brand/5 text-brand text-xs px-3 py-1.5 rounded-full hover:bg-brand/10 transition-colors"
              >
                Max: ৳{localPriceRange[1].toLocaleString()}
                <FaTimes className="text-[10px]" />
              </button>
            )}
            {sortBy && (
              <button
                onClick={() => updateFilter({ sortBy: null, sortOrder: null })}
                className="flex items-center gap-1 bg-brand/5 text-brand text-xs px-3 py-1.5 rounded-full hover:bg-brand/10 transition-colors"
              >
                {SORT_OPTIONS.find((o) => o.value === `${sortBy}_${sortOrder}`)?.label || sortBy}
                <FaTimes className="text-[10px]" />
              </button>
            )}
          </div>
        )}

        {/* Flash Sales */}
        <FlashSaleSection flashSales={flashSales} />

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
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              clearAllFilters={clearAllFilters}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              localPriceRange={localPriceRange}
              handlePriceChange={handlePriceChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              updateFilter={updateFilter}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-[250px] rounded-2xl" />
                    <div className="mt-3 space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4" />
                      <div className="bg-gray-200 h-4 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-gray-500 text-center py-16 text-lg">
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
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                clearAllFilters={clearAllFilters}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                localPriceRange={localPriceRange}
                handlePriceChange={handlePriceChange}
                sortBy={sortBy}
                sortOrder={sortOrder}
                updateFilter={updateFilter}
              />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn-primary w-full mt-6"
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
                    <div className="bg-gray-200 h-[250px] rounded-2xl" />
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
