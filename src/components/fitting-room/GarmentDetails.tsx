"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Garment } from "@/lib/types";
import { ChevronIcon, ShuffleIcon } from "@/components/ui/Icons";

type SlotRowProps = {
  label: string;
  garment: Garment;
  dir: 1 | -1;
  index: number;
  total: number;
  onStep: (dir: 1 | -1) => void;
};

function SlotRow({ label, garment, dir, index, total, onStep }: SlotRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow">
          {label} · {index + 1} / {total}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label={`Previous ${label.toLowerCase()}`}
            className="flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="left" className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label={`Next ${label.toLowerCase()}`}
            className="flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="right" className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={garment.slug}
            custom={dir}
            initial={{ opacity: 0, x: dir > 0 ? 32 : -32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? -32 : 32 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2.5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl leading-tight tracking-tight lg:text-3xl">
                {garment.name}
              </h3>
              <p className="flex items-center gap-2 text-xs text-ink-soft">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full ring-1 ring-ink/15"
                  style={{ background: garment.swatch }}
                />
                <span>{garment.colorway}</span>
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

            <p className="text-xs leading-relaxed text-ink-soft">
              {garment.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5 text-[0.7rem] text-ink-soft">
              <div className="flex flex-wrap gap-1">
                {garment.sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded border border-line px-1.5 py-0.5 font-medium"
                  >
                    {size}
                  </span>
                ))}
              </div>
              <span className="text-ink-faint">
                {garment.materials.join(" · ")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

type Props = {
  tshirt: Garment;
  jogger: Garment;
  tshirtDir: 1 | -1;
  joggerDir: 1 | -1;
  tshirtIndex: number;
  tshirtTotal: number;
  joggerIndex: number;
  joggerTotal: number;
  onStepTshirt: (dir: 1 | -1) => void;
  onStepJogger: (dir: 1 | -1) => void;
  onRandomize: () => void;
};

export function GarmentDetails({
  tshirt,
  jogger,
  tshirtDir,
  joggerDir,
  tshirtIndex,
  tshirtTotal,
  joggerIndex,
  joggerTotal,
  onStepTshirt,
  onStepJogger,
  onRandomize,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Current outfit</p>
          <h2 className="mt-1 font-display text-3xl tracking-tight">
            Stickman Fitting
          </h2>
        </div>
        <button
          type="button"
          onClick={onRandomize}
          className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ShuffleIcon className="size-3.5" />
          <span>Randomize</span>
        </button>
      </div>

      <SlotRow
        label="T-Shirt"
        garment={tshirt}
        dir={tshirtDir}
        index={tshirtIndex}
        total={tshirtTotal}
        onStep={onStepTshirt}
      />

      <SlotRow
        label="Jogger"
        garment={jogger}
        dir={joggerDir}
        index={joggerIndex}
        total={joggerTotal}
        onStep={onStepJogger}
      />
    </div>
  );
}
