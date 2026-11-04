/** The four canonical views every garment must provide. */
export type ViewKey = "front" | "back" | "left" | "right";

/**
 * Equipment slots on the stickman figure.
 * Active right now: "tshirt" and "jogger".
 * Prepared for future expansion: "shoes", "totebag", "accessory".
 */
export type GarmentSlot =
  | "tshirt"
  | "jogger"
  | "shoes"
  | "totebag"
  | "accessory";

export type ActiveSlot = "tshirt" | "jogger";

export type GarmentCategory = GarmentSlot;

export type GarmentImage = {
  /** Path under /public — cutout with a transparent background. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Garment = {
  /** URL slug and asset folder name: public/garments/<slug>/front.png */
  slug: string;
  name: string;
  collection?: string;
  category: GarmentCategory;
  description: string;
  colorway: string;
  /** Hex used for the thumbnail chip and the stage accent. */
  swatch: string;
  sizes: string[];
  materials: string[];
  price?: number;
  featured?: boolean;
  /**
   * All four views are structurally required — a garment missing one
   * will not compile. This is the guarantee the fitting room rests on.
   */
  views: Record<ViewKey, GarmentImage>;
};
