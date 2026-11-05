"use client";

import { studio } from "@/data/studio";
import { SocialLinks } from "@/components/welcome/SocialLinks";

/**
 * Sits above the curtain (z-60) and carries the social links.
 * Shown on the hero and again at the very bottom of the page; it slides
 * out of the way for the fitting room itself.
 */
export function NavBar({ visible }: { visible: boolean }) {
  return (
    <nav
      aria-label="Navegación principal"
      aria-hidden={!visible}
      inert={!visible}
      className="fixed inset-x-0 top-0 z-[60] will-change-transform"
      style={{
        transform: visible ? "translate3d(0,0,0)" : "translate3d(0,-100%,0)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 560ms var(--ease-room), opacity 300ms ease-out",
      }}
    >
      <div className="flex items-center justify-between gap-4 bg-white/85 px-5 py-4 backdrop-blur-sm sm:px-8 lg:px-12">
        <p className="font-display text-lg tracking-tight">{studio.name}</p>
        <SocialLinks />
      </div>
    </nav>
  );
}
