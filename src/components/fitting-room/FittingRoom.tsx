"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Garment } from "@/lib/types";
import { garmentsBySlot } from "@/data/garments";
import { useGarmentView } from "@/lib/hooks/useGarmentView";
import { useRoomKeys } from "@/lib/hooks/useRoomKeys";
import { useDragRotate } from "@/lib/hooks/useDragRotate";
import { studio } from "@/data/studio";
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
  const [randomCount, setRandomCount] = useState(0);
  // Bump on every slot change; the stickman pose routines key off these.
  const [tshirtCount, setTshirtCount] = useState(0);
  const [joggerCount, setJoggerCount] = useState(0);

  const tshirt = tshirts[tshirtIndex] ?? garments[0];
  const jogger = joggers[joggerIndex] ?? garments[0];

  const { view, setView, rotate } = useGarmentView("front");
  const { dragOffset, dragHandlers } = useDragRotate(rotate);

  // One slide at a time per slot. Without this, clicks landing mid-slide stack
  // up extra outgoing layers — the ghosting this used to have. Read in an event
  // handler, never during render.
  const lastStep = useRef({ tshirt: 0, jogger: 0 });
  const SLIDE_MS = 340;

  const stepTshirt = useCallback(
    (step: 1 | -1) => {
      if (tshirts.length === 0) return;
      const now = performance.now();
      if (now - lastStep.current.tshirt < SLIDE_MS) return;
      lastStep.current.tshirt = now;
      setTshirtDir(step);
      setTshirtCount((c) => c + 1);
      setTshirtIndex(
        (current) => (current + step + tshirts.length) % tshirts.length,
      );
    },
    [tshirts.length],
  );

  const stepJogger = useCallback(
    (step: 1 | -1) => {
      if (joggers.length === 0) return;
      const now = performance.now();
      if (now - lastStep.current.jogger < SLIDE_MS) return;
      lastStep.current.jogger = now;
      setJoggerDir(step);
      setJoggerCount((c) => c + 1);
      setJoggerIndex(
        (current) => (current + step + joggers.length) % joggers.length,
      );
    },
    [joggers.length],
  );

  const randomizeOutfit = useCallback(() => {
    setRandomCount((c) => c + 1);
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
      aria-label="Probador virtual"
      className="relative flex min-h-dvh flex-col justify-between bg-white px-5 py-6 sm:px-8 lg:px-12 lg:py-4"
    >
      <header className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onExit}
          className="font-display text-lg tracking-tight transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {studio.name}
        </button>
        <p className="eyebrow hidden sm:block">Probador</p>
      </header>

      {/* Centered fitting room: stickman + angle bar + bottom garment titles & details toggle */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 py-4 lg:max-w-3xl lg:gap-5 lg:py-0 xl:max-w-4xl 2xl:max-w-5xl">
        <GarmentStage
          tshirt={tshirt}
          jogger={jogger}
          tshirtDir={tshirtDir}
          joggerDir={joggerDir}
          randomCount={randomCount}
          tshirtCount={tshirtCount}
          joggerCount={joggerCount}
          onStepTshirt={stepTshirt}
          onStepJogger={stepJogger}
          onRandomize={randomizeOutfit}
          view={view}
          dragOffset={dragOffset}
          dragHandlers={dragHandlers}
        />

        <ViewSwitcher view={view} onSetView={setView} onRotate={rotate} />

        <GarmentDetails
          tshirt={tshirt}
          jogger={jogger}
          tshirtDir={tshirtDir}
          joggerDir={joggerDir}
        />
      </div>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 pt-4">
        <p className="eyebrow">
          © {studio.year} {studio.name}
        </p>
      </footer>

      {active ? <ViewPreloader garments={garments} /> : null}
    </section>
  );
}
