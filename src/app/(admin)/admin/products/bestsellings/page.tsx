"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash2, Trophy } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";

interface Product {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  category?: string;
  imageUrl?: string[];
  images?: string[];
  sellCount?: number;
}

interface ProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export default function AdminBestSellersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("searchText") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async (page: number, search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        sortField: "sellCount",
        sortOrder: "desc",
      });
      if (search) {
        params.set("searchText", search);
      }
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
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, currentSearch);
  }, [currentPage, currentSearch, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("searchText", searchInput);
    } else {
      params.delete("searchText");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

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

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <Badge className="bg-yellow-500 text-white border-yellow-600 gap-1">
          <Trophy className="size-3" /> 1
        </Badge>
      );
    if (rank === 2)
      return (
        <Badge className="bg-gray-400 text-white border-gray-500">2</Badge>
      );
    if (rank === 3)
      return (
        <Badge className="bg-amber-600 text-white border-amber-700">3</Badge>
      );
    return <Badge variant="outline">{rank}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="size-6 text-yellow-500" />
              Best Selling Products
            </CardTitle>
            {!loading && (
              <p className="text-sm text-muted-foreground">
                {totalCount} product{totalCount !== 1 ? "s" : ""} total
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead className="w-12">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Disc. Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell>
                          <Skeleton className="h-6 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-10 w-10 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-12 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  : products.map((product, index) => {
                      const rank = (currentPage - 1) * 20 + index + 1;
                      const img =
                        product.imageUrl?.[0] || product.images?.[0] || "";
                      return (
                        <TableRow key={product._id}>
                          <TableCell>{getRankBadge(rank)}</TableCell>
                          <TableCell>
                            {img ? (
                              <img
                                src={img}
                                alt={product.title}
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
                          <TableCell className="text-right">
                            ৳{product.price.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.discountedPrice ? (
                              <span className="text-green-600 font-medium">
                                ৳{product.discountedPrice.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {product.category ? (
                              <Badge variant="secondary">
                                {product.category}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {(product.sellCount ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleDelete(product)}
                              disabled={deletingId === product._id}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
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
