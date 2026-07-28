import MainLayout from "@/components/layout/MainLayout";
import ProductDetailClient from "./ProductDetailClient";

interface RelatedProduct {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  imageUrl: string[];
  category: string;
  sellCount: number;
}

async function getProduct(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

async function getRelatedProducts(category: string, excludeId: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(
      `${API_URL}/products?categories=${encodeURIComponent(category)}&limit=8`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const products = (json.data?.products || json.products || []) as RelatedProduct[];
    return products.filter((p) => p._id !== excludeId).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const relatedProducts = product
    ? await getRelatedProducts(product.category, product._id)
    : [];

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </MainLayout>
  );
}
