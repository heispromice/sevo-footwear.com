import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "sonner";

const siteTitle = "SEVO — Selective Essentials. Real Stories.";
const siteDescription =
  "SEVO is a Tanzania-born sneaker curation label. Selected essentials, chosen for design, character and everyday relevance.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  authors: [{ name: "SEVO" }],
  openGraph: {
    siteName: "SEVO",
    type: "website",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>

      <body>
        <CartProvider>
          {children}
          <Toaster position="bottom-center" />
        </CartProvider>
      </body>
    </html>
  );
}
