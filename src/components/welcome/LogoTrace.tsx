"use client";

import { useReducedMotion } from "motion/react";
import { MARK } from "./logoPaths";

/* ---------------------------------------------------------------
   Hero line: one very large brand mark, drawn only by the line
   travelling around it. The shape is never outlined in full — what
   you see at any moment is the length of line currently passing
   through it, and the two strokes of the mark run in opposite
   directions so the drawing never settles into a single sweep.
   --------------------------------------------------------------- */

/** A frame the mark deliberately overflows; sliced to cover the hero. */
const VIEW_W = 1440;
const VIEW_H = 1150;

/** Sized to sit inside the band below the nav rather than run past it. */
const MARK_H = 540;
const CENTRE_X = 720;
const CENTRE_Y = 575;

/** Line weight, in frame units — see the stroke-width note below. */
const TRACE_WEIGHT = 1.2;

const MARK_W = (MARK_H * MARK.width) / MARK.height;
const SCALE = MARK_W / MARK.width;

const TRANSFORM = `translate(${CENTRE_X - MARK_W / 2} ${CENTRE_Y - MARK_H / 2}) scale(${SCALE})`;

// The mark is scaled down hard from its own huge coordinate space, so
// the weight is divided back out to land on a hairline on screen.
// `vector-effect: non-scaling-stroke` would do this for free but it
// makes the browser measure dashes in screen space, which throws away
// the pathLength normalisation the line depends on.
const STROKE_WIDTH = TRACE_WEIGHT / SCALE;

export function LogoTrace() {
  const reduceMotion = useReducedMotion();

  // Nothing to show when the line cannot travel: the mark is only ever
  // drawn by its own motion.
  if (reduceMotion) return null;

  return (
    // Starts below the nav bar (68px of 85%-opaque white): anything drawn
    // underneath it reads as the line being cut off.
    <div
      aria-hidden="true"
      className="logo-trace pointer-events-none absolute inset-x-0 top-20 bottom-0 overflow-hidden select-none"
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g
          transform={TRANSFORM}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        >
          {MARK.paths.map((d, i) => (
            <path key={i} d={d} pathLength={1} />
          ))}
        </g>
      </svg>
    </div>
  );
}
