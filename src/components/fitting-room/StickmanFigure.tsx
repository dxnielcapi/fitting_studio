"use client";

import type { ViewKey } from "@/lib/types";

/**
 * Minimalist architectural stickman rendered in the same 900x1200 coordinate
 * space as the garment cutouts so t-shirts and joggers fit right over it.
 */
export function StickmanFigure({ view }: { view: ViewKey }) {
  const isSide = view === "left" || view === "right";
  const isBack = view === "back";
  const flipSide = view === "left";

  return (
    <svg
      viewBox="0 0 900 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full select-none"
    >
      <g
        transform={flipSide ? "translate(900, 0) scale(-1, 1)" : undefined}
        stroke="#111111"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isSide ? (
          <>
            {/* Head */}
            <circle cx="455" cy="135" r="54" fill="#ffffff" />
            {/* Face direction indicator on side view */}
            <line x1="492" y1="130" x2="509" y2="130" strokeWidth="9" />
            {/* Neck & Spine */}
            <path d="M 450 189 L 450 245 Q 442 410 455 575" />
            {/* Shoulder joint */}
            <circle cx="452" cy="250" r="7" fill="#111111" stroke="none" />
            {/* Side Arm */}
            <path d="M 452 250 L 468 415 L 448 565" />
            {/* Hip joint */}
            <circle cx="455" cy="575" r="7" fill="#111111" stroke="none" />
            {/* Back leg (slightly offset for depth) */}
            <path
              d="M 448 575 L 432 800 L 425 1035 L 465 1035"
              stroke="#8a8a8a"
              strokeWidth="10"
            />
            {/* Front leg */}
            <path d="M 455 575 L 468 800 L 460 1045 L 508 1045" />
          </>
        ) : (
          <>
            {/* Head */}
            <circle cx="450" cy="135" r="54" fill="#ffffff" />
            {/* Subtle back-of-head seam when viewed from behind */}
            {isBack ? (
              <path
                d="M 422 152 Q 450 164 478 152"
                stroke="#8a8a8a"
                strokeWidth="6"
              />
            ) : null}
            {/* Neck & Spine */}
            <line x1="450" y1="189" x2="450" y2="575" />
            {/* Shoulders */}
            <line x1="335" y1="245" x2="565" y2="245" />
            <circle cx="335" cy="245" r="6" fill="#111111" stroke="none" />
            <circle cx="565" cy="245" r="6" fill="#111111" stroke="none" />
            {/* Left Arm */}
            <path d="M 335 245 L 250 375 L 228 535" />
            {/* Right Arm */}
            <path d="M 565 245 L 650 375 L 672 535" />
            {/* Pelvis / Hips */}
            <line x1="385" y1="575" x2="515" y2="575" />
            <circle cx="385" cy="575" r="6" fill="#111111" stroke="none" />
            <circle cx="515" cy="575" r="6" fill="#111111" stroke="none" />
            {/* Left Leg & Foot */}
            <path d="M 385 575 L 372 800 L 372 1045 L 332 1045" />
            {/* Right Leg & Foot */}
            <path d="M 515 575 L 528 800 L 528 1045 L 568 1045" />
          </>
        )}
      </g>
    </svg>
  );
}
