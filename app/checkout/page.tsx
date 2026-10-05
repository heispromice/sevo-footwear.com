import type { Metadata } from "next";
import CheckoutContent from "./checkout-content";

export const metadata: Metadata = {
  title: "Checkout — SEVO",
  description: "Complete your SEVO order.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Checkout — SEVO",
    description: "Complete your SEVO order.",
  },
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}

