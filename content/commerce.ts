/**
 * SEVO Commerce Domain Model
 *
 * This file defines the concepts shared by:
 * - the current frontend mock implementation
 * - the future Laravel API
 * - the future MySQL schema
 *
 * Keep public storefront data separate from internal operational data.
 */

export const CURRENCY = "TZS" as const;

export const DELIVERY_FEE = 10_000;

export const DEFAULT_LOW_STOCK_THRESHOLD = 2;

export const RESERVATION_DURATION_MINUTES = 60;

export type ProductPublicationStatus =
  | "DRAFT"
  | "REVIEW"
  | "SELECTED"
  | "LIVE"
  | "ARCHIVED";

export type ProductType = "CURATED" | "ORIGINAL";

export type ProductAvailability =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "SOLD_OUT";

export type FulfillmentMethod = "DELIVERY" | "PICKUP";

export type PaymentStatus =
  | "PENDING"
  | "SUBMITTED"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED"
  | "REFUNDED";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_VERIFIED"
  | "PROCESSING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COLLECTED"
  | "PAYMENT_EXPIRED"
  | "PAYMENT_REJECTED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURN_APPROVED"
  | "RETURNED"
  | "REFUNDED";

export type ReservationStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "RELEASED"
  | "CONVERTED";

export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "RETURNED"
  | "REFUNDED";

export interface FitProfile {
  recommendation: string;
  fit: "TRUE_TO_SIZE" | "SMALL" | "LARGE" | "UNKNOWN";
  width: "NARROW" | "STANDARD" | "WIDE" | "UNKNOWN";
  betweenSizes: "SIZE_UP" | "SIZE_DOWN" | "USE_USUAL_SIZE" | "UNKNOWN";
  footLengthCm?: {
    min?: number;
    max?: number;
  };
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  sizeSystem: "EU";
  size: string;
}

export interface InventorySnapshot {
  variantId: string;
  onHand: number;
  reserved: number;
}

export interface StorefrontVariant {
  id: string;
  sizeSystem: "EU";
  size: string;
  availableQuantity: number;
  available: boolean;
  availability: ProductAvailability;
}

export interface StorefrontProduct {
  id: string;
  number: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  type: ProductType;
  collection: string;
  price: number;
  currency: typeof CURRENCY;
  images: string[];
  shortStatement: string;
  description: string;
  story: string;
  whySelected: string;
  design: string;
  material: string;
  heritage: string;
  howToWear: string;
  sevoTake: string;
  publicationStatus: ProductPublicationStatus;
  availability: ProductAvailability;
  variants: StorefrontVariant[];
  fit?: FitProfile;
  dateAdded: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  region: string;
  district: string;
  ward?: string;
  street?: string;
  addressLine: string;
  deliveryNotes?: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  instructions?: string;
  active: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface WishlistItem {
  id: string;
  customerId: string;
  productId: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  productNumber: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InventoryReservation {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  status: ReservationStatus;
  reservedAt: string;
  expiresAt: string;
}

export interface PaymentSubmission {
  id: string;
  orderId: string;
  method: "LIPA_NUMBER";
  transactionReference: string;
  payerPhone: string;
  receiptImageUrl?: string;
  submittedAt: string;
  status: PaymentStatus;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  guestEmail?: string;
  guestPhone?: string;
  items: OrderItem[];
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress?: Address;
  pickupLocationId?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: typeof CURRENCY;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  reservedUntil?: string;
  receivedAt?: string;
  returnWindowEndsAt?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId?: string;
  reason: string;
  status: ReturnStatus;
  requestedAt: string;
  approvedAt?: string;
  returnedAt?: string;
  refundedAt?: string;
}

/**
 * Publication status is derived separately from inventory state.
 */
export function publicationStatusFromLegacyStatus(
  status: string,
): ProductPublicationStatus {
  switch (status) {
    case "DRAFT":
      return "DRAFT";
    case "REVIEW":
      return "REVIEW";
    case "SELECTED":
      return "SELECTED";
    case "ARCHIVED":
      return "ARCHIVED";
    case "LIVE":
    case "LOW STOCK":
    case "SOLD OUT":
    default:
      return "LIVE";
  }
}

/**
 * Inventory state is always derived from available units.
 */
export function deriveAvailability(
  onHand: number,
  reserved = 0,
  lowStockThreshold = DEFAULT_LOW_STOCK_THRESHOLD,
): ProductAvailability {
  const available = Math.max(0, onHand - reserved);

  if (available === 0) {
    return "SOLD_OUT";
  }

  if (available <= lowStockThreshold) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

export function availableQuantity(
  onHand: number,
  reserved = 0,
): number {
  return Math.max(0, onHand - reserved);
}

export function reservationExpiry(from: Date = new Date()): Date {
  return new Date(
    from.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000,
  );
}

export function returnWindowEnd(receivedAt: Date): Date {
  const end = new Date(receivedAt);
  end.setDate(end.getDate() + 3);
  return end;
}
