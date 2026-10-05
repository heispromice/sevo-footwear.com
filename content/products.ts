import type { CollectionSlug } from "./collections";
import type { ImageKey } from "./images";

/**
 * Product / inventory model.
 * Deliberately richer than the storefront needs: the same shape backs the
 * internal review workflow and the future SEVO ORIGINAL product type.
 */
export type InventoryStatus =
  | "DRAFT"
  | "REVIEW"
  | "SELECTED"
  | "LIVE"
  | "LOW STOCK"
  | "SOLD OUT"
  | "ARCHIVED";

export type ProductType = "CURATED" | "ORIGINAL";

export interface SizeStock {
  size: string;
  quantity: number;
}

export interface SelectionScore {
  design: number;
  versatility: number;
  quality: number;
  story: number;
  distinctiveness: number;
  comfort: number;
  aestheticFit: number;
}

export interface Product {
  id: string;
  /** Archive number, e.g. 001 -> "SEVO / 001" */
  number: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  type: ProductType;
  collection: CollectionSlug;
  price: number;
  costPrice: number;
  status: InventoryStatus;
  supplier: string;
  authenticityVerified: boolean;
  images: ImageKey[];
  sizes: SizeStock[];
  shortStatement: string;
  selectedFor: string[];
  description: string;
  story: string;
  whySelected: string;
  design: string;
  material: string;
  heritage: string;
  howToWear: string;
  sevoTake: string;
  score: SelectionScore;
  dateAdded: string;
  seo: { title: string; description: string };
}

const sizes = (available: Record<string, number>): SizeStock[] =>
  ["39", "40", "41", "42", "43", "44", "45"].map((size) => ({
    size,
    quantity: available[size] ?? 0,
  }));

