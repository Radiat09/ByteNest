"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "@/lib/admin-api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
  _id: string;
  title: string;
}

interface FlashSale {
  _id: string;
  title: string;
  discountPercent: number;
  products: Product[];
  startTime: string;
  endTime: string;
  active: boolean;
}

interface FlashSaleFormData {
  title: string;
  discountPercent: number;
  startTime: string;
  endTime: string;
  active: boolean;
  products: string[];
}

function getStatus(flashSale: FlashSale): string {
  if (!flashSale.active) return "inactive";
  const now = new Date();
  const start = new Date(flashSale.startTime);
  const end = new Date(flashSale.endTime);
  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "active";
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "default";
    case "upcoming":
      return "secondary";
    case "ended":
      return "destructive";
    case "inactive":
      return "outline";
    default:
      return "outline";
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "upcoming":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "ended":
      return "bg-red-100 text-red-700 border-red-200";
    case "inactive":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "";
  }
}

const initialFormData: FlashSaleFormData = {
  title: "",
  discountPercent: 10,
  startTime: "",
  endTime: "",
  active: true,
  products: [],
};

export default function AdminFlashSalesPage() {
  const router = useRouter();
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FlashSaleFormData>(initialFormData);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFlashSales = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.get<FlashSale[]>("/flash-sales/");
      setFlashSales(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load flash sales");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const data = await adminApi.get<{ products: Product[] }>(
        "/products/?page=1&limit=100",
      );
      setProducts(data?.products ?? []);
    } catch (err) {
      console.error("Failed to load products", err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFlashSales();
  }, [fetchFlashSales]);

  useEffect(() => {
    if (showForm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProducts();
    }
  }, [showForm, fetchProducts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleFormOpen() {
    setFormData(initialFormData);
    setProductSearch("");
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setFormData(initialFormData);
    setProductSearch("");
  }

  function handleInputChange(
    field: keyof FlashSaleFormData,
    value: string | number | boolean,
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleProductToggle(productId: string) {
    setFormData((prev) => {
      const isSelected = prev.products.includes(productId);
      return {
        ...prev,
        products: isSelected
          ? prev.products.filter((id) => id !== productId)
          : [...prev.products, productId],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (formData.discountPercent < 1 || formData.discountPercent > 100) {
      toast.error("Discount must be between 1 and 100");
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error("Start and end times are required");
      return;
    }
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error("End time must be after start time");
      return;
    }
    if (formData.products.length === 0) {
      toast.error("Select at least one product");
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.post("/flash-sales/", {
        title: formData.title.trim(),
        discountPercent: formData.discountPercent,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        active: formData.active,
        products: formData.products,
      });
      toast.success("Flash sale created successfully");
      handleFormClose();
      fetchFlashSales();
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create flash sale";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete flash sale "${title}"? This cannot be undone.`))
      return;

    try {
      setDeletingId(id);
      await adminApi.delete(`/flash-sales/${id}`);
      toast.success("Flash sale deleted");
      setFlashSales((prev) => prev.filter((fs) => fs._id !== id));
      router.refresh();
    } catch {
      toast.error("Failed to delete flash sale");
    } finally {
      setDeletingId(null);
    }
  }

  function getFilteredProducts() {
    if (!productSearch.trim()) return products;
    return products.filter((p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-bold">Flash Sales</CardTitle>
          <Button onClick={handleFormOpen}>Create Flash Sale</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : flashSales.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No flash sales found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Discount (%)</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flashSales.map((fs) => {
                    const status = getStatus(fs);
                    return (
                      <TableRow key={fs._id}>
                        <TableCell className="font-medium">
                          {fs.title}
                        </TableCell>
                        <TableCell>{fs.discountPercent}%</TableCell>
                        <TableCell>{fs.products?.length ?? 0}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(fs.startTime).toLocaleString("en-BD", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(fs.endTime).toLocaleString("en-BD", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(status)}
                            className={getStatusBadgeColor(status)}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(fs._id, fs.title)}
                            disabled={deletingId === fs._id}
                          >
                            {deletingId === fs._id ? "Deleting..." : "Delete"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <Card className="!overflow-visible">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create Flash Sale</CardTitle>
              <Button variant="ghost" onClick={handleFormClose}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g. Summer Sale"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percent</Label>
                  <Input
                    id="discount"
                    type="number"
                    min={1}
                    max={100}
                    value={formData.discountPercent}
                    onChange={(e) =>
                      handleInputChange(
                        "discountPercent",
                        parseInt(e.target.value) || 1,
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) =>
                      handleInputChange("endTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="active" className="cursor-pointer">
                  Active
                </Label>
                <button
                  type="button"
                  id="active"
                  onClick={() => handleInputChange("active", !formData.active)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    formData.active ? "bg-primary" : "bg-input"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                      formData.active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    Products{" "}
                    <span className="text-muted-foreground font-normal">
                      ({formData.products.length} selected)
                    </span>
                  </Label>
                </div>
                {formData.products.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.products.map((id) => {
                      const product = products.find((p) => p._id === id);
                      if (!product) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm bg-background"
                        >
                          {product.title}
                          <button
                            type="button"
                            onClick={() => handleProductToggle(id)}
                            className="rounded-full hover:bg-muted p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="relative max-w-sm" ref={dropdownRef}>
                  <Input
                    ref={inputRef}
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowDropdown(true);
                      setHighlightedIndex(-1);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => {
                      const filtered = getFilteredProducts();
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightedIndex((prev) =>
                          prev < filtered.length - 1 ? prev + 1 : 0,
                        );
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setHighlightedIndex((prev) =>
                          prev > 0 ? prev - 1 : filtered.length - 1,
                        );
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          highlightedIndex >= 0 &&
                          filtered[highlightedIndex]
                        ) {
                          handleProductToggle(filtered[highlightedIndex]._id);
                          setProductSearch("");
                          setShowDropdown(false);
                          setHighlightedIndex(-1);
                        }
                      } else if (e.key === "Escape") {
                        setShowDropdown(false);
                        setHighlightedIndex(-1);
                      }
                    }}
                    autoComplete="off"
                  />
                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 max-h-96 overflow-y-auto rounded-md border bg-background shadow-lg">
                      {productsLoading ? (
                        <div className="p-4 space-y-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                          ))}
                        </div>
                      ) : getFilteredProducts().length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                          {productSearch.trim()
                            ? "No products found."
                            : "Type to search products."}
                        </div>
                      ) : (
                        <div className="p-1">
                          {getFilteredProducts().map((product, index) => (
                            <button
                              key={product._id}
                              type="button"
                              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-md cursor-pointer hover:bg-muted ${
                                index === highlightedIndex ? "bg-muted" : ""
                              }`}
                              onClick={() => {
                                handleProductToggle(product._id);
                                setProductSearch("");
                                setShowDropdown(false);
                                setHighlightedIndex(-1);
                              }}
                              onMouseEnter={() => setHighlightedIndex(index)}
                            >
                              <input
                                type="checkbox"
                                checked={formData.products.includes(
                                  product._id,
                                )}
                                readOnly
                                className="h-4 w-4 rounded border-gray-300 accent-primary pointer-events-none"
                              />
                              {product.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFormClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Flash Sale"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
