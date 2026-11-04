"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Garment } from "@/lib/types";
import { garmentsBySlot } from "@/data/garments";
import { useGarmentView } from "@/lib/hooks/useGarmentView";
import { useRoomKeys } from "@/lib/hooks/useRoomKeys";
import { useDragRotate } from "@/lib/hooks/useDragRotate";
import { studio } from "@/data/studio";
import { SocialLinks } from "@/components/welcome/SocialLinks";
import { GarmentStage } from "./GarmentStage";
import { ViewSwitcher } from "./ViewSwitcher";
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
  const tshirts = useMemo(
    () => garmentsBySlot(garments, "tshirt"),
    [garments],
  );
  const joggers = useMemo(
    () => garmentsBySlot(garments, "jogger"),
    [garments],
  );

  const initialTshirtIndex = Math.max(
    0,
    tshirts.findIndex((g) => g.slug === initialSlug),
  );
  const initialJoggerIndex = Math.max(
    0,
    joggers.findIndex((g) => g.slug === initialSlug),
  );

  const [tshirtIndex, setTshirtIndex] = useState(initialTshirtIndex);
  const [joggerIndex, setJoggerIndex] = useState(initialJoggerIndex);
  const [tshirtDir, setTshirtDir] = useState<1 | -1>(1);
  const [joggerDir, setJoggerDir] = useState<1 | -1>(1);

  const tshirt = tshirts[tshirtIndex] ?? garments[0];
  const jogger = joggers[joggerIndex] ?? garments[0];

  const { view, setView, rotate } = useGarmentView("front");
  const { dragOffset, dragHandlers } = useDragRotate(rotate);

  const stepTshirt = useCallback(
    (step: 1 | -1) => {
      if (tshirts.length === 0) return;
      setTshirtDir(step);
      setTshirtIndex(
        (current) => (current + step + tshirts.length) % tshirts.length,
      );
    },
    [tshirts.length],
  );

  const stepJogger = useCallback(
    (step: 1 | -1) => {
      if (joggers.length === 0) return;
      setJoggerDir(step);
      setJoggerIndex(
        (current) => (current + step + joggers.length) % joggers.length,
      );
    },
    [joggers.length],
  );

  const randomizeOutfit = useCallback(() => {
    setTshirtDir(1);
    setJoggerDir(1);
    if (tshirts.length > 1) {
      setTshirtIndex((current) => {
        const offset = 1 + Math.floor(Math.random() * (tshirts.length - 1));
        return (current + offset) % tshirts.length;
      });
    }
    if (joggers.length > 1) {
      setJoggerIndex((current) => {
        const offset = 1 + Math.floor(Math.random() * (joggers.length - 1));
        return (current + offset) % joggers.length;
      });
    }
  }, [tshirts.length, joggers.length]);

  useRoomKeys({
    enabled: active,
    onRotate: rotate,
    onSetView: setView,
    onGarmentStep: stepTshirt,
  });

  // Keep ?g=<tshirt-slug> in the URL so a look stays shareable without a route change.
  useEffect(() => {
    if (!active || !tshirt) return;
    const url = new URL(window.location.href);
    url.searchParams.set("g", tshirt.slug);
    window.history.replaceState(null, "", url);
  }, [active, tshirt]);

  return (
    <section
      id="fitting-room"
      tabIndex={-1}
      aria-label="Virtual fitting room"
      className="relative flex min-h-dvh flex-col bg-white px-5 py-6 sm:px-8 lg:px-12"
    >
      <header className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onExit}
          className="font-display text-lg tracking-tight transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {studio.name}
        </button>
        <p className="eyebrow hidden sm:block">Stickman Fitting Room</p>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* the stage: stickman + worn clothes + angle bar */}
        <div className="flex flex-col gap-5">
          <GarmentStage
            tshirt={tshirt}
            jogger={jogger}
            tshirtDir={tshirtDir}
            joggerDir={joggerDir}
            onStepTshirt={stepTshirt}
            onStepJogger={stepJogger}
            onRandomize={randomizeOutfit}
            view={view}
            dragOffset={dragOffset}
            dragHandlers={dragHandlers}
          />
          <ViewSwitcher view={view} onSetView={setView} onRotate={rotate} />
          <p className="hidden text-center text-xs text-ink-faint lg:block">
            Slide the bar or press <kbd className="font-sans">←</kbd>{" "}
            <kbd className="font-sans">→</kbd> to rotate · Push the arrows to
            slide clothes left to right
          </p>
        </div>

        {/* the active outfit controls & details (no catalog grid) */}
        <div className="flex flex-col gap-6">
          <GarmentDetails
            tshirt={tshirt}
            jogger={jogger}
            tshirtDir={tshirtDir}
            joggerDir={joggerDir}
            tshirtIndex={tshirtIndex}
            tshirtTotal={tshirts.length}
            joggerIndex={joggerIndex}
            joggerTotal={joggers.length}
            onStepTshirt={stepTshirt}
            onStepJogger={stepJogger}
            onRandomize={randomizeOutfit}
          />
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="eyebrow">
          © {studio.year} {studio.name}
        </p>
        <SocialLinks />
      </footer>

      {active ? <ViewPreloader garments={garments} /> : null}
    </section>
  );
}
