"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Garment } from "@/lib/types";

export function GarmentDetails({ garment }: { garment: Garment }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={garment.slug}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5"
      >
        <div>
          {garment.collection ? (
            <p className="eyebrow mb-2">{garment.collection}</p>
          ) : null}
          <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-balance lg:text-5xl">
            {garment.name}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
            <span
              aria-hidden="true"
              className="size-3 rounded-full ring-1 ring-ink/10"
              style={{ background: garment.swatch }}
            />
            {garment.colorway}
            {garment.price ? (
              <>
                <span aria-hidden="true" className="text-ink-faint">
                  ·
                </span>
                <span className="tabular-nums">€{garment.price}</span>
              </>
            ) : null}
          </p>
        </div>

        <p className="max-w-prose text-[0.95rem] leading-relaxed text-ink-soft">
          {garment.description}
        </p>

        <dl className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <div>
            <dt className="eyebrow mb-2">Sizes</dt>
            <dd className="flex flex-wrap gap-1.5">
              {garment.sizes.map((size) => (
                <span
                  key={size}
                  className="rounded-md border border-line px-2 py-1 text-xs font-medium text-ink-soft"
                >
                  {size}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Materials</dt>
            <dd className="text-sm leading-relaxed text-ink-soft">
              {garment.materials.join(" · ")}
            </dd>
          </div>
        </dl>
      </motion.div>
    </AnimatePresence>
  );
}
