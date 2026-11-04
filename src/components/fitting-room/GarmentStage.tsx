"use client";

import Image from "next/image";
import type { PointerEventHandler } from "react";
import type { Garment, ViewKey } from "@/lib/types";
import { VIEW_BUTTON_ORDER, VIEW_LABELS, rotationDelta } from "@/lib/views";

export const STAGE_SIZES = "(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 460px";

type DragHandlers = {
  onPointerDown: PointerEventHandler;
  onPointerMove: PointerEventHandler;
  onPointerUp: PointerEventHandler;
  onPointerCancel: PointerEventHandler;
  onPointerLeave: PointerEventHandler;
};

type Props = {
  garment: Garment;
  view: ViewKey;
  dragOffset: number;
  dragHandlers: DragHandlers;
};

/**
 * The viewport. All four views of the active garment are mounted at once and
 * only opacity/transform animate, so rotating never reflows and never flashes.
 */
export function GarmentStage({ garment, view, dragOffset, dragHandlers }: Props) {
  const dragging = dragOffset !== 0;

  return (
    <div
      {...dragHandlers}
      role="group"
      aria-label={`${garment.name}, ${VIEW_LABELS[view].toLowerCase()} view. Drag or use the arrow keys to turn it.`}
      className="group relative mx-auto w-full max-w-[460px] touch-none select-none"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="stage-backdrop relative aspect-3/4 overflow-hidden rounded-[2rem] ring-1 ring-line/70">
        {/* floor line */}
        <div
          className="absolute inset-x-0 bottom-[14%] h-px bg-ink/8"
          aria-hidden="true"
        />

        {/* contact shadow */}
        <div
          aria-hidden="true"
          className="stage-shadow absolute bottom-[10%] left-1/2 h-[6%] w-[52%] -translate-x-1/2 transition-transform duration-500"
          style={{
            transform: `translate3d(calc(-50% + ${dragOffset * 0.3}px), 0, 0) scaleX(${
              view === "left" || view === "right" ? 0.68 : 1
            })`,
            transitionDuration: dragging ? "0ms" : "520ms",
            transitionTimingFunction: "var(--ease-room)",
          }}
        />

        {/* the four views */}
        {VIEW_BUTTON_ORDER.map((key) => {
          const image = garment.views[key];
          const delta = rotationDelta(view, key);
          const isActive = delta === 0;

          return (
            <div
              key={key}
              aria-hidden={!isActive}
              className="absolute inset-0 flex items-end justify-center pb-[12%] will-change-[opacity,transform]"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive
                  ? `translate3d(${dragOffset}px, 0, 0) scale(1)`
                  : `translate3d(${delta > 0 ? 44 : -44}px, 0, 0) scale(0.97)`,
                transition: dragging && isActive
                  ? "none"
                  : "opacity 380ms var(--ease-room), transform 540ms var(--ease-room)",
              }}
            >
              <Image
                src={image.src}
                alt={isActive ? image.alt : ""}
                width={image.width}
                height={image.height}
                sizes={STAGE_SIZES}
                priority={key === "front"}
                className="h-[82%] w-auto object-contain drop-shadow-[0_18px_28px_rgba(28,26,23,0.14)]"
                draggable={false}
              />
            </div>
          );
        })}

        {/* which way you're looking */}
        <p
          aria-hidden="true"
          className="eyebrow absolute top-5 left-6 transition-opacity duration-300"
        >
          {VIEW_LABELS[view]}
        </p>
        <p
          aria-hidden="true"
          className="eyebrow absolute top-5 right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          Drag to turn
        </p>
      </div>
    </div>
  );
}
