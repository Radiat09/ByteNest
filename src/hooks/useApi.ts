"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(error.message || error.errorSources?.[0]?.message || `Request failed`);
  }

  if (res.status === 204) return null;

  const data = await res.json();
  return data.data !== undefined ? data.data : data;
}

export function useApi() {
  const queryClient = useQueryClient();

  const get = <T>(endpoint: string, options?: { enabled?: boolean; staleTime?: number }) =>
    useQuery({
      queryKey: [endpoint],
      queryFn: () => request<T>(endpoint),
      enabled: options?.enabled ?? true,
      staleTime: options?.staleTime ?? 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    });

  const post = <T>(endpoint: string, body: unknown) =>
    useMutation({
      mutationFn: () => request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [endpoint] });
      },
    });

  const put = <T>(endpoint: string, body: unknown) =>
    useMutation({
      mutationFn: () => request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [endpoint] });
      },
    });

  const del = <T>(endpoint: string) =>
    useMutation({
      mutationFn: () => request<T>(endpoint, { method: "DELETE" }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [endpoint] });
      },
    });

  const invalidate = (endpoint: string) => {
    queryClient.invalidateQueries({ queryKey: [endpoint] });
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };

  return { get, post, put, del, invalidate, invalidateAll };
}
