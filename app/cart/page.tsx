import type { Metadata } from "next";
import CartContent from "./cart-content";

export const metadata: Metadata = {
  title: "Your Bag — SEVO",
  description: "Review the selections in your SEVO bag before checkout.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Your Bag — SEVO",
    description: "Review your SEVO selections before checkout.",
  },
};

export default function CartPage() {
  return <CartContent />;
}
