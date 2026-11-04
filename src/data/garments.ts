import type { ActiveSlot, Garment, GarmentSlot } from "@/lib/types";
import { viewsFor } from "@/lib/views";

/**
 * Equipment slots supported by the fitting room architecture.
 * Currently active in the UI: "tshirt" and "jogger".
 * Reserved for future releases: "shoes", "totebag", "accessory".
 */
export const ACTIVE_SLOTS: readonly ActiveSlot[] = ["tshirt", "jogger"] as const;

export const FUTURE_SLOTS: readonly Exclude<GarmentSlot, ActiveSlot>[] = [
  "shoes",
  "totebag",
  "accessory",
] as const;

export const SLOT_LABELS: Record<GarmentSlot, string> = {
  tshirt: "T-Shirt",
  jogger: "Jogger",
  shoes: "Shoes",
  totebag: "Tote Bag",
  accessory: "Accessory",
};

/**
 * The garment collection. Currently consists of t-shirts and joggers
 * positioned to layer cleanly over the stickman figure across all four views.
 */
export const garments: Garment[] = [
  {
    slug: "box-tee-chalk",
    name: "Box Tee",
    collection: "Essentials",
    category: "tshirt",
    description:
      "Square through the body with a ribbed neck that holds its shape. Heavyweight compact cotton.",
    colorway: "Chalk",
    swatch: "#f2f2f0",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["240gsm compact cotton"],
    price: 85,
    featured: true,
    views: viewsFor("box-tee-chalk", "Box Tee (Chalk)"),
  },
  {
    slug: "heavy-tee-onyx",
    name: "Heavyweight Studio Tee",
    collection: "Volume I",
    category: "tshirt",
    description:
      "Dropped-shoulder boxy silhouette in pigment-dyed organic jersey. Crisp drape over the frame.",
    colorway: "Onyx",
    swatch: "#1c1c1c",
    sizes: ["S", "M", "L", "XL"],
    materials: ["280gsm organic cotton jersey"],
    price: 95,
    featured: true,
    views: viewsFor("heavy-tee-onyx", "Heavyweight Studio Tee (Onyx)"),
  },
  {
    slug: "studio-tee-ash",
    name: "Relaxed Crew Tee",
    collection: "Essentials",
    category: "tshirt",
    description:
      "Soft brushed cotton tee with double-needle stitch work and a relaxed everyday cut.",
    colorway: "Ash",
    swatch: "#a8a8a4",
    sizes: ["XS", "S", "M", "L"],
    materials: ["220gsm combed cotton"],
    price: 80,
    views: viewsFor("studio-tee-ash", "Relaxed Crew Tee (Ash)"),
  },
  {
    slug: "fleece-jogger-onyx",
    name: "Heavy Fleece Jogger",
    collection: "Essentials",
    category: "jogger",
    description:
      "Structured loopback fleece jogger with an elasticated drawstring waist and tapered ankle cuffs.",
    colorway: "Onyx",
    swatch: "#222222",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["420gsm loopback cotton fleece"],
    price: 160,
    featured: true,
    views: viewsFor("fleece-jogger-onyx", "Heavy Fleece Jogger (Onyx)"),
  },
  {
    slug: "relaxed-jogger-heather",
    name: "Relaxed Lounge Jogger",
    collection: "Volume I",
    category: "jogger",
    description:
      "Wide-cut athletic trouser with deep side-seam pockets and a clean gathered cuff.",
    colorway: "Heather Grey",
    swatch: "#c2c2be",
    sizes: ["S", "M", "L", "XL"],
    materials: ["380gsm brushed cotton"],
    price: 150,
    views: viewsFor("relaxed-jogger-heather", "Relaxed Lounge Jogger (Heather)"),
  },
  {
    slug: "cargo-jogger-stone",
    name: "Technical Utility Jogger",
    collection: "Volume I",
    category: "jogger",
    description:
      "Articulated knee darts and flush side pockets in crisp cotton-nylon twill.",
    colorway: "Stone",
    swatch: "#deded8",
    sizes: ["XS", "S", "M", "L"],
    materials: ["Cotton-nylon twill", "Elasticated cuff"],
    price: 185,
    views: viewsFor("cargo-jogger-stone", "Technical Utility Jogger (Stone)"),
  },
];

export function garmentBySlug(slug: string): Garment | undefined {
  return garments.find((g) => g.slug === slug);
}

export function garmentsBySlot(
  all: Garment[],
  slot: GarmentSlot,
): Garment[] {
  return all.filter((g) => g.category === slot);
}
