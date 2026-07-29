"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash2, Pencil, SlidersHorizontal, X } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { adminApi } from "@/lib/admin-api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Pagination from "@/components/ui/pagination";
import Image from "next/image";

interface Category {
  _id: string;
  title: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  category?: string;
  imageUrl?: string[];
  images?: string[];
  sellCount?: number;
  mostPopular?: boolean;
}

interface ProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 20;

const SORT_OPTIONS = [
  { value: "sellCount_desc", label: "Best Selling" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "title_asc", label: "Name: A-Z" },
];

const SORT_LABEL_MAP = Object.fromEntries(SORT_OPTIONS.map((opt) => [opt.value, opt.label])) as Record<string, string>;

export default function AdminBestSellersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("searchText") || "";
  const currentSort = searchParams.get("sortBy") || "sellCount";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingPopularId, setTogglingPopularId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async (page: number, search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
      });
      if (search) params.set("searchText", search);
      if (currentSort) params.set("sortBy", currentSort);
      if (currentSortOrder) params.set("sortOrder", currentSortOrder);
      if (currentCategory) params.set("categories", currentCategory);
      if (currentMinPrice) params.set("minPrice", currentMinPrice);
      if (currentMaxPrice) params.set("maxPrice", currentMaxPrice);

      const data = await adminApi.get<ProductsResponse>(
        `/products/?${params.toString()}`
      );
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load products";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [currentSort, currentSortOrder, currentCategory, currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(currentPage, currentSearch);
  }, [currentPage, currentSearch, currentSort, currentSortOrder, currentCategory, currentMinPrice, currentMaxPrice, fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchInput) {
          params.set("searchText", searchInput);
        } else {
          params.delete("searchText");
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, currentSearch, router, searchParams]);

  useEffect(() => {
    adminApi.get<Category[]>("/categories/")
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const updateFilter = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const clearAllFilters = useCallback(() => {
    router.push("/admin/products");
  }, [router]);

  const hasActiveFilters = currentSearch || currentCategory || currentMinPrice || currentMaxPrice || currentSort !== "sellCount" || currentSortOrder !== "desc";

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(product._id);
    try {
      await adminApi.delete(`/products/delete/${product._id}`);
      toast.success("Product deleted");
      fetchProducts(currentPage, currentSearch);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete product";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleMostPopular = async (product: Product) => {
    try {
      setTogglingPopularId(product._id);
      await adminApi.put(`/products/toggle-most-popular/${product._id}`);
      toast.success(
        product.mostPopular
          ? "Removed from Most Popular"
          : "Added to Most Popular"
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, mostPopular: !p.mostPopular } : p
        )
      );
      fetchProducts(currentPage, currentSearch);
    } catch {
      toast.error("Failed to update popularity");
    } finally {
      setTogglingPopularId(null);
    }
  };

  const activeFiltersCount = [currentSearch, currentCategory, currentMinPrice, currentMaxPrice].filter(Boolean).length
    + (currentSort !== "sellCount" || currentSortOrder !== "desc" ? 1 : 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <CardTitle className="text-2xl font-bold">
              Products
            </CardTitle>
            <div className="flex items-center gap-3">
              {!loading && (
                <p className="text-sm text-muted-foreground">
                  {totalCount} product{totalCount !== 1 ? "s" : ""} total
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={`${currentSort}_${currentSortOrder}`}
                onValueChange={(value) => {
                  if (!value) return;
                  const [sortBy, sortOrder] = value.split("_");
                  updateFilter({
                    sortBy,
                    sortOrder,
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by">
                    {SORT_LABEL_MAP[`${currentSort}_${currentSortOrder}`] || "Sort by"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/products/new")}
              >
                Add Product
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mb-6 p-4 border rounded-lg bg-gray-50/50">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-gray-500">Category</Label>
                <Select
                  value={currentCategory}
                  onValueChange={(value) => updateFilter({ category: value || null })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.title}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-gray-500">Min Price (৳)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentMinPrice}
                  onChange={(e) => updateFilter({ minPrice: e.target.value || null })}
                  className="w-[120px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-gray-500">Max Price (৳)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={currentMaxPrice}
                  onChange={(e) => updateFilter({ maxPrice: e.target.value || null })}
                  className="w-[120px]"
                />
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Card key={`mobile-skeleton-${i}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : products.map((product) => {
                  const img = product.imageUrl?.[0] || product.images?.[0] || "";
                  return (
                    <Card key={product._id}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {img ? (
                            <Image
                              src={img}
                              alt={product.title}
                              width={80}
                              height={80}
                              className="h-16 w-16 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
                              N/A
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate mb-1">{product.title}</h3>
                            {product.category && (
                              <Badge variant="secondary" className="text-xs mb-1.5">
                                {product.category}
                              </Badge>
                            )}
                            <div className="flex items-center gap-2 text-xs mb-2">
                              <span className="font-semibold text-gray-900">
                                ৳{product.price.toLocaleString()}
                              </span>
                              {product.discountedPrice && (
                                <span className="text-green-600 font-medium">
                                  ৳{product.discountedPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Sold: {(product.sellCount ?? 0).toLocaleString()}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant={product.mostPopular ? "default" : "outline"}
                                  size="icon-sm"
                                  onClick={() => handleToggleMostPopular(product)}
                                  disabled={togglingPopularId === product._id}
                                  title={product.mostPopular ? "Remove from Most Popular" : "Mark as Most Popular"}
                                >
                                  <FaStar className={product.mostPopular ? "fill-current" : ""} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon-sm"
                                  onClick={() => router.push(`/admin/products/${product._id}`)}
                                  disabled={deletingId === product._id}
                                >
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon-sm"
                                  onClick={() => handleDelete(product)}
                                  disabled={deletingId === product._id}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>

          {/* Desktop Table */}
          <div className="rounded-lg border hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Disc. Price</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell>
                          <Skeleton className="h-10 w-10 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-12 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-20 ml-auto rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  : products.map((product) => {
                      const img = product.imageUrl?.[0] || product.images?.[0] || "";
                      return (
                        <TableRow key={product._id}>
                          <TableCell>
                            {img ? (
                              <Image
                                src={img}
                                alt={product.title}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                N/A
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {product.title}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.category ? (
                              <Badge variant="secondary">{product.category}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ৳{product.price.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            {product.discountedPrice ? (
                              <span className="text-green-600 font-medium">
                                ৳{product.discountedPrice.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {(product.sellCount ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant={product.mostPopular ? "default" : "outline"}
                                size="icon-sm"
                                onClick={() => handleToggleMostPopular(product)}
                                disabled={togglingPopularId === product._id}
                                title={product.mostPopular ? "Remove from Most Popular" : "Mark as Most Popular"}
                              >
                                <FaStar className={product.mostPopular ? "fill-current" : ""} />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => router.push(`/admin/products/${product._id}`)}
                                disabled={deletingId === product._id}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon-sm"
                                onClick={() => handleDelete(product)}
                                disabled={deletingId === product._id}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No products found.
            </div>
          )}

          <div className="mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
