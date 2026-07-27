"use client";

import { useEffect, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OrderCustomer {
  email: string;
  name: string;
  companyName?: string;
  address?: string;
  PhoneNumber?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  title?: string;
  price?: number;
  imageUrl?: string[];
  discountedPrice?: number;
}

interface Order {
  _id: string;
  customerDetail: OrderCustomer;
  cartData: OrderItem[];
  totalPrice: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

type OrderStatus = "pending" | "completed" | "cancelled";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "completed", "cancelled"];

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    case "pending":
    default:
      return "outline";
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
}

function getPaymentBadgeColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await adminApi.get<Order[]>("/orders/all");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  async function handleStatusUpdate(orderId: string, newStatus: OrderStatus) {
    try {
      setUpdatingId(orderId);
      await adminApi.put(`/orders/update/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerDetail?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerDetail?.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              placeholder="Search by order ID, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No orders found.</div>
                ) : (
                  filteredOrders.map((order) => (
                    <Card key={order._id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-semibold text-sm">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <Badge
                              variant={getStatusBadgeVariant(order.orderStatus)}
                              className={getStatusBadgeColor(order.orderStatus)}
                            >
                              {order.orderStatus}
                            </Badge>
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Customer</span>
                              <span className="font-medium text-right max-w-[60%] truncate">
                                {order.customerDetail?.name || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Email</span>
                              <span className="text-xs text-right max-w-[60%] truncate">
                                {order.customerDetail?.email || ""}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Date</span>
                              <span>
                                {new Date(order.createdAt).toLocaleDateString("en-BD", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total</span>
                              <span className="font-semibold">৳{order.totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Payment</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs capitalize">{order.paymentMethod}</span>
                                <Badge
                                  variant={getStatusBadgeVariant(order.paymentStatus)}
                                  className={getPaymentBadgeColor(order.paymentStatus)}
                                >
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <Select
                              value={order.orderStatus}
                              onValueChange={(val) =>
                                handleStatusUpdate(order._id, val as OrderStatus)
                              }
                              disabled={updatingId === order._id}
                            >
                              <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Table */}
              <div className="rounded-lg border hidden md:block">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">
                      {order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {order.customerDetail?.name || "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.customerDetail?.email || ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      ৳{order.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize text-sm">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(order.paymentStatus)}
                        className={getPaymentBadgeColor(order.paymentStatus)}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(order.orderStatus)}
                        className={getStatusBadgeColor(order.orderStatus)}
                      >
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.orderStatus}
                        onValueChange={(val) =>
                          handleStatusUpdate(order._id, val as OrderStatus)
                        }
                        disabled={updatingId === order._id}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
