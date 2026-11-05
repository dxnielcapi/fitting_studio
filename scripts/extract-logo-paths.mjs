import { readFileSync, writeFileSync } from "node:fs";

function paths(file) {
  const svg = readFileSync(file, "utf8");
  return [...svg.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
}

const mark = paths("public/Logos/favicon.svg");

const out = `/**
 * Outline geometry for the brand mark, lifted verbatim from
 * public/Logos/favicon.svg so the hero pattern can trace it instead of
 * filling it.
 *
 * Regenerate with: pnpm logo-paths
 */

export const MARK = {
  viewBox: "0 0 5383 5059",
  width: 5383,
  height: 5059,
  paths: [
${mark.map((d) => `    "${d}",`).join("\n")}
  ],
} as const;
`;

writeFileSync("src/components/welcome/logoPaths.ts", out);
console.log(`mark: ${mark.length} paths`);
