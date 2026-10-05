import type { Metadata } from "next";

import WishlistContent from "./wishlist-content";

export const metadata: Metadata = {
  title: "Saved Selections — SEVO",
  description: "Your saved SEVO sneaker selections.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  return <WishlistContent />;
}
