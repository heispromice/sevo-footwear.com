import { products, type Product } from "@/content/products";

export type CustomerOrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_VERIFIED"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "READY_FOR_PICKUP"
  | "DELIVERED"
  | "COLLECTED"
  | "NEEDS_CORRECTION"
  | "EXPIRED"
  | "CANCELLED";

export type OrderFulfillment = "DELIVERY" | "PICKUP";

export interface PreviewOrderItem {
  productId: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface PreviewOrder {
  id: string;
  displayNumber: string;
  status: CustomerOrderStatus;
  fulfillment: OrderFulfillment;
  createdAt: string;

  paymentReference?: string;
  paymentSubmittedAt?: string;

  subtotal: number;
  deliveryFee: number;
  total: number;

  items: PreviewOrderItem[];

  customer: {
    name: string;
    email: string;
    phone: string;
  };

  deliveryAddress?: {
    address: string;
    city: string;
    region: string;
    notes?: string;
  };

  pickupLocation?: {
    name: string;
    city: string;
  };

  reservationExpiresAt?: string;
  returnEligibleUntil?: string;
}

const previewOrders: PreviewOrder[] = [
  {
    id: "preview-order-1001",
    displayNumber: "SEVO-1001",
    status: "PROCESSING",
    fulfillment: "DELIVERY",
    createdAt: "2026-09-28T10:15:00+03:00",

    paymentReference: "VODACOM-DEMO-38172",
    paymentSubmittedAt: "2026-09-28T10:32:00+03:00",

    subtotal: 245000,
    deliveryFee: 10000,
    total: 255000,

    items: [
      {
        productId: "p001",
        size: "42",
        quantity: 1,
        unitPrice: 245000,
      },
    ],

    customer: {
      name: "Preview Customer",
      email: "customer@example.com",
      phone: "+255 700 000 000",
    },

    deliveryAddress: {
      address: "Development Address",
      city: "Dar es Salaam",
      region: "Dar es Salaam",
      notes: "Development preview order.",
    },

    returnEligibleUntil: "2026-10-01T18:00:00+03:00",
  },

  {
    id: "preview-order-1002",
    displayNumber: "SEVO-1002",
    status: "READY_FOR_PICKUP",
    fulfillment: "PICKUP",
    createdAt: "2026-09-25T14:20:00+03:00",

    paymentReference: "VODACOM-DEMO-49210",
    paymentSubmittedAt: "2026-09-25T14:42:00+03:00",

    subtotal: 310000,
    deliveryFee: 0,
    total: 310000,

    items: [
      {
        productId: "p002",
        size: "41",
        quantity: 1,
        unitPrice: 310000,
      },
    ],

    customer: {
      name: "Preview Customer",
      email: "customer@example.com",
      phone: "+255 700 000 000",
    },

    pickupLocation: {
      name: "SEVO — Mlimani City",
      city: "Dar es Salaam",
    },

    returnEligibleUntil: "2026-09-30T18:00:00+03:00",
  },
];

export function previewOrderById(id: string): PreviewOrder | undefined {
  return previewOrders.find((order) => order.id === id);
}

export function previewOrderByDisplayNumber(
  displayNumber: string,
): PreviewOrder | undefined {
  const normalized = displayNumber.trim().toLowerCase();

  return previewOrders.find(
    (order) => order.displayNumber.toLowerCase() === normalized,
  );
}

export function previewOrdersForCustomer(): PreviewOrder[] {
  return previewOrders;
}

export function previewProductById(productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}
