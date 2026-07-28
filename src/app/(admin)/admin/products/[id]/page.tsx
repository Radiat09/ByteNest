"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface Category {
  _id: string;
  title: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  price: number;
  discountedPrice?: number | null;
  category: string;
  imageUrl: string[];
  sellCount: number;
  mostPopular?: boolean;
}

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [mostPopular, setMostPopular] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminApi.get<Category[]>("/categories/");
        setCategories(data);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const data = await adminApi.get<Product>(`/products/${productId}`);
      setTitle(data.title);
      setDescription(data.description || "");
      setDetailedDescription(data.detailedDescription || "");
      setPrice(String(data.price));
        setDiscountedPrice(data.discountedPrice ? String(data.discountedPrice) : "");
        setCategory(data.category);
        setImages(data.imageUrl || []);
        setMostPopular(data.mostPopular || false);
      } catch {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [productId, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = "Valid price is required";
    if (discountedPrice && (isNaN(Number(discountedPrice)) || Number(discountedPrice) < 0)) newErrors.discountedPrice = "Invalid discounted price";
    if (!category) newErrors.category = "Category is required";
    if (images.length === 0) newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await adminApi.put(`/products/update/${productId}`, {
        title: title.trim(),
        description: description.trim(),
        detailedDescription: detailedDescription.trim() || undefined,
        price: Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
        category,
        imageUrl: images,
        mostPopular,
      });
      toast.success("Product updated successfully");
      router.push("/admin/products/bestsellings");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update product";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief product summary"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Detailed Description</Label>
              <RichTextEditor
                value={detailedDescription}
                onChange={setDetailedDescription}
                placeholder="Full product specifications, features, bullet points, etc."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  placeholder="0.00"
                />
                {errors.discountedPrice && <p className="text-sm text-destructive">{errors.discountedPrice}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as string)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label>Images *</Label>
              <ImageUpload value={images} onChange={setImages} />
              {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostPopular}
                  onChange={(e) => setMostPopular(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-primary"
                />
                <span className="text-sm font-medium">Mark as Most Popular</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Updating..." : "Update Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
