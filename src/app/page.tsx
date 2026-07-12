import type { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import HomePageContent from "@/components/HomePageContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const metadata: Metadata = {
  title: "ByteNest - Your One-Stop Electronics Shop",
  description:
    "Shop the latest electronics at ByteNest. Smartphones, laptops, accessories, audio gear and more at the best prices in Bangladesh.",
  openGraph: {
    title: "ByteNest - Your One-Stop Electronics Shop",
    description:
      "Shop the latest electronics at ByteNest. Smartphones, laptops, accessories, audio gear and more.",
    type: "website",
    locale: "en_US",
  },
};

async function getProducts(limit?: number) {
  try {
    const params = new URLSearchParams({ limit: String(limit || 16) });
    const res = await fetch(`${API_URL}/products?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getBestSelling() {
  try {
    const res = await fetch(
      `${API_URL}/products?limit=4&sortBy=sellCount&sortOrder=desc`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [products, categories, bestSelling] = await Promise.all([
    getProducts(16),
    getCategories(),
    getBestSelling(),
  ]);

  return (
    <MainLayout>
      <HomePageContent
        products={products}
        categories={categories}
        bestSelling={bestSelling}
      />
    </MainLayout>
  );
}
