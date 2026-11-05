import type { ViewKey } from "./types";

/** Orden de giro, como si le dieras la vuelta a la prenda. */
export const VIEW_ORDER: readonly ViewKey[] = [
  "front",
  "right",
  "back",
  "left",
] as const;

export const VIEW_LABELS: Record<ViewKey, string> = {
  front: "Frente",
  back: "Espalda",
  left: "Izquierda",
  right: "Derecha",
};

/** Frases para el texto alternativo: "vista de frente", "vista de perfil izquierdo". */
export const VIEW_ALT: Record<ViewKey, string> = {
  front: "de frente",
  back: "de espalda",
  left: "de perfil izquierdo",
  right: "de perfil derecho",
};

/** Order the switcher buttons are displayed in (not the rotation order). */
export const VIEW_BUTTON_ORDER: readonly ViewKey[] = [
  "front",
  "back",
  "left",
  "right",
] as const;

export function nextView(current: ViewKey): ViewKey {
  const i = VIEW_ORDER.indexOf(current);
  return VIEW_ORDER[(i + 1) % VIEW_ORDER.length];
}

export function prevView(current: ViewKey): ViewKey {
  const i = VIEW_ORDER.indexOf(current);
  return VIEW_ORDER[(i - 1 + VIEW_ORDER.length) % VIEW_ORDER.length];
}

/** Signed rotation distance from `from` to `to`, used to pick animation direction. */
export function rotationDelta(from: ViewKey, to: ViewKey): number {
  const a = VIEW_ORDER.indexOf(from);
  const b = VIEW_ORDER.indexOf(to);
  let d = b - a;
  if (d > 2) d -= VIEW_ORDER.length;
  if (d < -2) d += VIEW_ORDER.length;
  return d;
}

export function isViewKey(value: string): value is ViewKey {
  return (VIEW_ORDER as readonly string[]).includes(value);
}

/** Builds the four image records for a garment from its slug. */
export function viewsFor(
  slug: string,
  name: string,
  width = 900,
  height = 1200,
): Record<ViewKey, { src: string; alt: string; width: number; height: number }> {
  return Object.fromEntries(
    VIEW_BUTTON_ORDER.map((view) => [
      view,
      {
        src: `/garments/${slug}/${view}.png`,
        alt: `${name}, vista ${VIEW_ALT[view]}`,
        width,
        height,
      },
    ]),
  ) as Record<ViewKey, { src: string; alt: string; width: number; height: number }>;
}
