import type { Garment } from "@/lib/types";
import { viewsFor } from "@/lib/views";

/**
 * The catalog. One entry per garment; images live in
 * public/garments/<slug>/{front,back,left,right}.png as transparent cutouts.
 *
 * To add a garment: drop the four PNGs in a new folder, then add an entry here.
 */
export const garments: Garment[] = [
  {
    slug: "linen-overshirt",
    name: "Linen Overshirt",
    collection: "Volume I",
    category: "outerwear",
    description:
      "A boxy overshirt in heavy washed linen. Dropped shoulder, patch pockets, corozo buttons. Cut to be worn open over everything.",
    colorway: "Bone",
    swatch: "#ddd5c7",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["100% washed linen", "Corozo buttons"],
    price: 240,
    featured: true,
    views: viewsFor("linen-overshirt", "Linen Overshirt"),
  },
  {
    slug: "utility-jacket",
    name: "Cropped Utility Jacket",
    collection: "Volume I",
    category: "outerwear",
    description:
      "Cropped at the hip with a cinched back yoke. Garment-dyed cotton canvas that softens with wear.",
    colorway: "Olive Drab",
    swatch: "#6b7257",
    sizes: ["S", "M", "L", "XL"],
    materials: ["Garment-dyed cotton canvas", "Antique brass hardware"],
    price: 320,
    featured: true,
    views: viewsFor("utility-jacket", "Cropped Utility Jacket"),
  },
  {
    slug: "wide-leg-trouser",
    name: "Wide Leg Trouser",
    collection: "Volume I",
    category: "bottom",
    description:
      "A full, fluid leg with a single front pleat and a hidden hook closure. Sits at the natural waist.",
    colorway: "Ink",
    swatch: "#2b2f3a",
    sizes: ["XS", "S", "M", "L"],
    materials: ["Wool-viscose suiting", "Cupro lining"],
    price: 280,
    views: viewsFor("wide-leg-trouser", "Wide Leg Trouser"),
  },
  {
    slug: "box-tee",
    name: "Box Tee",
    collection: "Essentials",
    category: "top",
    description:
      "Square through the body with a ribbed neck that holds its shape. Heavyweight compact cotton.",
    colorway: "Chalk",
    swatch: "#efece6",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["240gsm compact cotton"],
    price: 85,
    views: viewsFor("box-tee", "Box Tee"),
  },
  {
    slug: "draped-midi-dress",
    name: "Draped Midi Dress",
    collection: "Volume I",
    category: "dress",
    description:
      "Bias-cut with a cowl back and a self-tie waist. Falls below the knee and moves with you.",
    colorway: "Clay",
    swatch: "#b2745c",
    sizes: ["XS", "S", "M", "L"],
    materials: ["Sandwashed cupro", "Bias-cut panels"],
    price: 365,
    featured: true,
    views: viewsFor("draped-midi-dress", "Draped Midi Dress"),
  },
  {
    slug: "knit-vest",
    name: "Ribbed Knit Vest",
    collection: "Essentials",
    category: "top",
    description:
      "A deep-armhole vest in a chunky English rib. Meant to be layered over a shirt.",
    colorway: "Oat",
    swatch: "#c9b89a",
    sizes: ["S", "M", "L"],
    materials: ["Lambswool", "English rib knit"],
    price: 195,
    views: viewsFor("knit-vest", "Ribbed Knit Vest"),
  },
];

export function garmentBySlug(slug: string): Garment | undefined {
  return garments.find((g) => g.slug === slug);
}
