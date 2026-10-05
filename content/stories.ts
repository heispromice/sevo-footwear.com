import type { ImageKey } from "./images";

export interface Story {
  id: string;
  slug: string;
  title: string;
  category: "Culture" | "Design" | "Materials" | "Places" | "Care" | "SEVO Picks";
  standfirst: string;
  image: ImageKey;
  date: string;
  readTime: string;
  body: string[];
  seo: { title: string; description: string };
}

export const stories: Story[] = [
  {
    id: "s001",
    slug: "why-this-silhouette-matters",
    title: "Why this silhouette matters",
    category: "Design",
    standfirst: "Some silhouettes disappear. Others stay. The difference is rarely the marketing.",
    image: "storyArchitecture",
    date: "2026-03-10",
    readTime: "4 min",
    body: [
      "A shoe shape survives for one of two reasons: it solved a problem properly, or it looked correct on someone people were watching. The shapes that last usually did both.",
      "Proportion is the first test. A silhouette that reads well at a distance — heel height against toe volume, collar against midsole — will still read well in ten years, regardless of the colour it arrived in.",
      "The second test is neutrality. Not blandness, but the ability to sit beside other clothes without arguing. This is why the plainest sneakers in most wardrobes are the ones with the highest wear count.",
      "When we assess a pair for the selection, we look at it in the least flattering situation we can find: flat light, ordinary trousers, a normal street. If it still holds, it earns a number.",
    ],
    seo: {
      title: "Why this silhouette matters — SEVO Stories",
      description:
        "Proportion, neutrality and wear count: how SEVO judges whether a sneaker silhouette will last.",
    },
  },
  {
    id: "s002",
    slug: "dar-es-salaam-on-foot",
    title: "Dar es Salaam, on foot",
    category: "Places",
    standfirst: "Heat, dust, concrete and salt air. A city is a materials test.",
    image: "storyCity",
    date: "2026-03-06",
    readTime: "5 min",
    body: [
      "Sneaker culture is usually described through cities in the northern hemisphere. That is a distribution story, not a cultural one.",
      "Here, footwear is judged by how it survives: sun on the upper, dust in the mesh, humidity in the lining, rain arriving without negotiation. Materials that look luxurious in a showroom sometimes fail in a week.",
      "That informs what we select. Suede is chosen for how it ages, not how it photographs. Outsoles are chosen for grip on wet tile.",
      "Global taste, local conditions. Both have to be satisfied before a pair goes live.",
    ],
    seo: {
      title: "Dar es Salaam, on foot — SEVO Stories",
      description:
        "How a coastal East African city shapes what SEVO selects: materials, outsoles and real wear.",
    },
  },
  {
    id: "s003",
    slug: "how-to-keep-a-pair",
    title: "How to keep a pair",
    category: "Care",
    standfirst: "Buying less only works if what you own survives longer.",
    image: "storyCare",
    date: "2026-02-27",
    readTime: "3 min",
    body: [
      "Brush suede dry before you touch it with water. Most damage happens when dust is pushed into the nap while wet.",
      "Unlace before cleaning. It takes a minute and protects the eyestay, which is where uppers usually fail first.",
      "Dry away from direct sun. Heat shrinks adhesives and hardens foam midsoles far faster than wear does.",
      "Rotate. Two pairs worn alternately will outlast three pairs worn carelessly.",
    ],
    seo: {
      title: "How to keep a pair — SEVO Stories",
      description: "A short, practical care routine for suede, mesh and leather sneakers.",
    },
  },
  {
    id: "s004",
    slug: "the-story-behind-sevo-001",
    title: "The story behind SEVO / 001",
    category: "SEVO Picks",
    standfirst: "The first number we assigned, and the reasoning behind it.",
    image: "textureDetail",
    date: "2026-02-20",
    readTime: "4 min",
    body: [
      "SEVO / 001 is a running shoe that stopped being a running shoe. That transition is the whole reason it exists in the selection.",
      "We looked at eleven candidates for the first number. Most were more recognisable. One was considerably rarer. None were as easy to wear.",
      "The archive number is not a ranking. It is a record of when a pair entered the selection, and it stays with that pair permanently.",
      "Eventually these numbers will include sneakers we make ourselves. The system was built with that in mind.",
    ],
    seo: {
      title: "The story behind SEVO / 001 — SEVO Stories",
      description: "How the first SEVO archive number was assigned, and what the numbering means.",
    },
  },
];

export const storyBySlug = (slug: string) => stories.find((s) => s.slug === slug);
