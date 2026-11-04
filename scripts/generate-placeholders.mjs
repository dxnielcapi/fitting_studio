/**
 * Generates placeholder garment cutouts — transparent PNGs at the exact paths
 * the real photography will use: public/garments/<slug>/{front,back,left,right}.png
 *
 * Run:  pnpm placeholders
 * Delete this script once every garment has real cutouts.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 900;
const H = 1200;
const OUT = path.join(process.cwd(), "public", "garments");

/** slug -> shape family + colour. Mirrors src/data/garments.ts. */
const SPECS = [
  { slug: "linen-overshirt", shape: "shirt", color: "#ddd5c7" },
  { slug: "utility-jacket", shape: "shirt", color: "#6b7257" },
  { slug: "wide-leg-trouser", shape: "pants", color: "#2b2f3a" },
  { slug: "box-tee", shape: "shirt", color: "#efece6" },
  { slug: "draped-midi-dress", shape: "dress", color: "#b2745c" },
  { slug: "knit-vest", shape: "shirt", color: "#c9b89a" },
];

const VIEWS = ["front", "back", "left", "right"];
const TICKS = { front: 1, right: 2, back: 3, left: 4 };

const shapes = {
  shirt: {
    front: `M 262 214 L 392 186 Q 450 212 508 186 L 638 214
            L 772 258 L 800 566 L 694 590 L 652 352 L 664 846
            L 236 846 L 248 352 L 206 590 L 100 566 L 128 258 Z`,
    side: `M 352 196 Q 450 176 520 206 L 596 252 L 618 560 L 556 578
           L 536 372 L 548 846 L 338 846 L 352 372 Z`,
  },
  pants: {
    front: `M 318 300 L 582 300 L 596 430 L 612 1058 L 486 1058
            L 450 560 L 414 1058 L 288 1058 L 304 430 Z`,
    side: `M 338 300 L 560 300 L 576 430 L 592 1058 L 418 1058
           L 404 560 L 376 430 Z`,
  },
  dress: {
    front: `M 322 222 L 418 190 Q 450 214 482 190 L 578 222
            L 606 360 L 574 470 L 658 1012 L 242 1012 L 326 470
            L 294 360 Z`,
    side: `M 368 200 Q 450 180 516 212 L 568 360 L 540 470
           L 606 1012 L 300 1012 L 360 470 L 336 360 Z`,
  },
};

function pathFor(shape, view) {
  const s = shapes[shape];
  return view === "front" || view === "back" ? s.front : s.side;
}

function svg({ shape, color }, view) {
  const d = pathFor(shape, view);
  const mirror = view === "left";
  const isBack = view === "back";
  const isSide = view === "left" || view === "right";

  // Back views read slightly darker (you see the inside of the shoulders).
  const seams = isBack
    ? `<path d="M 262 300 L 638 300" stroke="rgba(0,0,0,.18)" stroke-width="5" fill="none"/>
       <path d="M 450 300 L 450 846" stroke="rgba(0,0,0,.12)" stroke-width="5" fill="none"/>`
    : isSide
      ? `<path d="M 470 240 L 470 840" stroke="rgba(0,0,0,.10)" stroke-width="5" fill="none"/>`
      : `<path d="M 450 206 L 450 846" stroke="rgba(0,0,0,.08)" stroke-width="4" fill="none"/>`;

  const ticks = Array.from({ length: TICKS[view] }, (_, i) => {
    const x = W / 2 - (TICKS[view] - 1) * 22 + i * 44;
    return `<circle cx="${x}" cy="1136" r="9" fill="rgba(0,0,0,.28)"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fab" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.78"/>
    </linearGradient>
  </defs>
  <g transform="${mirror ? `translate(${W},0) scale(-1,1)` : "translate(0,0)"}">
    <path d="${d}" fill="url(#fab)" stroke="rgba(0,0,0,.22)" stroke-width="4"/>
    ${seams}
  </g>
  ${ticks}
</svg>`;
}

let written = 0;
for (const spec of SPECS) {
  const dir = path.join(OUT, spec.slug);
  await mkdir(dir, { recursive: true });
  for (const view of VIEWS) {
    const png = await sharp(Buffer.from(svg(spec, view))).png().toBuffer();
    await writeFile(path.join(dir, `${view}.png`), png);
    written++;
  }
}
console.log(`Generated ${written} placeholder cutouts in public/garments/`);
