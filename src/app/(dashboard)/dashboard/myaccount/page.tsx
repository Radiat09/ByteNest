"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyAccountPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="card-modern p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
            <input
              type="text"
              className="input-modern"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <input
              type="email"
              className="input-modern !bg-gray-50 !text-gray-500"
              value={formData.email}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Role</label>
            <input
              type="text"
              className="input-modern !bg-gray-50 !text-gray-500 capitalize"
              value={session?.user?.role || "user"}
              disabled
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
