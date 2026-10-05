"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { products } from "@/content/products";
import { toStorefrontProduct } from "@/content/storefront";

export interface CartLine {
  productId: string;
  size: string;
  quantity: number;
}

export type CartAddResult =
  | {
      ok: true;
      addedQuantity: number;
      availableQuantity: number;
    }
  | {
      ok: false;
      reason:
        | "PRODUCT_NOT_FOUND"
        | "SIZE_NOT_FOUND"
        | "SOLD_OUT"
        | "MAX_QUANTITY_REACHED";
      availableQuantity: number;
    };

const CART_KEY = "sevo.bag.v1";
const SAVED_KEY = "sevo.saved.v1";

interface CartValue {
  lines: CartLine[];
  saved: string[];
  count: number;
  add: (productId: string, size: string, quantity?: number) => CartAddResult;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
  toggleSaved: (productId: string) => void;
  isSaved: (productId: string) => boolean;
}

const CartContext = createContext<CartValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);

    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/*
 * Get the currently available quantity for one
 * product-size variant from the storefront model.
 *
 * This is temporary frontend inventory data.
 * Laravel/MySQL will become authoritative later.
 */
function getAvailableQuantity(
  productId: string,
  size: string,
): {
  productFound: boolean;
  sizeFound: boolean;
  availableQuantity: number;
} {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return {
      productFound: false,
      sizeFound: false,
      availableQuantity: 0,
    };
  }

  const storefrontProduct = toStorefrontProduct(product);

  const variant = storefrontProduct.variants.find((item) => item.size === size);

  if (!variant) {
    return {
      productFound: true,
      sizeFound: false,
      availableQuantity: 0,
    };
  }

  return {
    productFound: true,
    sizeFound: true,
    availableQuantity: variant.availableQuantity,
  };
}

/*
 * Existing localStorage data may have been created
 * before inventory validation existed.
 *
 * Normalize it when hydrating:
 * - remove invalid products
 * - remove invalid sizes
 * - remove zero/negative quantities
 * - cap quantities at available inventory
 */
function normalizeCartLines(lines: CartLine[]): CartLine[] {
  const normalized: CartLine[] = [];

  for (const line of lines) {
    if (
      !line ||
      typeof line.productId !== "string" ||
      typeof line.size !== "string" ||
      !Number.isFinite(line.quantity)
    ) {
      continue;
    }

    if (line.quantity <= 0) {
      continue;
    }

    const stock = getAvailableQuantity(line.productId, line.size);

    if (
      !stock.productFound ||
      !stock.sizeFound ||
      stock.availableQuantity <= 0
    ) {
      continue;
    }

    const quantity = Math.min(
      Math.floor(line.quantity),
      stock.availableQuantity,
    );

    if (quantity <= 0) {
      continue;
    }

    normalized.push({
      productId: line.productId,
      size: line.size,
      quantity,
    });
  }

  return normalized;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const [saved, setSaved] = useState<string[]>([]);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedLines = read<CartLine[]>(CART_KEY, []);

    const storedSaved = read<string[]>(SAVED_KEY, []);

    setLines(normalizeCartLines(storedLines));

    setSaved(storedSaved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  const add = useCallback(
    (productId: string, size: string, quantity = 1): CartAddResult => {
      const requestedQuantity = Math.max(1, Math.floor(quantity));

      const stock = getAvailableQuantity(productId, size);

      if (!stock.productFound) {
        return {
          ok: false,
          reason: "PRODUCT_NOT_FOUND",
          availableQuantity: 0,
        };
      }

      if (!stock.sizeFound) {
        return {
          ok: false,
          reason: "SIZE_NOT_FOUND",
          availableQuantity: 0,
        };
      }

      if (stock.availableQuantity <= 0) {
        return {
          ok: false,
          reason: "SOLD_OUT",
          availableQuantity: 0,
        };
      }

      let result: CartAddResult | null = null;

      setLines((previous) => {
        const existing = previous.find(
          (line) => line.productId === productId && line.size === size,
        );

        const currentQuantity = existing?.quantity ?? 0;

        const remainingQuantity = Math.max(
          0,
          stock.availableQuantity - currentQuantity,
        );

        if (remainingQuantity <= 0) {
          result = {
            ok: false,
            reason: "MAX_QUANTITY_REACHED",
            availableQuantity: stock.availableQuantity,
          };

          return previous;
        }

        const quantityToAdd = Math.min(requestedQuantity, remainingQuantity);

        if (existing) {
          result = {
            ok: true,
            addedQuantity: quantityToAdd,
            availableQuantity: stock.availableQuantity,
          };

          return previous.map((line) =>
            line === existing
              ? {
                  ...line,
                  quantity: line.quantity + quantityToAdd,
                }
              : line,
          );
        }

        result = {
          ok: true,
          addedQuantity: quantityToAdd,
          availableQuantity: stock.availableQuantity,
        };

        return [
          ...previous,
          {
            productId,
            size,
            quantity: quantityToAdd,
          },
        ];
      });

      /*
       * React state updates are scheduled, but the updater
       * above executes synchronously during the update path.
       * The fallback protects the public result contract.
       */
      return (
        result ?? {
          ok: false,
          reason: "MAX_QUANTITY_REACHED",
          availableQuantity: stock.availableQuantity,
        }
      );
    },
    [],
  );

  const setQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        setLines((previous) =>
          previous.filter(
            (line) => !(line.productId === productId && line.size === size),
          ),
        );

        return;
      }

      const stock = getAvailableQuantity(productId, size);

      if (
        !stock.productFound ||
        !stock.sizeFound ||
        stock.availableQuantity <= 0
      ) {
        setLines((previous) =>
          previous.filter(
            (line) => !(line.productId === productId && line.size === size),
          ),
        );

        return;
      }

      const safeQuantity = Math.min(
        Math.floor(quantity),
        stock.availableQuantity,
      );

      setLines((previous) =>
        previous.map((line) =>
          line.productId === productId && line.size === size
            ? {
                ...line,
                quantity: safeQuantity,
              }
            : line,
        ),
      );
    },
    [],
  );

  const remove = useCallback((productId: string, size: string) => {
    setLines((previous) =>
      previous.filter(
        (line) => !(line.productId === productId && line.size === size),
      ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const toggleSaved = useCallback((productId: string) => {
    setSaved((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId],
    );
  }, []);

  const value = useMemo<CartValue>(
    () => ({
      lines,
      saved,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
      toggleSaved,
      isSaved: (id: string) => saved.includes(id),
    }),
    [lines, saved, add, setQuantity, remove, clear, toggleSaved],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

/*
 * Flat delivery fee for the current frontend MVP.
 * Fulfillment-specific pricing will move into the
 * checkout/domain layer later.
 */
export const DELIVERY_FEE = 10_000;
