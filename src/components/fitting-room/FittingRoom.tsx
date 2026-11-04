"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Garment } from "@/lib/types";
import { useGarmentView } from "@/lib/hooks/useGarmentView";
import { useRoomKeys } from "@/lib/hooks/useRoomKeys";
import { useDragRotate } from "@/lib/hooks/useDragRotate";
import { studio } from "@/data/studio";
import { SocialLinks } from "@/components/welcome/SocialLinks";
import { GarmentStage } from "./GarmentStage";
import { ViewSwitcher } from "./ViewSwitcher";
import { GarmentRail } from "./GarmentRail";
import { GarmentDetails } from "./GarmentDetails";
import { ViewPreloader } from "./ViewPreloader";

type Props = {
  garments: Garment[];
  /** Keyboard control is only live once the curtain is up. */
  active: boolean;
  initialSlug?: string;
  onExit: () => void;
};

export function FittingRoom({ garments, active, initialSlug, onExit }: Props) {
  const startIndex = Math.max(
    0,
    garments.findIndex((g) => g.slug === initialSlug),
  );
  const [index, setIndex] = useState(startIndex);
  const garment = garments[index];

  const { view, setView, rotate } = useGarmentView("front");
  const { dragOffset, dragHandlers } = useDragRotate(rotate);

  const stepGarment = useCallback(
    (step: 1 | -1) => {
      setIndex((current) => (current + step + garments.length) % garments.length);
    },
    [garments.length],
  );

  const selectBySlug = useCallback(
    (slug: string) => {
      const next = garments.findIndex((g) => g.slug === slug);
      if (next >= 0) setIndex(next);
    },
    [garments],
  );

  useRoomKeys({
    enabled: active,
    onRotate: rotate,
    onSetView: setView,
    onGarmentStep: stepGarment,
  });

  // Keep ?g=<slug> in the URL so a look stays shareable without a route change.
  useEffect(() => {
    if (!active) return;
    const url = new URL(window.location.href);
    url.searchParams.set("g", garment.slug);
    window.history.replaceState(null, "", url);
  }, [active, garment.slug]);

  // Neighbours of the current garment, warmed while the browser is idle.
  const neighbours = useMemo(() => {
    const { length } = garments;
    if (length < 2) return [];
    const picks = new Set([(index + 1) % length, (index - 1 + length) % length]);
    picks.delete(index);
    return [...picks].map((i) => garments[i]);
  }, [garments, index]);

  return (
    <section
      id="fitting-room"
      tabIndex={-1}
      aria-label="Virtual fitting room"
      className="relative flex min-h-dvh flex-col px-5 py-6 sm:px-8 lg:px-12"
    >
      <header className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onExit}
          className="font-display text-lg tracking-tight transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {studio.name}
        </button>
        <p className="eyebrow hidden sm:block">Fitting room</p>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* the stage */}
        <div className="flex flex-col gap-5">
          <GarmentStage
            garment={garment}
            view={view}
            dragOffset={dragOffset}
            dragHandlers={dragHandlers}
          />
          <ViewSwitcher view={view} onSetView={setView} onRotate={rotate} />
          <p className="hidden text-center text-xs text-ink-faint lg:block">
            <kbd className="font-sans">←</kbd> <kbd className="font-sans">→</kbd>{" "}
            turn · <kbd className="font-sans">↑</kbd>{" "}
            <kbd className="font-sans">↓</kbd> change piece ·{" "}
            <kbd className="font-sans">1</kbd>–<kbd className="font-sans">4</kbd>{" "}
            jump to a view
          </p>
        </div>

        {/* the details */}
        <div className="flex flex-col gap-8">
          <GarmentDetails garment={garment} />
          <GarmentRail
            garments={garments}
            activeSlug={garment.slug}
            onSelect={selectBySlug}
          />
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="eyebrow">
          © {studio.year} {studio.name}
        </p>
        <SocialLinks />
      </footer>

      {active ? <ViewPreloader garments={neighbours} /> : null}
    </section>
  );
}
