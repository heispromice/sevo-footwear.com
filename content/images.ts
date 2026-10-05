/**
 * Central image registry.
 * Components never reference asset paths directly — they look
 * up a key here.
 */

export const images = {
  heroEditorial: "/assets/hero-editorial.jpg",
  product001: "/assets/product-001.jpg",
  product002: "/assets/product-002.jpg",
  product003: "/assets/product-003.jpg",
  product004: "/assets/product-004.jpg",
  product005: "/assets/product-005.jpg",
  product006: "/assets/product-006.jpg",
  product007: "/assets/product-007.jpg",
  textureDetail: "/assets/texture-detail.jpg",
  storyCity: "/assets/story-city.jpg",
  storyArchitecture: "/assets/story-architecture.jpg",
  storyCare: "/assets/story-care.jpg",
} as const;

export type ImageKey = keyof typeof images;

export function imageSrc(key: ImageKey): string {
  return images[key];
}

/** Safe lookup for optional/indexed keys. Falls back to the campaign image. */
export function imageFor(key: ImageKey | undefined): string {
  return key ? images[key] : images.heroEditorial;
}
