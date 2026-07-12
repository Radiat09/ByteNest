"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  active: boolean;
}

const initialForm = {
  code: "",
  discountPercent: 0,
  minOrder: 0,
  maxUses: 0,
  expiryDate: "",
  active: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Coupon>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      setLoading(true);
      const data = await adminApi.get<Coupon[]>("/coupons/");
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    try {
      setCreating(true);
      await adminApi.post("/coupons/", form);
      toast.success("Coupon created successfully");
      setForm(initialForm);
      fetchCoupons();
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(coupon: Coupon) {
    setEditingId(coupon._id);
    setEditForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      minOrder: coupon.minOrder,
      maxUses: coupon.maxUses,
      expiryDate: coupon.expiryDate.split("T")[0],
      active: coupon.active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function handleUpdate(id: string) {
    try {
      await adminApi.put(`/coupons/${id}`, editForm);
      toast.success("Coupon updated successfully");
      setEditingId(null);
      setEditForm({});
      fetchCoupons();
    } catch {
      toast.error("Failed to update coupon");
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    try {
      await adminApi.put(`/coupons/${id}`, { active: !currentActive });
      toast.success(`Coupon ${!currentActive ? "activated" : "deactivated"}`);
      fetchCoupons();
    } catch {
      toast.error("Failed to update coupon status");
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      await adminApi.delete(`/coupons/${id}`);
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  }

  function isExpired(dateStr: string) {
    return new Date(dateStr) < new Date();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="e.g. SUMMER20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercent">Discount (%)</Label>
              <Input
                id="discountPercent"
                type="number"
                min={1}
                max={100}
                value={form.discountPercent || ""}
                onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrder">Min Order (৳)</Label>
              <Input
                id="minOrder"
                type="number"
                min={0}
                value={form.minOrder || ""}
                onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses (0=unlimited)</Label>
              <Input
                id="maxUses"
                type="number"
                min={0}
                value={form.maxUses || ""}
                onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 flex items-end gap-3">
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No coupons found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount (%)</TableHead>
                  <TableHead>Min Order (৳)</TableHead>
                  <TableHead>Max Uses</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    {editingId === coupon._id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editForm.code ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                            className="h-8 w-28 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            value={editForm.discountPercent ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, discountPercent: Number(e.target.value) })}
                            className="h-8 w-16 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={editForm.minOrder ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, minOrder: Number(e.target.value) })}
                            className="h-8 w-20 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={editForm.maxUses ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, maxUses: Number(e.target.value) })}
                            className="h-8 w-16 text-xs"
                          />
                        </TableCell>
                        <TableCell className="text-sm">{coupon.usedCount}</TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={editForm.expiryDate ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                            className="h-8 w-32 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={editForm.active ? "default" : "secondary"}>
                            {editForm.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              onClick={() => handleUpdate(coupon._id)}
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
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-mono font-semibold text-sm">
                          {coupon.code}
                        </TableCell>
                        <TableCell className="text-sm">
                          {coupon.discountPercent}%
                        </TableCell>
                        <TableCell className="text-sm">
                          ৳{coupon.minOrder.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {coupon.maxUses === 0 ? "∞" : coupon.maxUses}
                        </TableCell>
                        <TableCell className="text-sm">
                          {coupon.usedCount}
                        </TableCell>
                        <TableCell className="text-sm">
                          <span className={isExpired(coupon.expiryDate) ? "text-destructive" : ""}>
                            {formatDate(coupon.expiryDate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={coupon.active ? "default" : "secondary"}
                            className={coupon.active
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                            }
                          >
                            {coupon.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleActive(coupon._id, coupon.active)}
                            >
                              {coupon.active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(coupon)}
                            >
                              Edit
                            </Button>
                            {deletingId === coupon._id ? (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(coupon._id)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeletingId(null)}
                                >
                                  No
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeletingId(coupon._id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </>
                    )}
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
