"use client";

import type { ViewKey } from "@/lib/types";
import { VIEW_LABELS, VIEW_ORDER } from "@/lib/views";
import { ChevronIcon } from "@/components/ui/Icons";

type Props = {
  view: ViewKey;
  onSetView: (view: ViewKey) => void;
  onRotate: (step: 1 | -1) => void;
};

/**
 * Horizontal left-to-right rotation bar + quick view buttons for the 4 angles.
 */
export function ViewSwitcher({ view, onSetView, onRotate }: Props) {
  const index = VIEW_ORDER.indexOf(view);

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onRotate(-1)}
          aria-label="Turn left"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ChevronIcon direction="left" className="size-4" />
        </button>

        <div className="relative flex flex-1 flex-col gap-1.5">
          <input
            type="range"
            min={0}
            max={VIEW_ORDER.length - 1}
            step={1}
            value={index}
            onChange={(e) => {
              const nextIndex = Number.parseInt(e.target.value, 10);
              const next = VIEW_ORDER[nextIndex];
              if (next) onSetView(next);
            }}
            aria-label="Rotate stickman angle left to right"
            aria-valuetext={`${VIEW_LABELS[view]} view`}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          />
          <div className="flex justify-between px-0.5">
            {VIEW_ORDER.map((key) => {
              const active = key === view;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSetView(key)}
                  aria-pressed={active}
                  className={`text-[0.625rem] tracking-[0.16em] uppercase transition-colors ${
                    active
                      ? "font-semibold text-ink"
                      : "text-ink-faint hover:text-ink"
                  }`}
                >
                  {VIEW_LABELS[key]}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRotate(1)}
          aria-label="Turn right"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ChevronIcon direction="right" className="size-4" />
        </button>
      </div>
    </div>
  );
}
