const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(error.message || error.errorSources?.[0]?.message || `Request failed`);
  }

  const data = await res.json();
  return data.data !== undefined ? data.data : data;
}

export const adminApi = {
  get: <T>(endpoint: string) => adminFetch<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    adminFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    adminFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    adminFetch<T>(endpoint, { method: "DELETE" }),
};
