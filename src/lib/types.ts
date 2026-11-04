/** The four canonical views every garment must provide. */
export type ViewKey = "front" | "back" | "left" | "right";

export type GarmentCategory =
  | "outerwear"
  | "top"
  | "bottom"
  | "dress"
  | "accessory";

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
