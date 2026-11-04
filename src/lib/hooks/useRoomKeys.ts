"use client";

import { useEffect } from "react";
import type { ViewKey } from "@/lib/types";
import { VIEW_BUTTON_ORDER } from "@/lib/views";

type Options = {
  enabled: boolean;
  onRotate: (step: 1 | -1) => void;
  onSetView: (view: ViewKey) => void;
  onGarmentStep: (step: 1 | -1) => void;
};

/**
 * Keyboard contract for the fitting room:
 *   ← / →   rotate through views (wraps)
 *   ↑ / ↓   previous / next garment
 *   1 – 4   jump straight to front / back / left / right
 */
export function useRoomKeys({
  enabled,
  onRotate,
  onSetView,
  onGarmentStep,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    function handle(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          onRotate(1);
          return;
        case "ArrowLeft":
          event.preventDefault();
          onRotate(-1);
          return;
        case "ArrowDown":
          event.preventDefault();
          onGarmentStep(1);
          return;
        case "ArrowUp":
          event.preventDefault();
          onGarmentStep(-1);
          return;
      }

      const slot = Number.parseInt(event.key, 10);
      if (slot >= 1 && slot <= VIEW_BUTTON_ORDER.length) {
        event.preventDefault();
        onSetView(VIEW_BUTTON_ORDER[slot - 1]);
      }
    }

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [enabled, onRotate, onSetView, onGarmentStep]);
}
