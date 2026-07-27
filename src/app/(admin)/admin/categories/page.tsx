"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Upload, Pencil } from "lucide-react";
import Image from "next/image";

interface Category {
  _id: string;
  title: string;
  imageUrl: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const data = await adminApi.get<Category[]>("/categories/");
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a category title");
      return;
    }
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/upload?folder=categories`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.message || "Image upload failed");
      }

      const { url } = await uploadRes.json();

      await adminApi.post<Category>("/categories/", {
        title: title.trim(),
        imageUrl: url,
      });

      toast.success("Category created successfully");
      setTitle("");
      setFile(null);
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchCategories();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create category";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setDeletingId(id);
      await adminApi.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(category: Category) {
    setEditingId(category._id);
    setEditTitle(category.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) {
      toast.error("Category title is required");
      return;
    }

    try {
      await adminApi.put(`/categories/${id}`, { title: editTitle.trim() });
      toast.success("Category updated successfully");
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title: editTitle.trim() } : c))
      );
      cancelEdit();
    } catch {
      toast.error("Failed to update category");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Category title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={submitting}
                  className="file:mr-2 file:h-6 file:rounded-md file:border-0 file:bg-primary file:px-3 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary/80"
                />
              </div>
            </div>

            {preview && (
              <div className="flex items-center gap-4">
                <Image
                  src={preview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-lg object-cover ring-1 ring-border"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setPreview("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            All Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="ml-auto h-8 w-16" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No categories found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category._id}>
                    <TableCell>
                      <Image
                        src={category.imageUrl}
                        alt={category.title}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-border"
                      />
                    </TableCell>
                        <TableCell className="font-medium">
                          {editingId === category._id ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="h-8 w-40 text-sm"
                            />
                          ) : (
                            category.title
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === category._id ? (
                            <div className="flex gap-1 justify-end">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(category._id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => startEdit(category)}
                                disabled={deletingId === category._id}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon-sm"
                                onClick={() => handleDelete(category._id)}
                                disabled={deletingId === category._id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
