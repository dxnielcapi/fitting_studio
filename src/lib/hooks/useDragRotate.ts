"use client";

import { useCallback, useRef, useState } from "react";

const THRESHOLD = 56;

/**
 * Swipe or drag horizontally across the stage to turn the garment.
 * Returns pointer handlers to spread onto the stage, plus the live
 * drag offset so the image can follow the finger before it commits.
 */
export function useDragRotate(onRotate: (step: 1 | -1) => void) {
  const start = useRef<number | null>(null);
  const fired = useRef(false);
  const [offset, setOffset] = useState(0);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    start.current = event.clientX;
    fired.current = false;
    setOffset(0);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (start.current === null) return;
      const dx = event.clientX - start.current;
      setOffset(Math.max(-90, Math.min(90, dx * 0.5)));

      if (!fired.current && Math.abs(dx) > THRESHOLD) {
        fired.current = true;
        onRotate(dx < 0 ? 1 : -1);
        start.current = event.clientX;
        setOffset(0);
      }
    },
    [onRotate],
  );

  const end = useCallback(() => {
    start.current = null;
    fired.current = false;
    setOffset(0);
  }, []);

  return {
    dragOffset: offset,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
      onPointerLeave: end,
    },
  } as const;
}
