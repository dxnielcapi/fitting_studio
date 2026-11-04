"use client";

import { useCallback, useEffect, useState } from "react";
import type { Garment } from "@/lib/types";
import { Welcome } from "@/components/welcome/Welcome";
import { FittingRoom } from "@/components/fitting-room/FittingRoom";

/**
 * One route, two scenes. The welcome page is a curtain pinned over the fitting
 * room; entering lifts it away. Keeps the whole experience on `/` while the
 * room still owns a shareable `?g=<slug>` state.
 */
export function StudioExperience({ garments }: { garments: Garment[] }) {
  // One piece of state so the deep-link read below is a single update.
  const [scene, setScene] = useState<{ entered: boolean; slug?: string }>({
    entered: false,
  });
  const { entered, slug: initialSlug } = scene;

  const enter = useCallback(
    () => setScene((s) => ({ ...s, entered: true })),
    [],
  );
  const exit = useCallback(() => {
    setScene((s) => ({ ...s, entered: false }));
    window.scrollTo({ top: 0 });
  }, []);

  // A shared link (?g=slug) lands straight in the room on that garment.
  // The URL is external state we read once on mount; the welcome page stays
  // the prerendered HTML, and the curtain lifts right after hydration.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("g");
    if (slug && garments.some((g) => g.slug === slug)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScene({ entered: true, slug });
    }
  }, [garments]);

  // Lock the page behind the curtain.
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  // Scrolling or pressing down also lifts the curtain.
  useEffect(() => {
    if (entered) return;

    function onWheel(event: WheelEvent) {
      if (event.deltaY > 8) enter();
    }
    function onKey(event: KeyboardEvent) {
      if (["ArrowDown", "PageDown", "Enter", " ", "Spacebar"].includes(event.key)) {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === "BUTTON" || target?.tagName === "A") return;
        event.preventDefault();
        enter();
      }
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [entered, enter]);

  // Hand focus to the room so keyboard users follow the curtain.
  useEffect(() => {
    if (!entered) return;
    document.getElementById("fitting-room")?.focus({ preventScroll: true });
  }, [entered]);

  const teasers = garments.filter((g) => g.featured).slice(0, 3);

  return (
    <>
      <FittingRoom
        key={initialSlug ?? "default"}
        garments={garments}
        active={entered}
        initialSlug={initialSlug}
        onExit={exit}
      />

      <div
        aria-hidden={entered}
        inert={entered}
        className="fixed inset-0 z-50 will-change-transform"
        style={{
          transform: entered ? "translate3d(0,-100%,0)" : "translate3d(0,0,0)",
          transition: "transform 900ms var(--ease-room)",
          boxShadow: "0 24px 60px rgba(28,26,23,0.18)",
        }}
      >
        <Welcome onEnter={enter} teasers={teasers} hidden={entered} />
      </div>
    </>
  );
}
