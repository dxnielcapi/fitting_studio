import type { ActiveSlot, Garment, GarmentSlot } from "@/lib/types";
import { viewsFor } from "@/lib/views";

/**
 * Espacios de prenda que soporta el probador.
 * Activos en la interfaz: "tshirt" y "jogger".
 * Reservados para más adelante: "shoes", "totebag", "accessory".
 */
export const ACTIVE_SLOTS: readonly ActiveSlot[] = ["tshirt", "jogger"] as const;

export const FUTURE_SLOTS: readonly Exclude<GarmentSlot, ActiveSlot>[] = [
  "shoes",
  "totebag",
  "accessory",
] as const;

export const SLOT_LABELS: Record<GarmentSlot, string> = {
  tshirt: "Playera",
  jogger: "Jogger",
  shoes: "Tenis",
  totebag: "Bolsa",
  accessory: "Accesorio",
};

/**
 * La colección. Por ahora playeras y joggers, colocados para montarse
 * limpiamente sobre la figura en las cuatro vistas.
 *
 * Los `slug` se quedan en inglés a propósito: son la ruta de los archivos
 * en public/garments/<slug>/ y la URL que se comparte.
 */
export const garments: Garment[] = [
  {
    slug: "box-tee-chalk",
    name: "Playera Box",
    collection: "Esenciales",
    category: "tshirt",
    description:
      "Cuadrada de cuerpo, con cuello de rib que no se deforma. Algodón compacto y pesado.",
    colorway: "Tiza",
    swatch: "#f2f2f0",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["Algodón compacto de 240 g/m²"],
    price: 1290,
    featured: true,
    views: viewsFor("box-tee-chalk", "Playera Box (Tiza)"),
  },
  {
    slug: "heavy-tee-onyx",
    name: "Playera Studio Pesada",
    collection: "Volumen I",
    category: "tshirt",
    description:
      "Silueta amplia de hombro caído en jersey orgánico teñido en pigmento. Cae firme sobre el cuerpo.",
    colorway: "Ónix",
    swatch: "#1c1c1c",
    sizes: ["S", "M", "L", "XL"],
    materials: ["Jersey de algodón orgánico de 280 g/m²"],
    price: 1490,
    featured: true,
    views: viewsFor("heavy-tee-onyx", "Playera Studio Pesada (Ónix)"),
  },
  {
    slug: "studio-tee-ash",
    name: "Playera Cuello Redondo",
    collection: "Esenciales",
    category: "tshirt",
    description:
      "Algodón cepillado suave, costura de doble aguja y un corte relajado para diario.",
    colorway: "Ceniza",
    swatch: "#a8a8a4",
    sizes: ["XS", "S", "M", "L"],
    materials: ["Algodón peinado de 220 g/m²"],
    price: 1190,
    views: viewsFor("studio-tee-ash", "Playera Cuello Redondo (Ceniza)"),
  },
  {
    slug: "fleece-jogger-onyx",
    name: "Jogger de Felpa Pesada",
    collection: "Esenciales",
    category: "jogger",
    description:
      "Jogger estructurado en felpa loopback, con cintura elástica de cordón y puños entallados al tobillo.",
    colorway: "Ónix",
    swatch: "#222222",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["Felpa loopback de algodón de 420 g/m²"],
    price: 2490,
    featured: true,
    views: viewsFor("fleece-jogger-onyx", "Jogger de Felpa Pesada (Ónix)"),
  },
  {
    slug: "relaxed-jogger-heather",
    name: "Jogger Relajado",
    collection: "Volumen I",
    category: "jogger",
    description:
      "Pantalón deportivo de corte amplio, con bolsas profundas en la costura lateral y puño limpio.",
    colorway: "Gris Jaspeado",
    swatch: "#c2c2be",
    sizes: ["S", "M", "L", "XL"],
    materials: ["Algodón cepillado de 380 g/m²"],
    price: 2290,
    views: viewsFor("relaxed-jogger-heather", "Jogger Relajado (Gris Jaspeado)"),
  },
  {
    slug: "cargo-jogger-stone",
    name: "Jogger Utilitario Técnico",
    collection: "Volumen I",
    category: "jogger",
    description:
      "Pinzas articuladas en la rodilla y bolsas laterales a ras, en sarga de algodón y nylon.",
    colorway: "Piedra",
    swatch: "#deded8",
    sizes: ["XS", "S", "M", "L"],
    materials: ["Sarga de algodón y nylon", "Puño elástico"],
    price: 2890,
    views: viewsFor("cargo-jogger-stone", "Jogger Utilitario Técnico (Piedra)"),
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
