"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Garment } from "@/lib/types";
import { VIEW_BUTTON_ORDER } from "@/lib/views";
import { STAGE_SIZES } from "./GarmentStage";

/**
 * Warms the neighbouring garments' four views once the browser is idle, using
 * the same `sizes` as the stage so the cached file is the one the stage asks
 * for. Keeps garment switching as instant as view switching without pulling
 * the whole catalog down on first paint.
 */
export function ViewPreloader({ garments }: { garments: Garment[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Safari only shipped requestIdleCallback recently; fall back to a timer.
    // (A plain boolean, so `window` keeps its full DOM type.)
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : window.setTimeout(() => setReady(true), 1200);

    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  if (!ready) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
    >
      {garments.map((garment) =>
        VIEW_BUTTON_ORDER.map((view) => {
          const image = garment.views[view];
          return (
            <Image
              key={`${garment.slug}-${view}`}
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              sizes={STAGE_SIZES}
            />
          );
        }),
      )}
    </div>
  );
}
