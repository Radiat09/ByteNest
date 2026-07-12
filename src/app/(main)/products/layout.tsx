import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products - ByteNest",
  description:
    "Browse our wide range of electronics including smartphones, laptops, accessories, audio gear and more at the best prices in Bangladesh.",
  openGraph: {
    title: "Products - ByteNest",
    description:
      "Browse our wide range of electronics at the best prices in Bangladesh.",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
