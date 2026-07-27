"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, ShieldCheck, Ban, UserCheck, Mail } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  customer: boolean;
  isBanned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [promoting, setPromoting] = useState<string | null>(null);
  const [banning, setBanning] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.get<User[]>("/users/");
      setUsers(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (email: string) => {
    try {
      setPromoting(email);
      await adminApi.put("/users/role", { email });
      toast.success(`${email} has been promoted to admin`);
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: "admin" } : u))
      );
    } catch {
      toast.error("Failed to promote user");
    } finally {
      setPromoting(null);
    }
  };

  const handleBanToggle = async (user: User) => {
    const action = user.isBanned ? "unban" : "ban";
    try {
      setBanning(user.email);
      if (user.isBanned) {
        await adminApi.put("/users/unban", { email: user.email });
        toast.success(`${user.email} has been unbanned`);
      } else {
        await adminApi.put("/users/ban", { email: user.email });
        toast.success(`${user.email} has been banned`);
      }
      setUsers((prev) =>
        prev.map((u) => (u.email === user.email ? { ...u, isBanned: !u.isBanned } : u))
      );
    } catch {
      toast.error(`Failed to ${action} user`);
    } finally {
      setBanning(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No users found</div>
            ) : (
              filtered.map((user) => (
                <Card key={user._id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-bold shrink-0">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-sm truncate">{user.name}</h3>
                          <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant={user.customer ? "default" : "outline"} className="text-xs">
                            {user.customer ? "Customer" : "Regular"}
                          </Badge>
                          <Badge variant={user.isBanned ? "destructive" : "outline"} className="text-xs">
                            {user.isBanned ? "Banned" : "Active"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            {user.role !== "admin" && (
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleMakeAdmin(user.email)}
                                disabled={promoting === user.email}
                              >
                                <ShieldCheck className="size-3.5" />
                              </Button>
                            )}
                            <Button
                              variant={user.isBanned ? "outline" : "destructive"}
                              size="icon-sm"
                              onClick={() => handleBanToggle(user)}
                              disabled={banning === user.email}
                            >
                              {user.isBanned ? <UserCheck className="size-3.5" /> : <Ban className="size-3.5" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop Table */}
          <div className="border rounded-lg hidden md:block">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={user.customer ? "default" : "outline"}>
                        {user.customer ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={user.isBanned ? "destructive" : "outline"}>
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.role !== "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMakeAdmin(user.email)}
                            disabled={promoting === user.email}
                          >
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            {promoting === user.email ? "Promoting..." : "Make Admin"}
                          </Button>
                        )}
                        <Button
                          variant={user.isBanned ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => handleBanToggle(user)}
                          disabled={banning === user.email}
                        >
                          {user.isBanned ? (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              {banning === user.email ? "Unbanning..." : "Unban"}
                            </>
                          ) : (
                            <>
                              <Ban className="h-4 w-4 mr-1" />
                              {banning === user.email ? "Banning..." : "Ban"}
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        </>
      )}
    </div>
  );
}
