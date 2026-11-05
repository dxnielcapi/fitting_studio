"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Garment } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  tshirt: Garment;
  jogger: Garment;
  tshirtDir: 1 | -1;
  joggerDir: 1 | -1;
};

/**
 * Centered bottom titles for the worn garments, with a single button to reveal
 * or hide all descriptive information (no rectangular cards or boxes).
 */
export function GarmentDetails({
  tshirt,
  jogger,
  tshirtDir,
  joggerDir,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
      {/* Garment titles at the bottom */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={tshirtDir}>
            <motion.h2
              key={tshirt.slug}
              custom={tshirtDir}
              initial={{ opacity: 0, x: tshirtDir > 0 ? 28 : -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tshirtDir > 0 ? -28 : 28 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-2xl tracking-tight sm:text-3xl"
            >
              {tshirt.name}
            </motion.h2>
          </AnimatePresence>
        </div>

        <span aria-hidden="true" className="font-display text-xl text-ink-faint">
          +
        </span>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={joggerDir}>
            <motion.h2
              key={jogger.slug}
              custom={joggerDir}
              initial={{ opacity: 0, x: joggerDir > 0 ? 28 : -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: joggerDir > 0 ? -28 : 28 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-2xl tracking-tight sm:text-3xl"
            >
              {jogger.name}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* Button to toggle descriptive information */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="mt-3 rounded-full bg-ink px-5 py-2 text-[0.6875rem] font-medium tracking-[0.16em] text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {open ? "Ocultar detalles" : "Ver detalles"}
      </button>

      {/* Expandable descriptive information (borderless, no rectangles) */}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="details-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full overflow-hidden"
          >
            <div className="mt-6 grid gap-8 pt-2 sm:grid-cols-2">
              {[tshirt, jogger].map((item) => (
                <div
                  key={item.slug}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <p className="eyebrow">{item.collection ?? item.category}</p>
                  <p className="font-display text-xl tracking-tight">
                    {item.name}
                  </p>
                  <p className="flex items-center justify-center gap-2 text-xs text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ background: item.swatch }}
                    />
                    <span>{item.colorway}</span>
                    {item.price ? (
                      <>
                        <span aria-hidden="true" className="text-ink-faint">
                          ·
                        </span>
                        <span className="tabular-nums">{formatPrice(item.price)}</span>
                      </>
                    ) : null}
                  </p>
                  <p className="max-w-xs text-xs leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                  <p className="text-[0.7rem] tracking-wide text-ink-faint">
                    Tallas: {item.sizes.join(", ")} · {item.materials.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
