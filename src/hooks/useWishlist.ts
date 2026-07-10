"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useJwtSynced } from "@/components/Providers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useWishlist() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const { synced: jwtSynced } = useJwtSynced();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = !!session?.user?.email;

  useEffect(() => {
    if (!isLoggedIn || !jwtSynced) return;

    fetch(`${API_URL}/wishlist`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const ids = (Array.isArray(data) ? data : []).map(
          (item: any) => item._id,
        );
        setWishlistIds(new Set(ids));
      })
      .catch(() => {});
  }, [isLoggedIn, jwtSynced]);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!isLoggedIn) {
        setAuthModalOpen(true);
        return;
      }

      const isIn = wishlistIds.has(productId);

      if (isIn) {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success("Removed from wishlist");
        try {
          const res = await fetch(`${API_URL}/wishlist/${productId}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error();
        } catch {
          setWishlistIds((prev) => new Set(prev).add(productId));
          toast.error("Failed to remove from wishlist");
        }
      } else {
        setWishlistIds((prev) => new Set(prev).add(productId));
        try {
          const res = await fetch(`${API_URL}/wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productId }),
          });
          if (!res.ok) throw new Error();
          toast.success("Added to wishlist");
        } catch {
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
          toast.error("Failed to add to wishlist");
        }
      }
    },
    [isLoggedIn, wishlistIds],
  );

  return { wishlistIds, toggleWishlist, authModalOpen, setAuthModalOpen };
}
