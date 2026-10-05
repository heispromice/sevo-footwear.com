export const collections = [
  { slug: "retro-runners", label: "Retro Runners" },
  { slug: "lifestyle", label: "Lifestyle" },
  { slug: "minimal-leather", label: "Minimal Leather" },
  { slug: "technical-mesh", label: "Technical / Mesh" },
  { slug: "skate", label: "Skate" },
  { slug: "basketball", label: "Basketball" },
  { slug: "football", label: "Football" },
  { slug: "trail-outdoor", label: "Trail / Outdoor" },
  { slug: "dad-sneakers", label: "Dad Sneakers" },
  { slug: "future", label: "Future" },
  { slug: "vintage", label: "Vintage" },
] as const;

export type CollectionSlug = (typeof collections)[number]["slug"];

export function collectionLabel(slug: string): string {
  return collections.find((c) => c.slug === slug)?.label ?? slug;
}
