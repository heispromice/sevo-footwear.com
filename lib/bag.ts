import { products, type Product } from "@/content/products";
import { DELIVERY_FEE, useCart, type CartLine } from "@/lib/cart";

export interface BagItem {
  line: CartLine;
  product: Product;
}

/** Joins cart lines to product data and computes totals. */
export function useBagTotals() {
  const { lines } = useCart();

  const detailed: BagItem[] = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? { line, product } : null;
    })
    .filter((v): v is BagItem => v !== null);

  const subtotal = detailed.reduce((sum, i) => sum + i.product.price * i.line.quantity, 0);
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;

  return { detailed, subtotal, delivery, total: subtotal + delivery };
}
