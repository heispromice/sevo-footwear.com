import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteLayout } from "@/components/sevo/layout";
import { productBySlug, sevoNumber } from "@/content/products";
import { toStorefrontProduct } from "@/content/storefront";
import ProductContent from "./product-content";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);

  if (!product) {
    return {
      title: "Unavailable — SEVO",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = productBySlug(slug);

  if (!product) {
    notFound();
  }

  /*
   * Use the same commerce-aware storefront model
   * used by the Product UI and Shop.
   *
   * This prevents SEO structured data from using
   * a different inventory calculation.
   */
  const storefrontProduct = toStorefrontProduct(product);

  const structuredAvailability =
    storefrontProduct.availability === "SOLD_OUT"
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${sevoNumber(product)} — ${product.name}`,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    model: product.model,
    sku: product.sku,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TZS",
      availability: structuredAvailability,
    },
  };

  return (
    <>
      <SiteLayout>
        <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-10">
          <nav
            className="sevo-meta text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>

            <span className="px-2">/</span>

            <span>{sevoNumber(product)}</span>
          </nav>
        </div>

        <ProductContent product={product} />
      </SiteLayout>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
