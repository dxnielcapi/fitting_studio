"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* ---------------------------------------------------------------
   Hero cursor grid: an aleatory trail of grid-snapped square boxes
   carrying the studio's ASCII glyphs (S,Y,L,E,s,y,l,e,S,T,U,D,I,O,0,$,#).
   Each box is randomly styled in one of two high-contrast themes:
   - White fill with a black border line and black letter
   - Black fill with a white border line and white letter
   --------------------------------------------------------------- */

const ASCII_GLYPHS = [
  "S",
  "Y",
  "L",
  "E",
  "s",
  "y",
  "l",
  "e",
  "S",
  "T",
  "U",
  "D",
  "I",
  "O",
  "0",
  "$",
  "#",
] as const;

const CELL_SIZE = 16;
const MAX_CELLS = 180;

type BoxVariant = "white" | "black";

type GridBox = {
  col: number;
  row: number;
  age: number;
  life: number;
  glyph: string;
  variant: BoxVariant;
  mutateEvery: number;
  nextMutate: number;
};

function randomGlyph(): string {
  return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
}

function randomVariant(): BoxVariant {
  return Math.random() < 0.5 ? "white" : "black";
}

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function CursorSmoke({ active = true }: { active?: boolean }) {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reduceMotion || !active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const cells = new Map<string, GridBox>();
    let rafId: number | null = null;
    let lastTime = performance.now();

    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;

    function spawnCell(col: number, row: number) {
      if (col < 0 || row < 0) return;
      if (col * CELL_SIZE > width || row * CELL_SIZE > height) return;

      const key = `${col}:${row}`;
      const existing = cells.get(key);
      const mutateEvery = randBetween(0.055, 0.14);

      if (existing) {
        existing.age = 0;
        existing.life = randBetween(0.28, 0.72);
        existing.glyph = randomGlyph();
        if (Math.random() < 0.45) {
          existing.variant = randomVariant();
        }
        existing.mutateEvery = mutateEvery;
        existing.nextMutate = mutateEvery;
        return;
      }

      if (cells.size >= MAX_CELLS) {
        const oldestKey = cells.keys().next().value;
        if (oldestKey !== undefined) {
          cells.delete(oldestKey);
        }
      }

      cells.set(key, {
        col,
        row,
        age: 0,
        life: randBetween(0.28, 0.78),
        glyph: randomGlyph(),
        variant: randomVariant(),
        mutateEvery,
        nextMutate: mutateEvery,
      });
    }

    function spawnClusterAt(x: number, y: number) {
      const baseCol = Math.floor(x / CELL_SIZE);
      const baseRow = Math.floor(y / CELL_SIZE);

      // Always light up the cell directly under the pointer or an immediate neighbour
      if (Math.random() < 0.85) {
        spawnCell(baseCol, baseRow);
      }

      // Aleatory scatter of neighbouring grid boxes around the cursor
      const extraCount = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < extraCount; i += 1) {
        const radius = Math.random() < 0.72 ? 1 : 2;
        const offsetCol = Math.round(randBetween(-radius, radius));
        const offsetRow = Math.round(randBetween(-radius, radius));
        spawnCell(baseCol + offsetCol, baseRow + offsetRow);
      }
    }

    function renderFrame(now: number) {
      if (!ctx) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      ctx.font = `600 9.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 1;

      for (const [key, cell] of cells.entries()) {
        cell.age += dt;

        if (cell.age >= cell.life) {
          cells.delete(key);
          continue;
        }

        // Aleatory glyph & occasional theme flip while the grid box is alive
        if (cell.age >= cell.nextMutate) {
          cell.glyph = randomGlyph();
          if (Math.random() < 0.18) {
            cell.variant = cell.variant === "white" ? "black" : "white";
          }
          cell.nextMutate += cell.mutateEvery;
        }

        const progress = cell.age / cell.life;
        // Stay crisp for most of the lifetime, then fade out cleanly at the tail
        const alpha =
          progress < 0.72 ? 1 : Math.max(0, 1 - (progress - 0.72) / 0.28);

        const x = cell.col * CELL_SIZE;
        const y = cell.row * CELL_SIZE;
        const isWhite = cell.variant === "white";

        ctx.save();
        ctx.globalAlpha = alpha;

        // Box background fill
        ctx.fillStyle = isWhite ? "#ffffff" : "#111111";
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

        // 1px border line inset by 0.5px so both white-on-black and black-on-white
        // outlines stay razor-sharp even when boxes touch each other.
        ctx.strokeStyle = isWhite ? "#111111" : "#ffffff";
        ctx.strokeRect(x + 0.5, y + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);

        // Centered ASCII character
        ctx.fillStyle = isWhite ? "#111111" : "#ffffff";
        ctx.fillText(cell.glyph, x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 0.5);

        ctx.restore();
      }

      if (cells.size > 0) {
        rafId = requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    }

    function ensureLoop() {
      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderFrame);
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lastPointerX = null;
        lastPointerY = null;
        return;
      }

      if (lastPointerX === null || lastPointerY === null) {
        lastPointerX = x;
        lastPointerY = y;
        spawnClusterAt(x, y);
        ensureLoop();
        return;
      }

      const dx = x - lastPointerX;
      const dy = y - lastPointerY;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) return;

      const steps = Math.min(12, Math.max(1, Math.ceil(dist / (CELL_SIZE * 0.55))));
      for (let s = 1; s <= steps; s += 1) {
        const t = s / steps;
        spawnClusterAt(lastPointerX + dx * t, lastPointerY + dy * t);
      }

      lastPointerX = x;
      lastPointerY = y;
      ensureLoop();
    }

    function resetPointer() {
      lastPointerX = null;
      lastPointerY = null;
    }

    const heroSection =
      (canvas.closest(".stage-backdrop") as HTMLElement | null) ?? window;

    heroSection.addEventListener(
      "pointermove",
      onPointerMove as EventListener,
      { passive: true },
    );
    heroSection.addEventListener(
      "pointerleave",
      resetPointer as EventListener,
    );
    window.addEventListener("blur", resetPointer);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      heroSection.removeEventListener(
        "pointermove",
        onPointerMove as EventListener,
      );
      heroSection.removeEventListener(
        "pointerleave",
        resetPointer as EventListener,
      );
      window.removeEventListener("blur", resetPointer);
    };
  }, [active, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none"
    />
  );
}
