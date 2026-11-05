"use client";

import Image from "next/image";
import type { PointerEventHandler } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Garment, ViewKey } from "@/lib/types";
import { VIEW_ALT, VIEW_BUTTON_ORDER, rotationDelta } from "@/lib/views";
import { ChevronIcon, ShuffleIcon } from "@/components/ui/Icons";
import { StickmanFigure, useStickmanPose } from "./StickmanFigure";

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
  randomCount: number;
  tshirtCount: number;
  joggerCount: number;
  onStepTshirt: (dir: 1 | -1) => void;
  onStepJogger: (dir: 1 | -1) => void;
  onRandomize: () => void;
  view: ViewKey;
  dragOffset: number;
  dragHandlers: DragHandlers;
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 130 : -130,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -130 : 130,
    opacity: 0,
  }),
};

/**
 * Borderless centered stickman fitting stage. Renders the connected stickman
 * skeleton across all four views with layered t-shirt and jogger cutouts that
 * slide horizontally (left to right) and follow the stickman's subtle posture.
 */
export function GarmentStage({
  tshirt,
  jogger,
  tshirtDir,
  joggerDir,
  randomCount,
  tshirtCount,
  joggerCount,
  onStepTshirt,
  onStepJogger,
  onRandomize,
  view,
  dragOffset,
  dragHandlers,
}: Props) {
  const dragging = dragOffset !== 0;
  const pose = useStickmanPose({ randomCount, tshirtCount, joggerCount });

  return (
    <div
      {...dragHandlers}
      role="group"
      aria-label={`Figura con ${tshirt.name} y ${jogger.name}, vista ${VIEW_ALT[view]}.`}
      className="group relative mx-auto w-full max-w-[min(440px,48dvh)] touch-pan-y select-none lg:max-w-[min(560px,49dvh)] xl:max-w-[min(640px,50dvh)] 2xl:max-w-[min(720px,51dvh)]"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="relative aspect-3/4 overflow-visible bg-white">
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
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden will-change-[opacity,transform]"
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
              <div className="relative h-[92%] aspect-3/4">
                {/* Base connected stickman skeleton */}
                <div className="absolute inset-0">
                  <StickmanFigure view={key} pose={pose} />
                </div>

                {/* Jogger layer (bottom) — slides left/right and follows hip micro-movement */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `translate3d(${(pose.hipX / 900) * 100}%, ${(pose.hipY / 1200) * 100}%, 0)`,
                  }}
                >
                  <AnimatePresence initial={false} custom={joggerDir}>
                    <motion.div
                      key={`${jogger.slug}-${key}`}
                      custom={joggerDir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.34, ease: "linear" },
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
                </div>

                {/* T-Shirt layer (top) — slides left/right and follows torso/shoulder micro-movement */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `translate3d(${(pose.torsoX / 900) * 100}%, ${((pose.torsoY + (pose.shoulderLY + pose.shoulderRY) * 0.25) / 1200) * 100}%, 0)`,
                  }}
                >
                  <AnimatePresence initial={false} custom={tshirtDir}>
                    <motion.div
                      key={`${tshirt.slug}-${key}`}
                      custom={tshirtDir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.34, ease: "linear" },
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
            </div>
          );
        })}

        {/* Minimalist left/right controls aligned to T-Shirt (upper body) */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute inset-x-0 top-[34%] flex -translate-y-1/2 items-center justify-between"
        >
          <button
            type="button"
            onClick={() => onStepTshirt(-1)}
            aria-label="Playera anterior"
            className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-all duration-200 hover:scale-110 hover:text-ink active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="left" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onStepTshirt(1)}
            aria-label="Playera siguiente"
            className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-all duration-200 hover:scale-110 hover:text-ink active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="right" className="size-5" />
          </button>
        </div>

        {/* Minimalist left/right controls aligned to Jogger (lower body) */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute inset-x-0 top-[66%] flex -translate-y-1/2 items-center justify-between"
        >
          <button
            type="button"
            onClick={() => onStepJogger(-1)}
            aria-label="Jogger anterior"
            className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-all duration-200 hover:scale-110 hover:text-ink active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="left" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onStepJogger(1)}
            aria-label="Jogger siguiente"
            className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-all duration-200 hover:scale-110 hover:text-ink active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronIcon direction="right" className="size-5" />
          </button>
        </div>

        {/* Minimalist Randomize button */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-1 right-0"
        >
          <button
            type="button"
            onClick={onRandomize}
            aria-label="Combinar al azar"
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] text-ink-faint transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ShuffleIcon className="size-3.5" />
            <span>Al azar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
