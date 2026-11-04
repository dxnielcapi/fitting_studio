/**
 * Generates placeholder garment cutouts — transparent PNGs at the exact paths
 * the real photography will use: public/garments/<slug>/{front,back,left,right}.png
 *
 * Each cutout is sized 900x1200 so that a t-shirt and a jogger align directly
 * over the stickman figure on the stage.
 *
 * Run:  pnpm placeholders
 * Delete this script once every garment has real cutouts.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 900;
const H = 1200;
const OUT = path.join(process.cwd(), "public", "garments");

/** slug -> shape family + colour. Mirrors src/data/garments.ts. */
const SPECS = [
  { slug: "box-tee-chalk", shape: "tshirt", color: "#f2f2f0" },
  { slug: "heavy-tee-onyx", shape: "tshirt", color: "#1c1c1c" },
  { slug: "studio-tee-ash", shape: "tshirt", color: "#a8a8a4" },
  { slug: "fleece-jogger-onyx", shape: "jogger", color: "#222222" },
  { slug: "relaxed-jogger-heather", shape: "jogger", color: "#c2c2be" },
  { slug: "cargo-jogger-stone", shape: "jogger", color: "#deded8" },
];

const VIEWS = ["front", "back", "left", "right"];

const shapes = {
  tshirt: {
    front: `M 310 245 L 405 225 Q 450 248 495 225 L 590 245
            L 685 335 L 625 405 L 570 340 L 575 585
            L 325 585 L 330 340 L 275 405 L 215 335 Z`,
    side: `M 380 232 Q 450 218 515 240 L 560 355 L 510 385
           L 525 585 L 375 585 L 385 355 Z`,
  },
  jogger: {
    front: `M 335 565 L 565 565 L 585 690 L 565 980 L 485 980
            L 450 685 L 415 980 L 335 980 L 315 690 Z`,
    side: `M 375 565 L 535 565 L 550 690 L 535 980 L 405 980
           L 395 690 Z`,
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
  const isDark = color.toLowerCase() === "#1c1c1c" || color.toLowerCase() === "#222222";
  const strokeColor = isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.28)";
  const seamColor = isDark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.12)";

  let seams = "";
  if (shape === "tshirt") {
    seams = isBack
      ? `<path d="M 325 295 L 575 295" stroke="${seamColor}" stroke-width="3.5" fill="none"/>
         <path d="M 450 295 L 450 585" stroke="${seamColor}" stroke-width="3" fill="none"/>`
      : isSide
        ? `<path d="M 455 240 L 455 585" stroke="${seamColor}" stroke-width="3.5" fill="none"/>`
        : `<path d="M 405 225 Q 450 262 495 225" stroke="${seamColor}" stroke-width="4" fill="none"/>`;
  } else {
    // jogger cuffs + waistband + drawstring
    seams = isSide
      ? `<path d="M 375 595 L 535 595" stroke="${seamColor}" stroke-width="3.5" fill="none"/>
         <path d="M 465 595 L 465 955" stroke="${seamColor}" stroke-width="3.5" fill="none"/>
         <path d="M 405 955 L 535 955" stroke="${seamColor}" stroke-width="4" fill="none"/>`
      : `<path d="M 335 595 L 565 595" stroke="${seamColor}" stroke-width="3.5" fill="none"/>
         <path d="M 335 955 L 415 955 M 485 955 L 565 955" stroke="${seamColor}" stroke-width="4" fill="none"/>
         ${
           !isBack
             ? `<path d="M 440 580 Q 432 630 436 650 M 460 580 Q 468 630 464 650" stroke="${strokeColor}" stroke-width="3" fill="none" stroke-linecap="round"/>`
             : `<path d="M 490 630 L 545 630 L 545 695 L 490 695 Z" stroke="${seamColor}" stroke-width="3" fill="none"/>`
         }`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fab" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <g transform="${mirror ? `translate(${W},0) scale(-1,1)` : "translate(0,0)"}">
    <path d="${d}" fill="url(#fab)" stroke="${strokeColor}" stroke-width="4" stroke-linejoin="round"/>
    ${seams}
  </g>
</svg>`;
}

await rm(OUT, { recursive: true, force: true });
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
