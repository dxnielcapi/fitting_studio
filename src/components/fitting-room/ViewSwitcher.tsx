"use client";

import type { ViewKey } from "@/lib/types";
import { VIEW_BUTTON_ORDER, VIEW_LABELS } from "@/lib/views";
import { ChevronIcon } from "@/components/ui/Icons";

type Props = {
  view: ViewKey;
  onSetView: (view: ViewKey) => void;
  onRotate: (step: 1 | -1) => void;
};

export function ViewSwitcher({ view, onSetView, onRotate }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onRotate(-1)}
        aria-label="Turn left"
        className="flex size-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ChevronIcon direction="left" />
      </button>

      <div
        role="group"
        aria-label="Garment view"
        className="flex items-center gap-1 rounded-full border border-line bg-paper/70 p-1"
      >
        {VIEW_BUTTON_ORDER.map((key, index) => {
          const isActive = key === view;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSetView(key)}
              aria-pressed={isActive}
              title={`${VIEW_LABELS[key]} — press ${index + 1}`}
              className={`relative rounded-full px-4 py-2 text-xs font-medium tracking-[0.1em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                isActive
                  ? "bg-ink text-paper"
                  : "text-ink-faint hover:text-ink"
              }`}
            >
              {VIEW_LABELS[key]}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onRotate(1)}
        aria-label="Turn right"
        className="flex size-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ChevronIcon />
      </button>
    </div>
  );
}
