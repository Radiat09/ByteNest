import ModernHome from "@/components/home/ModernHome";
import MainLayout from "@/components/layout/MainLayout";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const metadata: Metadata = {
  title: "ByteNest - Shop the Best Products Online",
  description:
    "Shop thousands of products across every category at ByteNest. Electronics, fashion, home goods and more at the best prices in Bangladesh.",
  openGraph: {
    title: "ByteNest - Shop the Best Products Online",
    description:
      "Shop thousands of products across every category at ByteNest.",
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
    if (!res.ok) {
      console.log(`Failed to load products: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error("Failed to load products:", err);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`Failed to load categories: ${res.status} ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (err) {
    console.error("Failed to load categories:", err);
    return [];
  }
}

async function getBestSelling() {
  try {
    const res = await fetch(
      `${API_URL}/products?limit=8&sortBy=sellCount&sortOrder=desc`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) {
      console.log(`Failed to load best selling: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.log("Failed to load best selling:", err);
    return [];
  }
}

async function getActiveFlashSales() {
  try {
    const res = await fetch(`${API_URL}/flash-sales/active`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      console.log(`Failed to load flash sales: ${res.status} ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (err) {
    console.log("Failed to load flash sales:", err);
    return [];
  }
}

async function getMostPopular() {
  try {
    const res = await fetch(
      `${API_URL}/products?limit=4&mostPopular=true`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) {
      console.log(`Failed to load most popular: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.log("Failed to load most popular:", err);
    return [];
  }
}

export default async function HomePage() {
  const [products, categories, bestSelling, mostPopular, flashSales] =
    await Promise.all([
      getProducts(16),
      getCategories(),
      getBestSelling(),
      getMostPopular(),
      getActiveFlashSales(),
    ]);

  return (
    <MainLayout>
      <ModernHome
        products={products}
        categories={categories}
        bestSelling={bestSelling}
        mostPopular={mostPopular}
        flashSales={flashSales}
      />

      {/* <ClassicHome
          products={products}
          categories={categories}
          bestSelling={bestSelling}
        /> */}
    </MainLayout>
  );
}
