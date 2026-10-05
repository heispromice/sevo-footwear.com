import Link from "next/link";

import { collectionLabel } from "@/content/collections";
import { imageFor } from "@/content/images";
import { isLimited, sevoNumber, totalStock, type Product } from "@/content/products";
import { formatPrice } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  const primary = imageFor(product.images[0]);
  const secondary = imageFor(product.images[1] ?? product.images[0]);
  const soldOut = totalStock(product) === 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      aria-label={`${sevoNumber(product)} — ${product.name}`}
    >
      <div className="relative overflow-hidden bg-paper">
        <img
          src={primary}
          alt={`${product.brand} ${product.model} — ${product.name}`}
          loading="lazy"
          width={1200}
          height={1400}
          className="aspect-4/5 w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img
          src={secondary}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1200}
          height={1400}
          className="absolute inset-0 aspect-4/5 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span className="sevo-meta absolute left-3 top-3 bg-background px-2 py-1">
          {sevoNumber(product)}
        </span>

        {soldOut ? (
          <span className="sevo-meta absolute right-3 top-3 bg-foreground px-2 py-1 text-background">
            Sold out
          </span>
        ) : isLimited(product) ? (
          <span className="sevo-meta absolute right-3 top-3 bg-background px-2 py-1">
            Limited selection
          </span>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-background/95 px-3 py-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="sevo-meta text-muted-foreground">Selected for</p>
          <p className="mt-1 text-xs">{product.selectedFor.join(" / ")}</p>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="sevo-label text-muted-foreground">{product.brand}</p>
          <h3 className="mt-1.5 text-sm font-medium">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{product.model}</p>
          <p className="sevo-meta mt-2 text-muted-foreground">
            {collectionLabel(product.collection)}
          </p>
        </div>

        <p className="sevo-meta whitespace-nowrap">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
