"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Garment } from "@/lib/types";
import { studio } from "@/data/studio";
import { SocialLinks } from "./SocialLinks";
import { ArrowDownIcon } from "@/components/ui/Icons";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  onEnter: () => void;
  teasers: Garment[];
  hidden: boolean;
};

export function Welcome({ onEnter, teasers, hidden }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
      className="stage-backdrop relative flex h-dvh flex-col justify-between overflow-hidden px-5 py-8 sm:px-8 lg:px-12"
    >
      <motion.header
        variants={rise}
        transition={{ duration: 0.6, ease }}
        className="flex items-center justify-between"
      >
        <p className="font-display text-lg tracking-tight">{studio.name}</p>
        <p className="eyebrow hidden sm:block">{studio.year}</p>
      </motion.header>

      <div className="mx-auto w-full max-w-5xl">
        <motion.p
          variants={rise}
          transition={{ duration: 0.6, ease }}
          className="eyebrow mb-6"
        >
          Virtual fitting room
        </motion.p>

        <motion.h1
          variants={rise}
          transition={{ duration: 0.7, ease }}
          className="font-display text-[clamp(2.75rem,9vw,7rem)] leading-[0.92] tracking-[-0.045em] text-balance"
        >
          {studio.tagline}
        </motion.h1>

        <motion.p
          variants={rise}
          transition={{ duration: 0.6, ease }}
          className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-soft"
        >
          {studio.intro}
        </motion.p>

        <motion.div
          variants={rise}
          transition={{ duration: 0.6, ease }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <button
            type="button"
            onClick={onEnter}
            tabIndex={hidden ? -1 : 0}
            className="group flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-medium tracking-wide text-paper transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            Enter the fitting room
            <ArrowDownIcon className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
          <SocialLinks />
        </motion.div>
      </div>

      <motion.footer
        variants={rise}
        transition={{ duration: 0.6, ease }}
        className="flex items-end justify-between gap-6"
      >
        <p className="eyebrow flex items-center gap-2">
          <ArrowDownIcon className="size-3.5" />
          <span className="sm:hidden">Swipe up to enter</span>
          <span className="hidden sm:inline">Scroll to enter</span>
        </p>

        {/* a glimpse of what is behind the curtain */}
        <ul aria-hidden="true" className="flex items-end gap-1 sm:gap-3">
          {teasers.map((garment, i) => (
            <motion.li
              key={garment.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.5 + i * 0.12 }}
            >
              <Image
                src={garment.views.front.src}
                alt=""
                width={garment.views.front.width}
                height={garment.views.front.height}
                sizes="80px"
                priority={i === 0}
                className="h-14 w-auto object-contain sm:h-20"
              />
            </motion.li>
          ))}
        </ul>
      </motion.footer>
    </motion.div>
  );
}
