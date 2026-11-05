"use client";

import { motion, useReducedMotion } from "motion/react";
import { studio } from "@/data/studio";
import { ArrowDownIcon } from "@/components/ui/Icons";
import { CursorSmoke } from "@/components/welcome/CursorSmoke";
import { LogoTrace } from "@/components/welcome/LogoTrace";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  onEnter: () => void;
  hidden: boolean;
};

export function Welcome({ onEnter, hidden }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
      className="stage-backdrop relative flex h-dvh flex-col overflow-hidden px-5 pt-24 pb-8 sm:px-8 lg:px-12"
    >
      {/* The brand and the social links live in the nav bar above this. */}

      {/* One oversized mark, drawn by a travelling hairline. Sits under
          everything and takes no clicks. */}
      <motion.div
        variants={fade}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
        className="absolute inset-0"
      >
        <LogoTrace />
      </motion.div>

      <CursorSmoke active={!hidden} />

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
        <motion.p
          variants={rise}
          transition={{ duration: 0.6, ease }}
          className="eyebrow mb-6"
        >
          Probador virtual
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
      </div>

      {/* Centred call to action at the foot of the hero */}
      <motion.div
        variants={rise}
        transition={{ duration: 0.6, ease }}
        className="relative flex flex-col items-center gap-3"
      >
        <button
          type="button"
          onClick={onEnter}
          tabIndex={hidden ? -1 : 0}
          className="group flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-medium tracking-wide text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          Entrar al probador
          <motion.span
            aria-hidden="true"
            className="flex"
            animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowDownIcon className="size-4" />
          </motion.span>
        </button>

        <p className="eyebrow text-center">
          <span className="sm:hidden">Desliza hacia arriba para entrar</span>
          <span className="hidden sm:inline">Baja para entrar</span>
        </p>

      </motion.div>
    </motion.div>
  );
}
