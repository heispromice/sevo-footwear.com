import type { Metadata } from "next";

import { liveProducts } from "@/content/products";
import ShopContent from "./shop-content";

export const metadata: Metadata = {
  title: "Shop the Selection — SEVO",
  description:
    "Browse every sneaker currently in the SEVO selection, organised by curated collection rather than an endless catalogue.",
  openGraph: {
    title: "Shop the Selection — SEVO",
    description:
      "Every sneaker currently in the SEVO selection, by curated collection.",
    type: "website",
  },
};

export default function ShopPage() {
  const products = liveProducts();

  return <ShopContent products={products} />;
}
