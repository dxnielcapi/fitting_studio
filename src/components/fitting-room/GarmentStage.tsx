"use client";

import Image from "next/image";
import type { PointerEventHandler } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Garment, ViewKey } from "@/lib/types";
import { VIEW_BUTTON_ORDER, VIEW_LABELS, rotationDelta } from "@/lib/views";
import { ChevronIcon, ShuffleIcon } from "@/components/ui/Icons";
import { StickmanFigure } from "./StickmanFigure";

export const STAGE_SIZES =
  "(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 460px";

type DragHandlers = {
  onPointerDown: PointerEventHandler;
  onPointerMove: PointerEventHandler;
  onPointerUp: PointerEventHandler;
  onPointerCancel: PointerEventHandler;
  onPointerLeave: PointerEventHandler;
};

type Props = {
  tshirt: Garment;
  jogger: Garment;
  tshirtDir: 1 | -1;
  joggerDir: 1 | -1;
  onStepTshirt: (dir: 1 | -1) => void;
  onStepJogger: (dir: 1 | -1) => void;
  onRandomize: () => void;
  view: ViewKey;
  dragOffset: number;
  dragHandlers: DragHandlers;
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 180 : -180,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -180 : 180,
    opacity: 0,
  }),
};

/**
 * The stickman fitting stage. Renders the stickman figure across all four views
 * with layered t-shirt and jogger cutouts that slide horizontally (left to right)
 * when the user pushes the slot buttons.
 */
export function GarmentStage({
  tshirt,
  jogger,
  tshirtDir,
  joggerDir,
  onStepTshirt,
  onStepJogger,
  onRandomize,
  view,
  dragOffset,
  dragHandlers,
}: Props) {
  const dragging = dragOffset !== 0;

  return (
    <div
      {...dragHandlers}
      role="group"
      aria-label={`Stickman wearing ${tshirt.name} and ${jogger.name}, ${VIEW_LABELS[view].toLowerCase()} view.`}
      className="group relative mx-auto w-full max-w-[min(460px,52dvh)] touch-pan-y select-none lg:max-w-[min(440px,56dvh)]"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="stage-backdrop relative aspect-3/4 overflow-hidden rounded-[2rem] border border-line bg-white">
        {/* subtle floor line */}
        <div
          className="absolute inset-x-10 bottom-[10%] h-px bg-line"
          aria-hidden="true"
        />

        {/* contact shadow beneath the stickman */}
        <div
          aria-hidden="true"
          className="stage-shadow absolute bottom-[7.5%] left-1/2 h-[5%] w-[48%] -translate-x-1/2 transition-transform duration-500"
          style={{
            transform: `translate3d(calc(-50% + ${dragOffset * 0.3}px), 0, 0) scaleX(${
              view === "left" || view === "right" ? 0.68 : 1
            })`,
            transitionDuration: dragging ? "0ms" : "520ms",
            transitionTimingFunction: "var(--ease-room)",
          }}
        />

        {/* the four views of the stickman + layered garments */}
        {VIEW_BUTTON_ORDER.map((key) => {
          const delta = rotationDelta(view, key);
          const isActive = delta === 0;
          const tshirtImg = tshirt.views[key];
          const joggerImg = jogger.views[key];

          return (
            <div
              key={key}
              aria-hidden={!isActive}
              className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-[opacity,transform]"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive
                  ? `translate3d(${dragOffset}px, 0, 0) scale(1)`
                  : `translate3d(${delta > 0 ? 40 : -40}px, 0, 0) scale(0.98)`,
                transition:
                  dragging && isActive
                    ? "none"
                    : "opacity 340ms var(--ease-room), transform 500ms var(--ease-room)",
              }}
            >
              <div className="relative h-[88%] aspect-3/4">
                {/* Base stickman body */}
                <div className="absolute inset-0">
                  <StickmanFigure view={key} />
                </div>

                {/* Jogger layer (bottom) — slides left/right */}
                <AnimatePresence initial={false} custom={joggerDir} mode="popLayout">
                  <motion.div
                    key={`${jogger.slug}-${key}`}
                    custom={joggerDir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 320, damping: 32 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={joggerImg.src}
                      alt={isActive ? joggerImg.alt : ""}
                      width={joggerImg.width}
                      height={joggerImg.height}
                      sizes={STAGE_SIZES}
                      priority={key === "front"}
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* T-Shirt layer (top) — slides left/right */}
                <AnimatePresence initial={false} custom={tshirtDir} mode="popLayout">
                  <motion.div
                    key={`${tshirt.slug}-${key}`}
                    custom={tshirtDir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 320, damping: 32 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={tshirtImg.src}
                      alt={isActive ? tshirtImg.alt : ""}
                      width={tshirtImg.width}
                      height={tshirtImg.height}
                      sizes={STAGE_SIZES}
                      priority={key === "front"}
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {/* Minimalist left/right controls aligned to T-Shirt (upper body) */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute inset-x-3 top-[34%] flex -translate-y-1/2 items-center justify-between"
        >
          <button
            type="button"
            onClick={() => onStepTshirt(-1)}
            aria-label="Previous t-shirt"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-white/90 text-ink transition-all duration-200 hover:border-ink hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="left" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onStepTshirt(1)}
            aria-label="Next t-shirt"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-white/90 text-ink transition-all duration-200 hover:border-ink hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="right" className="size-4" />
          </button>
        </div>

        {/* Minimalist left/right controls aligned to Jogger (lower body) */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute inset-x-3 top-[66%] flex -translate-y-1/2 items-center justify-between"
        >
          <button
            type="button"
            onClick={() => onStepJogger(-1)}
            aria-label="Previous jogger"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-white/90 text-ink transition-all duration-200 hover:border-ink hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="left" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onStepJogger(1)}
            aria-label="Next jogger"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-white/90 text-ink transition-all duration-200 hover:border-ink hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="right" className="size-4" />
          </button>
        </div>

        {/* Top bar inside stage: current angle label + Randomize button */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-x-5 top-4 flex items-center justify-between"
        >
          <p aria-hidden="true" className="eyebrow">
            {VIEW_LABELS[view]}
          </p>
          <button
            type="button"
            onClick={onRandomize}
            aria-label="Randomize outfit"
            className="flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1.5 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ShuffleIcon className="size-3" />
            <span>Random</span>
          </button>
        </div>
      </div>
    </div>
  );
}
