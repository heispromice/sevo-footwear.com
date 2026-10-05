import {
  availableQuantity,
  deriveAvailability,
  publicationStatusFromLegacyStatus,
  type FitProfile,
  type StorefrontProduct,
} from "./commerce";
import type { Product } from "./products";

const DEFAULT_FIT: FitProfile = {
  recommendation: "Select your usual EU size.",
  fit: "UNKNOWN",
  width: "UNKNOWN",
  betweenSizes: "UNKNOWN",
};

export function toStorefrontProduct(
  product: Product,
): StorefrontProduct {
  const variants = product.sizes.map((size) => {
    const variantId = `${product.id}-EU-${size.size}`;
    const quantity = availableQuantity(size.quantity, 0);

    return {
      id: variantId,
      sizeSystem: "EU" as const,
      size: size.size,
      availableQuantity: quantity,
      available: quantity > 0,
      availability: deriveAvailability(quantity),
    };
  });

  const totalAvailable = variants.reduce(
    (sum, variant) => sum + variant.availableQuantity,
    0,
  );

  const availability = deriveAvailability(totalAvailable);

  return {
    id: product.id,
    number: product.number,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    model: product.model,
    type: product.type,
    collection: product.collection,
    price: product.price,
    currency: "TZS",
    images: product.images,
    shortStatement: product.shortStatement,
    description: product.description,
    story: product.story,
    whySelected: product.whySelected,
    design: product.design,
    material: product.material,
    heritage: product.heritage,
    howToWear: product.howToWear,
    sevoTake: product.sevoTake,
    publicationStatus:
      publicationStatusFromLegacyStatus(product.status),
    availability,
    variants,
    fit: DEFAULT_FIT,
    dateAdded: product.dateAdded,
    seo: product.seo,
  };
}
