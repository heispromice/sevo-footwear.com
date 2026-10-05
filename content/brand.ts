/**
 * SEVO brand content.
 * Content is deliberately separated from presentation so it can move to a CMS
 * or Lovable Cloud table later without touching component code.
 */

export const brand = {
  name: "SEVO",
  tagline: "Selective essentials. Real stories.",
  campaignLine: "Not everything. Just what matters.",
  origin: "Born in Tanzania. Built with a global perspective.",
  currency: "TZS",
  homepage: {
    heroTitleLines: ["Selective", "Essentials."],
    heroSecondary: "Real stories.",
    heroCopy:
      "A curated selection of sneakers chosen for design, character and everyday relevance.",
    primaryCta: "Explore the selection",
    secondaryCta: "The SEVO story",
    selectionTitle: "The Selection",
    selectionSupport: "Not everything makes it in.",
  },
  about: {
    headlineLines: ["Not everything.", "Just what matters."],
    body: [
      "SEVO was created around a simple belief: good style is not about having more. It is about knowing what deserves your attention.",
      "We curate sneakers with intention. Every selection has a reason. Every product has a story.",
      "Some silhouettes disappear. Others stay. We are interested in the ones that stay.",
    ],
  },
  /** The internal selection framework, shown as an editorial system. */
  curationIndex: [
    {
      title: "Form",
      note: "Proportion, line and silhouette before hype.",
    },
    {
      title: "Versatility",
      note: "It has to work on an ordinary Tuesday.",
    },
    { title: "Quality", note: "Materials and construction we can stand behind." },
    { title: "Story", note: "Where it came from, and why it lasted." },
    { title: "Distinctiveness", note: "Recognisable without shouting." },
    { title: "Cultural relevance", note: "Read correctly in Dar es Salaam and abroad." },
    { title: "SEVO fit", note: "It belongs beside everything else we selected." },
  ],
  footerNote:
    "DEMO DATA — sample products and stories are for demonstration only and are not available for sale.",
} as const;

export const navigation = {
  primary: [
    { label: "Shop", to: "/shop" as const },
    { label: "Selection", to: "/selection" as const },
    { label: "Stories", to: "/stories" as const },
    { label: "About", to: "/about" as const },
  ],
};
