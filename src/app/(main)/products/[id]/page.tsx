import MainLayout from "@/components/layout/MainLayout";
import ProductDetailClient from "./ProductDetailClient";

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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

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
      <ProductDetailClient product={product} />
    </MainLayout>
  );
}
