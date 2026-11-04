"use client";

import Image from "next/image";
import type { Garment } from "@/lib/types";

type Props = {
  garments: Garment[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function GarmentRail({ garments, activeSlug, onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="eyebrow mb-3">The collection — {garments.length} pieces</p>
      <ul className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {garments.map((garment) => {
          const isActive = garment.slug === activeSlug;
          return (
            <li key={garment.slug} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => onSelect(garment.slug)}
                aria-current={isActive ? "true" : undefined}
                className={`flex w-[108px] flex-col gap-2 rounded-2xl border p-2 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:w-full ${
                  isActive
                    ? "border-ink bg-paper shadow-[0_8px_24px_rgba(28,26,23,0.08)]"
                    : "border-transparent bg-paper/40 hover:border-line hover:bg-paper/80"
                }`}
              >
                <span className="stage-backdrop relative flex aspect-3/4 items-end justify-center overflow-hidden rounded-xl">
                  <Image
                    src={garment.views.front.src}
                    alt=""
                    width={garment.views.front.width}
                    height={garment.views.front.height}
                    sizes="120px"
                    className="h-[84%] w-auto object-contain pb-1"
                  />
                </span>
                <span className="flex items-center gap-1.5 px-0.5">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full ring-1 ring-ink/10"
                    style={{ background: garment.swatch }}
                  />
                  <span
                    className={`truncate text-[0.7rem] leading-tight font-medium ${
                      isActive ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {garment.name}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
