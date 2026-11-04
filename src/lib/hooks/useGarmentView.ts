"use client";

import { useCallback, useRef, useState } from "react";
import type { ViewKey } from "@/lib/types";
import { nextView, prevView, rotationDelta } from "@/lib/views";

/**
 * Holds which of the four views is showing, plus the signed direction of the
 * last change so the stage can animate the right way round.
 */
export function useGarmentView(initial: ViewKey = "front") {
  const [view, setViewState] = useState<ViewKey>(initial);
  const direction = useRef(1);

  const setView = useCallback((next: ViewKey) => {
    setViewState((current) => {
      if (next === current) return current;
      const delta = rotationDelta(current, next);
      direction.current = delta === 0 ? 1 : Math.sign(delta);
      return next;
    });
  }, []);

  const rotate = useCallback((step: 1 | -1) => {
    setViewState((current) => {
      direction.current = step;
      return step === 1 ? nextView(current) : prevView(current);
    });
  }, []);

  return { view, setView, rotate, direction } as const;
}
