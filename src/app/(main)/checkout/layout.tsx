import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - ByteNest",
  description: "Complete your purchase at ByteNest.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
