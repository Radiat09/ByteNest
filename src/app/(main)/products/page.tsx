import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/pagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 12;

async function getProducts(page: number, searchText: string) {
  try {
    const params = new URLSearchParams({
      limit: String(ITEMS_PER_PAGE),
      page: String(page),
    });
    if (searchText) params.set("searchText", searchText);

    const res = await fetch(`${API_URL}/products?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { products: [], total: 0, totalPages: 0 };
    return res.json();
  } catch {
    return { products: [], total: 0, totalPages: 0 };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; searchText?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const searchText = params.searchText || "";
  const { products, total, totalPages } = await getProducts(currentPage, searchText);

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {searchText ? `Search results for "${searchText}"` : "All Products"}
          </h1>
          {total > 0 && (
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} products
            </p>
          )}
        </div>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            {searchText ? `No products found for "${searchText}"` : "No products found"}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Suspense>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </Suspense>
          </>
        )}
      </div>
    </MainLayout>
  );
}