export const products: Product[] = [
  {
    id: "p001",
    number: "001",
    sku: "SEVO-001-RR",
    slug: "the-runner",
    name: "The Runner",
    brand: "Kōda",
    model: "Trackline 82",
    type: "CURATED",
    collection: "retro-runners",
    price: 245000,
    costPrice: 158000,
    status: "LIVE",
    supplier: "Nairobi Archive Sourcing",
    authenticityVerified: true,
    images: ["product001", "textureDetail"],
    sizes: sizes({ "40": 2, "41": 3, "42": 4, "43": 2, "44": 1 }),
    shortStatement: "Built for movement. Kept for the story.",
    selectedFor: ["Form", "Versatility", "Everyday wear"],
    description:
      "A low-profile eighties runner in suede and open mesh, sitting on a slim wedge midsole.",
    story:
      "A silhouette shaped by the evolution of everyday running culture, reinterpreted for contemporary city life. It was never the fastest shoe in its era. It was the one people kept wearing after they stopped running.",
    whySelected:
      "Its balance of proportion, versatility and character makes it more than another everyday runner.",
    design: "Narrow toe, low collar, visible panelling. Nothing added for effect.",
    material: "Brushed suede overlays, open nylon mesh, rubber outsole with segmented tread.",
    heritage: "A training silhouette from the early eighties, largely unchanged since.",
    howToWear: "Cropped denim, flat trousers, anything that lets the sole line read.",
    sevoTake: "The most useful sneaker in the selection, and the least interested in proving it.",
    score: {
      design: 8,
      versatility: 9,
      quality: 8,
      story: 9,
      distinctiveness: 7,
      comfort: 8,
      aestheticFit: 9,
    },
    dateAdded: "2026-01-14",
    seo: {
      title: "SEVO / 001 — The Runner",
      description:
        "An eighties running silhouette selected for proportion, versatility and everyday relevance.",
    },
  },
  {
    id: "p002",
    number: "002",
    sku: "SEVO-002-ML",
    slug: "the-classic",
    name: "The Classic",
    brand: "Alvern",
    model: "Court Plain",
    type: "CURATED",
    collection: "minimal-leather",
    price: 310000,
    costPrice: 201000,
    status: "LIVE",
    supplier: "Lisbon Leather Works",
    authenticityVerified: true,
    images: ["product002", "storyArchitecture"],
    sizes: sizes({ "39": 1, "40": 2, "41": 2, "42": 3, "43": 2, "44": 2 }),
    shortStatement: "Some silhouettes disappear. Others stay.",
    selectedFor: ["Form", "Quality", "Longevity"],
    description: "An unlined court sneaker in full-grain leather with a stitched cup sole.",
    story:
      "The tennis court gave the city its most durable shoe shape. Stripped of branding, it becomes something closer to footwear than sportswear.",
    whySelected:
      "It solves the problem of dressing without thinking, and it improves as the leather creases.",
    design: "Clean quarter panel, low stitch line, no visible logo.",
    material: "Full-grain leather upper, vegetable-tanned lining, stitched rubber cup sole.",
    heritage: "A court shoe pattern in continuous production since the sixties.",
    howToWear: "Tailoring on a weekday. Everything else on a weekend.",
    sevoTake: "Buy once. Wear it until the leather tells your story instead of ours.",
    score: {
      design: 9,
      versatility: 10,
      quality: 9,
      story: 7,
      distinctiveness: 6,
      comfort: 8,
      aestheticFit: 10,
    },
    dateAdded: "2026-01-18",
    seo: {
      title: "SEVO / 002 — The Classic",
      description:
        "A full-grain leather court sneaker selected for form, quality and quiet longevity.",
    },
  },
  {
    id: "p003",
    number: "003",
    sku: "SEVO-003-TR",
    slug: "the-utility",
    name: "The Utility",
    brand: "Ostmark",
    model: "Ridge GT",
    type: "CURATED",
    collection: "trail-outdoor",
    price: 380000,
    costPrice: 249000,
    status: "LOW STOCK",
    supplier: "Kilimanjaro Outfitters",
    authenticityVerified: true,
    images: ["product003", "textureDetail"],
    sizes: sizes({ "42": 1, "43": 1, "44": 1 }),
    shortStatement: "Made for weather. Kept for the shape.",
    selectedFor: ["Distinctiveness", "Quality", "Function"],
    description: "A trail runner with an aggressive lug outsole and a welded mesh upper.",
    story:
      "Designed for wet rock and loose ground, then adopted by people who never leave tarmac. The function stayed useful anyway — in a coastal city, rain is a design brief.",
    whySelected:
      "Technical footwear rarely looks this restrained. The colour discipline is what earned it a number.",
    design: "Low stack, welded overlays, exposed lugs. Function with an edited surface.",
    material: "Welded engineered mesh, TPU cage, high-abrasion rubber outsole.",
    heritage: "A mountain-running lineage adapted for city wear.",
    howToWear: "Wide trousers, cuffs slightly short, so the outsole stays visible.",
    sevoTake: "The one to wear when the road is honest about the weather.",
    score: {
      design: 8,
      versatility: 7,
      quality: 9,
      story: 7,
      distinctiveness: 9,
      comfort: 9,
      aestheticFit: 8,
    },
    dateAdded: "2026-02-02",
    seo: {
      title: "SEVO / 003 — The Utility",
      description: "A restrained technical trail runner selected for function and distinctiveness.",
    },
  },
  {
    id: "p004",
    number: "004",
    sku: "SEVO-004-FU",
    slug: "the-future",
    name: "The Future",
    brand: "Nyx Form",
    model: "Monocast",
    type: "CURATED",
    collection: "future",
    price: 465000,
    costPrice: 302000,
    status: "LIVE",
    supplier: "Rotterdam Concept Studio",
    authenticityVerified: true,
    images: ["product004", "storyArchitecture"],
    sizes: sizes({ "40": 1, "41": 2, "42": 2, "43": 2 }),
    shortStatement: "One piece. One line.",
    selectedFor: ["Form", "Distinctiveness", "Construction"],
    description: "A seamless knit upper mounted on a single-piece sculpted midsole.",
    story:
      "Fewer parts, fewer seams, fewer decisions. This is what happens when a sneaker is designed as one object rather than assembled from panels.",
    whySelected:
      "It shows where footwear construction is heading without turning the wearer into a mannequin.",
    design: "Continuous knit upper, sculpted midsole, no external branding.",
    material: "Recycled knit yarn, injected foam midsole, thin rubber contact pads.",
    heritage: "A contemporary construction lineage, not a reissue.",
    howToWear: "Simple, monochrome, nothing competing with the sole profile.",
    sevoTake: "The only shoe here that argues with the past.",
    score: {
      design: 9,
      versatility: 7,
      quality: 8,
      story: 8,
      distinctiveness: 10,
      comfort: 9,
      aestheticFit: 9,
    },
    dateAdded: "2026-02-11",
    seo: {
      title: "SEVO / 004 — The Future",
      description:
        "A single-piece sculpted sneaker selected for construction and formal distinctiveness.",
    },
  },
  {
    id: "p005",
    number: "005",
    sku: "SEVO-005-BB",
    slug: "the-heritage",
    name: "The Heritage",
    brand: "Vale & Co",
    model: "Hardwood Hi",
    type: "CURATED",
    collection: "basketball",
    price: 295000,
    costPrice: 189000,
    status: "LIVE",
    supplier: "Cape Town Vintage Trade",
    authenticityVerified: true,
    images: ["product005", "storyCity"],
    sizes: sizes({ "41": 2, "42": 2, "43": 3, "44": 1 }),
    shortStatement: "A court shoe that outlived the court.",
    selectedFor: ["Story", "Cultural relevance", "Form"],
    description: "A suede high-top with a vulcanised sole and a padded collar.",
    story:
      "It arrived as basketball equipment and left as a cultural object. Local courts, borrowed pairs, worn heels — the shape carries more history than most archives.",
    whySelected: "The proportion is still right, and the suede ages the way we want it to.",
    design: "High collar, wide toe box, gum-adjacent vulcanised sole.",
    material: "Heavy suede upper, canvas lining, vulcanised rubber sole.",
    heritage: "A seventies indoor basketball pattern.",
    howToWear: "Loose trousers stacked slightly over the collar.",
    sevoTake: "Wear the scuffs. They are the point.",
    score: {
      design: 8,
      versatility: 7,
      quality: 8,
      story: 10,
      distinctiveness: 8,
      comfort: 7,
      aestheticFit: 9,
    },
    dateAdded: "2026-02-19",
    seo: {
      title: "SEVO / 005 — The Heritage",
      description: "A suede basketball high-top selected for story, proportion and cultural weight.",
    },
  },
  {
    id: "p006",
    number: "006",
    sku: "SEVO-006-DS",
    slug: "the-volume",
    name: "The Volume",
    brand: "Kōda",
    model: "Massif",
    type: "CURATED",
    collection: "dad-sneakers",
    price: 340000,
    costPrice: 221000,
    status: "LIVE",
    supplier: "Nairobi Archive Sourcing",
    authenticityVerified: true,
    images: ["product006", "textureDetail"],
    sizes: sizes({ "40": 1, "41": 1, "42": 2, "43": 2, "45": 1 }),
    shortStatement: "Weight, handled carefully.",
    selectedFor: ["Distinctiveness", "Proportion", "Comfort"],
    description: "A layered nineties trainer with a stacked midsole and mixed-material panels.",
    story:
      "The nineties built shoes for suburbs and shopping centres. Cut the colour out and what remains is an unusually confident piece of industrial design.",
    whySelected:
      "Volume is easy to get wrong. This pair keeps the mass low and the panelling legible.",
    design: "Stacked midsole, layered mesh and suede panels, wide stance.",
    material: "Suede, mesh, synthetic overlays, EVA midsole.",
    heritage: "A late-nineties training silhouette.",
    howToWear: "Straight-leg denim. Let the sole carry the outfit.",
    sevoTake: "The heaviest shoe here, and somehow the easiest to wear.",
    score: {
      design: 7,
      versatility: 7,
      quality: 8,
      story: 7,
      distinctiveness: 9,
      comfort: 9,
      aestheticFit: 8,
    },
    dateAdded: "2026-02-24",
    seo: {
      title: "SEVO / 006 — The Volume",
      description: "A nineties layered trainer selected for proportion, comfort and quiet volume.",
    },
  },
  {
    id: "p007",
    number: "007",
    sku: "SEVO-007-SK",
    slug: "the-flat",
    name: "The Flat",
    brand: "Bloc",
    model: "Deck Low",
    type: "CURATED",
    collection: "skate",
    price: 165000,
    costPrice: 98000,
    status: "LIVE",
    supplier: "Dar Skate Supply",
    authenticityVerified: true,
    images: ["product007", "storyCity"],
    sizes: sizes({ "39": 2, "40": 2, "41": 3, "42": 3, "43": 2, "44": 2 }),
    shortStatement: "The cheapest thing here. Not the least considered.",
    selectedFor: ["Versatility", "Value", "Form"],
    description: "A flat-soled canvas low-top with a reinforced toe and a single stitch line.",
    story:
      "Skate shoes were built to be destroyed and replaced. That honesty is why the shape never needed updating.",
    whySelected: "It proves that selection is not the same as price.",
    design: "Flat vulcanised sole, plain canvas quarter, minimal branding.",
    material: "Heavyweight cotton canvas, vulcanised rubber sole, cotton laces.",
    heritage: "A deck shoe pattern from the early eighties.",
    howToWear: "Everything. That is the argument.",
    sevoTake: "Selected for its balance of form and everyday wear.",
    score: {
      design: 7,
      versatility: 10,
      quality: 7,
      story: 8,
      distinctiveness: 6,
      comfort: 7,
      aestheticFit: 9,
    },
    dateAdded: "2026-03-01",
    seo: {
      title: "SEVO / 007 — The Flat",
      description: "A canvas skate low-top selected for versatility, form and honest construction.",
    },
  },
  {
    id: "p008",
    number: "008",
    sku: "SEVO-008-LS",
    slug: "the-everyday",
    name: "The Everyday",
    brand: "Alvern",
    model: "City Runner",
    type: "CURATED",
    collection: "lifestyle",
    price: 225000,
    costPrice: 141000,
    status: "LIVE",
    supplier: "Lisbon Leather Works",
    authenticityVerified: true,
    images: ["product001", "storyArchitecture"],
    sizes: sizes({ "40": 2, "41": 2, "42": 2, "43": 1 }),
    shortStatement: "Chosen for the ordinary days.",
    selectedFor: ["Versatility", "Comfort", "Form"],
    description: "A soft-structured lifestyle runner in mixed suede and mesh.",
    story:
      "Not a performance shoe pretending otherwise. It was drawn for pavements, queues, long walks and warm afternoons.",
    whySelected: "It is the pair most people will actually reach for, and it holds its shape.",
    design: "Rounded silhouette, low heel drop, muted panelling.",
    material: "Suede, mesh, foam midsole, rubber outsole.",
    heritage: "A contemporary city-walking interpretation of a running last.",
    howToWear: "Whatever the day already required.",
    sevoTake: "Quiet, and slightly underrated.",
    score: {
      design: 7,
      versatility: 9,
      quality: 7,
      story: 6,
      distinctiveness: 6,
      comfort: 9,
      aestheticFit: 8,
    },
    dateAdded: "2026-03-04",
    seo: {
      title: "SEVO / 008 — The Everyday",
      description: "A soft lifestyle runner selected for comfort, versatility and restraint.",
    },
  },
  {
    id: "p009",
    number: "009",
    sku: "SEVO-009-VN",
    slug: "the-archive",
    name: "The Archive",
    brand: "Vale & Co",
    model: "Terrace 79",
    type: "CURATED",
    collection: "vintage",
    price: 420000,
    costPrice: 268000,
    status: "LOW STOCK",
    supplier: "Cape Town Vintage Trade",
    authenticityVerified: true,
    images: ["product005", "textureDetail"],
    sizes: sizes({ "42": 1, "43": 1 }),
    shortStatement: "Limited selection. Not a marketing device.",
    selectedFor: ["Story", "Distinctiveness", "Rarity"],
    description: "A deadstock terrace silhouette in aged suede with original tooling.",
    story:
      "Terrace culture treated sneakers as identity long before resale existed. This pair survived it — sole intact, suede softened.",
    whySelected: "Rarity alone is not a reason. The shape is.",
    design: "Slim last, low collar, three-panel construction.",
    material: "Aged suede, original gum outsole, textile lining.",
    heritage: "A late-seventies European terrace model.",
    howToWear: "Sparingly, and with respect for the sole.",
    sevoTake: "We only have two pairs. When they are gone, the number closes.",
    score: {
      design: 9,
      versatility: 6,
      quality: 7,
      story: 10,
      distinctiveness: 9,
      comfort: 6,
      aestheticFit: 9,
    },
    dateAdded: "2026-03-09",
    seo: {
      title: "SEVO / 009 — The Archive",
      description: "A deadstock terrace silhouette selected for story, shape and genuine rarity.",
    },
  },
  {
    id: "p010",
    number: "010",
    sku: "SEVO-010-TM",
    slug: "the-technical",
    name: "The Technical",
    brand: "Nyx Form",
    model: "Weld Mesh",
    type: "CURATED",
    collection: "technical-mesh",
    price: 355000,
    costPrice: 230000,
    status: "SOLD OUT",
    supplier: "Rotterdam Concept Studio",
    authenticityVerified: true,
    images: ["product003", "storyCity"],
    sizes: sizes({}),
    shortStatement: "Engineered, not decorated.",
    selectedFor: ["Construction", "Distinctiveness", "Form"],
    description: "A translucent mesh runner with welded structural taping.",
    story:
      "Transparency as construction rather than gimmick: the internal cage is the design, and the upper simply lets you see it.",
    whySelected: "It reads as an object first and a sneaker second.",
    design: "Translucent upper, exposed internal cage, minimal seams.",
    material: "Translucent engineered mesh, welded TPU tape, foam midsole.",
    heritage: "A contemporary technical lineage.",
    howToWear: "Dark, simple, uninterrupted.",
    sevoTake: "Gone for now. It will return when the right pairs surface.",
    score: {
      design: 9,
      versatility: 6,
      quality: 8,
      story: 7,
      distinctiveness: 9,
      comfort: 8,
      aestheticFit: 8,
    },
    dateAdded: "2026-03-12",
    seo: {
      title: "SEVO / 010 — The Technical",
      description: "A welded technical mesh runner selected for construction and formal clarity.",
    },
  },
];

export const sevoNumber = (product: Product) => `SEVO / ${product.number}`;

export const totalStock = (product: Product) =>
  product.sizes.reduce((sum, s) => sum + s.quantity, 0);

export const isLimited = (product: Product) => {
  const stock = totalStock(product);
  return stock > 0 && stock <= 4;
};

export const liveProducts = () =>
  products.filter((p) =>
    ["LIVE", "LOW STOCK", "SOLD OUT"].includes(p.status),
  );

export const featuredProducts = () => liveProducts().slice(0, 6);

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const selectionScoreAverage = (score: Product["score"]) => {
  const values = Object.values(score);
  return values.reduce((a, b) => a + b, 0) / values.length;
};
