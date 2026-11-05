"use client";

import { useEffect, useRef, useState } from "react";
import type { ViewKey } from "@/lib/types";

export type StickmanPose = {
  torsoX: number;
  torsoY: number;
  headX: number;
  headY: number;
  headTilt: number;
  shoulderLY: number;
  shoulderRY: number;
  elbowLX: number;
  elbowLY: number;
  handLX: number;
  handLY: number;
  elbowRX: number;
  elbowRY: number;
  handRX: number;
  handRY: number;
  hipX: number;
  hipY: number;
  kneeLX: number;
  kneeLY: number;
  ankleLX: number;
  ankleLY: number;
  footLX: number;
  footLY: number;
  kneeRX: number;
  kneeRY: number;
  ankleRX: number;
  ankleRY: number;
  footRX: number;
  footRY: number;
};

const NEUTRAL_POSE: StickmanPose = {
  torsoX: 0,
  torsoY: 0,
  headX: 0,
  headY: 0,
  headTilt: 0,
  shoulderLY: 0,
  shoulderRY: 0,
  elbowLX: 0,
  elbowLY: 0,
  handLX: 0,
  handLY: 0,
  elbowRX: 0,
  elbowRY: 0,
  handRX: 0,
  handRY: 0,
  hipX: 0,
  hipY: 0,
  kneeLX: 0,
  kneeLY: 0,
  ankleLX: 0,
  ankleLY: 0,
  footLX: 0,
  footLY: 0,
  kneeRX: 0,
  kneeRY: 0,
  ankleRX: 0,
  ankleRY: 0,
  footRX: 0,
  footRY: 0,
};

type Keyframe = {
  /** Normalized time 0..1 */
  t: number;
  pose: Partial<StickmanPose>;
};

type Routine = {
  durationMs: number;
  keyframes: Keyframe[];
};

/**
 * 4 smooth outfit-inspection routines when "Random" is pushed.
 * Because all limbs are drawn from connected joint coordinates,
 * the stickman never breaks or detaches at any joint.
 */
const RANDOM_ROUTINES: Routine[] = [
  // 0: Sleeve & Fit Inspection — look down left & lift left forearm, then right, then center check
  {
    durationMs: 1450,
    keyframes: [
      { t: 0, pose: {} },
      {
        t: 0.28,
        pose: {
          headX: -15,
          headY: 18,
          headTilt: -8,
          torsoX: -2,
          torsoY: 3,
          shoulderLY: -4,
          elbowLX: -8,
          elbowLY: -8,
          handLX: -34,
          handLY: -48,
          handRX: 10,
          handRY: -10,
        },
      },
      {
        t: 0.58,
        pose: {
          headX: 15,
          headY: 18,
          headTilt: 8,
          torsoX: 2,
          torsoY: 3,
          shoulderLY: 0,
          shoulderRY: -4,
          elbowLX: -2,
          elbowLY: -2,
          handLX: -8,
          handLY: -10,
          elbowRX: 8,
          elbowRY: -8,
          handRX: 34,
          handRY: -48,
        },
      },
      {
        t: 0.82,
        pose: {
          headX: 0,
          headY: 22,
          headTilt: 0,
          torsoX: 0,
          torsoY: 4,
          handLX: 14,
          handLY: -20,
          handRX: -14,
          handRY: -20,
        },
      },
      { t: 1, pose: NEUTRAL_POSE },
    ],
  },
  // 1: Waist & Silhouette Check — hands curve in toward hips, subtle hip/torso sway while looking down
  {
    durationMs: 1500,
    keyframes: [
      { t: 0, pose: {} },
      {
        t: 0.3,
        pose: {
          headX: -10,
          headY: 17,
          headTilt: -6,
          torsoX: 4,
          torsoY: 3,
          hipX: -6,
          elbowLX: -10,
          elbowLY: -6,
          handLX: 44,
          handLY: -38,
          elbowRX: 10,
          elbowRY: -6,
          handRX: -44,
          handRY: -38,
          kneeLX: -4,
          kneeRX: -3,
        },
      },
      {
        t: 0.65,
        pose: {
          headX: 10,
          headY: 19,
          headTilt: 6,
          torsoX: -4,
          torsoY: 3,
          hipX: 6,
          elbowLX: -10,
          elbowLY: -6,
          handLX: 44,
          handLY: -38,
          elbowRX: 10,
          elbowRY: -6,
          handRX: -44,
          handRY: -38,
          kneeLX: 3,
          kneeRX: 4,
        },
      },
      { t: 1, pose: NEUTRAL_POSE },
    ],
  },
  // 2: Jogger Cuff & Shoe Check — look down at legs, lift right heel & tap left foot
  {
    durationMs: 1450,
    keyframes: [
      { t: 0, pose: {} },
      {
        t: 0.34,
        pose: {
          headX: 12,
          headY: 24,
          headTilt: 9,
          torsoX: 3,
          torsoY: 5,
          handRX: -26,
          handRY: -28,
          handLX: -12,
          handLY: -14,
          kneeRX: 6,
          kneeRY: -6,
          ankleRX: 4,
          ankleRY: -18,
          footRX: 8,
          footRY: 12,
        },
      },
      {
        t: 0.68,
        pose: {
          headX: -10,
          headY: 22,
          headTilt: -7,
          torsoX: -2,
          torsoY: 4,
          handLX: 24,
          handLY: -24,
          handRX: 8,
          handRY: -10,
          kneeRX: 0,
          kneeRY: 0,
          ankleRX: 0,
          ankleRY: 0,
          footRX: 0,
          footRY: 0,
          kneeLX: -5,
          kneeLY: -4,
          ankleLY: -14,
          footLX: -6,
          footLY: 10,
        },
      },
      { t: 1, pose: NEUTRAL_POSE },
    ],
  },
  // 3: Collar Shrug & Smooth Down — gentle shoulder shrug, then hands smooth down the front
  {
    durationMs: 1400,
    keyframes: [
      { t: 0, pose: {} },
      {
        t: 0.26,
        pose: {
          headX: 0,
          headY: 12,
          torsoY: -3,
          shoulderLY: -9,
          shoulderRY: -9,
          elbowLX: -8,
          elbowLY: -10,
          handLX: 32,
          handLY: -54,
          elbowRX: 8,
          elbowRY: -10,
          handRX: -32,
          handRY: -54,
        },
      },
      {
        t: 0.64,
        pose: {
          headX: -5,
          headY: 20,
          headTilt: -4,
          torsoY: 4,
          shoulderLY: 3,
          shoulderRY: 3,
          elbowLX: -4,
          elbowLY: 0,
          handLX: 22,
          handLY: -12,
          elbowRX: 4,
          elbowRY: 0,
          handRX: -22,
          handRY: -12,
        },
      },
      { t: 1, pose: NEUTRAL_POSE },
    ],
  },
];

/** Subtle upper-body settle when changing the t-shirt */
const TSHIRT_ROUTINE: Routine = {
  durationMs: 820,
  keyframes: [
    { t: 0, pose: {} },
    {
      t: 0.35,
      pose: {
        headY: 14,
        torsoY: -2,
        shoulderLY: -7,
        shoulderRY: -7,
        elbowLX: -6,
        elbowLY: -6,
        handLX: -22,
        handLY: -28,
        elbowRX: 6,
        elbowRY: -6,
        handRX: 22,
        handRY: -28,
      },
    },
    {
      t: 0.7,
      pose: {
        headY: 16,
        headX: 5,
        headTilt: 4,
        torsoY: 2,
        shoulderLY: 2,
        shoulderRY: 2,
        handLX: 12,
        handLY: -14,
        handRX: -12,
        handRY: -14,
      },
    },
    { t: 1, pose: NEUTRAL_POSE },
  ],
};

/** Subtle lower-body glance & stance check when changing the jogger */
const JOGGER_ROUTINE: Routine = {
  durationMs: 860,
  keyframes: [
    { t: 0, pose: {} },
    {
      t: 0.38,
      pose: {
        headY: 21,
        headX: -8,
        headTilt: -6,
        torsoY: 4,
        hipX: -4,
        handLX: -16,
        handLY: -18,
        handRX: 16,
        handRY: -18,
        kneeRX: 5,
        ankleRY: -14,
        footRY: 9,
      },
    },
    {
      t: 0.72,
      pose: {
        headY: 19,
        headX: 7,
        headTilt: 5,
        torsoY: 3,
        hipX: 4,
        kneeLX: -4,
        ankleLY: -10,
        footLY: 7,
      },
    },
    { t: 1, pose: NEUTRAL_POSE },
  ],
};

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function interpolatePose(
  from: StickmanPose,
  to: StickmanPose,
  alpha: number,
): StickmanPose {
  const e = easeInOutCubic(Math.max(0, Math.min(1, alpha)));
  const out = { ...NEUTRAL_POSE };
  const keys = Object.keys(NEUTRAL_POSE) as (keyof StickmanPose)[];
  for (const k of keys) {
    out[k] = from[k] + (to[k] - from[k]) * e;
  }
  return out;
}

export function useStickmanPose({
  randomCount,
  tshirtCount,
  joggerCount,
}: {
  randomCount: number;
  tshirtCount: number;
  joggerCount: number;
}): StickmanPose {
  const [pose, setPose] = useState<StickmanPose>(NEUTRAL_POSE);
  const currentPoseRef = useRef<StickmanPose>(NEUTRAL_POSE);
  const rafRef = useRef<number | null>(null);

  const prevCounts = useRef({
    random: randomCount,
    tshirt: tshirtCount,
    jogger: joggerCount,
  });

  useEffect(() => {
    const prev = prevCounts.current;
    let routine: Routine | null = null;

    if (randomCount !== prev.random) {
      routine =
        RANDOM_ROUTINES[(randomCount - 1) % RANDOM_ROUTINES.length] ??
        RANDOM_ROUTINES[0];
    } else if (tshirtCount !== prev.tshirt) {
      routine = TSHIRT_ROUTINE;
    } else if (joggerCount !== prev.jogger) {
      routine = JOGGER_ROUTINE;
    }

    prevCounts.current = {
      random: randomCount,
      tshirt: tshirtCount,
      jogger: joggerCount,
    };

    if (!routine) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const startPose = { ...currentPoseRef.current };
    const resolvedFrames = routine.keyframes.map((kf, idx) => ({
      t: kf.t,
      pose:
        idx === 0
          ? startPose
          : ({ ...NEUTRAL_POSE, ...kf.pose } satisfies StickmanPose),
    }));

    const startTime = performance.now();
    const duration = routine.durationMs;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Find active keyframe segment
      let segIndex = 0;
      for (let i = 0; i < resolvedFrames.length - 1; i++) {
        if (progress >= resolvedFrames[i].t) {
          segIndex = i;
        }
      }

      const a = resolvedFrames[segIndex];
      const b = resolvedFrames[segIndex + 1] ?? a;
      const span = Math.max(0.0001, b.t - a.t);
      const localAlpha = (progress - a.t) / span;

      const nextPose =
        progress >= 1
          ? NEUTRAL_POSE
          : interpolatePose(a.pose, b.pose, localAlpha);

      currentPoseRef.current = nextPose;
      setPose(nextPose);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [randomCount, tshirtCount, joggerCount]);

  return pose;
}

type Props = {
  view: ViewKey;
  pose?: StickmanPose;
};

/**
 * Minimalist architectural stickman rendered in the same 900x1200 coordinate
 * space as the garment cutouts. Every limb and joint is drawn from shared
 * vertex coordinates so the figure never breaks or detaches during animations.
 */
export function StickmanFigure({ view, pose = NEUTRAL_POSE }: Props) {
  const isSide = view === "left" || view === "right";
  const isBack = view === "back";
  const flipSide = view === "left";

  if (isSide) {
    // Connected Side View Skeleton
    const shoulderX = 452 + pose.torsoX * 0.7;
    const shoulderY = 250 + pose.torsoY;

    const headCx = 455 + pose.torsoX * 0.7 + Math.abs(pose.headX) * 0.35 + pose.headY * 0.35;
    const headCy = 135 + pose.torsoY + pose.headY;
    const headR = 54;

    // Connect neck strictly to the head perimeter toward shoulder
    const neckDx = shoulderX - headCx;
    const neckDy = shoulderY - headCy;
    const neckDist = Math.hypot(neckDx, neckDy) || 1;
    const neckTopX = headCx + (neckDx / neckDist) * headR;
    const neckTopY = headCy + (neckDy / neckDist) * headR;

    // Eye/gaze indicator tilts downward when headY > 0
    const pitchRad = (pose.headY * 1.1 * Math.PI) / 180;
    const gazeStartX = headCx + Math.cos(pitchRad) * 37;
    const gazeStartY = headCy - 5 + Math.sin(pitchRad) * 37;
    const gazeEndX = headCx + Math.cos(pitchRad) * 54;
    const gazeEndY = headCy - 5 + Math.sin(pitchRad) * 54;

    const hipX = 455 + pose.hipX * 0.6;
    const hipY = 575 + pose.hipY;

    const elbowX = 468 + pose.torsoX * 0.7 + pose.elbowRX * 0.6;
    const elbowY = 415 + pose.torsoY + pose.elbowRY;
    const handX = 448 + pose.torsoX * 0.7 + pose.handRX * 0.7 + pose.headY * 0.4;
    const handY = 565 + pose.torsoY + pose.handRY;

    const backKneeX = 432 + pose.hipX * 0.5 + pose.kneeLX * 0.5;
    const backKneeY = 800 + pose.kneeLY;
    const backAnkleX = 425 + pose.ankleLX * 0.5;
    const backAnkleY = 1035 + pose.ankleLY;
    const backFootX = 465 + pose.ankleLX * 0.5 + pose.footLX;
    const backFootY = 1035 + pose.ankleLY + pose.footLY;

    const frontKneeX = 468 + pose.hipX * 0.5 + pose.kneeRX * 0.5;
    const frontKneeY = 800 + pose.kneeRY;
    const frontAnkleX = 460 + pose.ankleRX * 0.5;
    const frontAnkleY = 1045 + pose.ankleRY;
    const frontFootX = 508 + pose.ankleRX * 0.5 + pose.footRX;
    const frontFootY = 1045 + pose.ankleRY + pose.footRY;

    return (
      <svg
        viewBox="0 0 900 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-full w-full select-none"
      >
        <g
          transform={flipSide ? "translate(900, 0) scale(-1, 1)" : undefined}
          stroke="#111111"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Connected Neck & Spine */}
          <path
            d={`M ${neckTopX} ${neckTopY} L ${shoulderX} ${shoulderY} Q ${442 + pose.torsoX * 0.4} 410 ${hipX} ${hipY}`}
          />

          {/* Head */}
          <circle cx={headCx} cy={headCy} r={headR} fill="#ffffff" />
          <line
            x1={gazeStartX}
            y1={gazeStartY}
            x2={gazeEndX}
            y2={gazeEndY}
            strokeWidth="9"
          />

          {/* Back leg (connected hip -> knee -> ankle -> foot) */}
          <path
            d={`M ${hipX - 7} ${hipY} L ${backKneeX} ${backKneeY} L ${backAnkleX} ${backAnkleY} L ${backFootX} ${backFootY}`}
            stroke="#8a8a8a"
            strokeWidth="10"
          />

          {/* Front leg (connected hip -> knee -> ankle -> foot) */}
          <path
            d={`M ${hipX} ${hipY} L ${frontKneeX} ${frontKneeY} L ${frontAnkleX} ${frontAnkleY} L ${frontFootX} ${frontFootY}`}
          />
          <circle cx={hipX} cy={hipY} r="7" fill="#111111" stroke="none" />

          {/* Side Arm (connected shoulder -> elbow -> hand) */}
          <path
            d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${handX} ${handY}`}
          />
          <circle
            cx={shoulderX}
            cy={shoulderY}
            r="7"
            fill="#111111"
            stroke="none"
          />
        </g>
      </svg>
    );
  }

  // Connected Front / Back View Skeleton
  const shoulderCenterX = 450 + pose.torsoX;
  const shoulderCenterY = 245 + pose.torsoY;

  const headCx = 450 + pose.torsoX + pose.headX;
  const headCy = 135 + pose.torsoY + pose.headY;
  const headR = 54;

  // Connect neck strictly to the bottom perimeter of the head circle
  const neckDx = shoulderCenterX - headCx;
  const neckDy = shoulderCenterY - headCy;
  const neckDist = Math.hypot(neckDx, neckDy) || 1;
  const neckTopX = headCx + (neckDx / neckDist) * headR;
  const neckTopY = headCy + (neckDy / neckDist) * headR;

  const shoulderLX = 335 + pose.torsoX;
  const shoulderLY = 245 + pose.torsoY + pose.shoulderLY;
  const shoulderRX = 565 + pose.torsoX;
  const shoulderRY = 245 + pose.torsoY + pose.shoulderRY;

  const elbowLX = 250 + pose.torsoX + pose.elbowLX;
  const elbowLY = 375 + pose.torsoY + pose.shoulderLY * 0.5 + pose.elbowLY;
  const handLX = 228 + pose.torsoX + pose.handLX;
  const handLY = 535 + pose.torsoY + pose.handLY;

  const elbowRX = 650 + pose.torsoX + pose.elbowRX;
  const elbowRY = 375 + pose.torsoY + pose.shoulderRY * 0.5 + pose.elbowRY;
  const handRX = 672 + pose.torsoX + pose.handRX;
  const handRY = 535 + pose.torsoY + pose.handRY;

  const hipCenterX = 450 + pose.hipX;
  const hipCenterY = 575 + pose.hipY;
  const hipLX = 385 + pose.hipX;
  const hipLY = 575 + pose.hipY;
  const hipRX = 515 + pose.hipX;
  const hipRY = 575 + pose.hipY;

  const kneeLX = 372 + pose.hipX * 0.5 + pose.kneeLX;
  const kneeLY = 800 + pose.kneeLY;
  const ankleLX = 372 + pose.ankleLX;
  const ankleLY = 1045 + pose.ankleLY;
  const footLX = 332 + pose.ankleLX + pose.footLX;
  const footLY = 1045 + pose.ankleLY + pose.footLY;

  const kneeRX = 528 + pose.hipX * 0.5 + pose.kneeRX;
  const kneeRY = 800 + pose.kneeRY;
  const ankleRX = 528 + pose.ankleRX;
  const ankleRY = 1045 + pose.ankleRY;
  const footRX = 568 + pose.ankleRX + pose.footRX;
  const footRY = 1045 + pose.ankleRY + pose.footRY;

  return (
    <svg
      viewBox="0 0 900 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full select-none"
    >
      <g
        stroke="#111111"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Connected Neck & Spine */}
        <path
          d={`M ${neckTopX} ${neckTopY} L ${shoulderCenterX} ${shoulderCenterY} L ${hipCenterX} ${hipCenterY}`}
        />

        {/* Head */}
        <circle cx={headCx} cy={headCy} r={headR} fill="#ffffff" />
        {isBack ? (
          <path
            d={`M ${headCx - 28} ${headCy + 17 + pose.headY * 0.25} Q ${headCx} ${headCy + 29 + pose.headY * 0.35} ${headCx + 28} ${headCy + 17 + pose.headY * 0.25}`}
            stroke="#8a8a8a"
            strokeWidth="6"
          />
        ) : (
          /* Subtle face gaze line that dips down when checking the outfit */
          <path
            d={`M ${headCx - 14 + pose.headX * 0.35} ${headCy + 8 + pose.headY * 0.55} Q ${headCx + pose.headX * 0.45} ${headCy + 12 + pose.headY * 0.65} ${headCx + 14 + pose.headX * 0.35} ${headCy + 8 + pose.headY * 0.55}`}
            stroke="#111111"
            strokeWidth="6"
          />
        )}

        {/* Connected Collarbone / Shoulders */}
        <path
          d={`M ${shoulderLX} ${shoulderLY} L ${shoulderCenterX} ${shoulderCenterY} L ${shoulderRX} ${shoulderRY}`}
        />
        <circle
          cx={shoulderLX}
          cy={shoulderLY}
          r="6"
          fill="#111111"
          stroke="none"
        />
        <circle
          cx={shoulderRX}
          cy={shoulderRY}
          r="6"
          fill="#111111"
          stroke="none"
        />

        {/* Left Arm (single connected polyline: shoulder -> elbow -> hand) */}
        <path
          d={`M ${shoulderLX} ${shoulderLY} L ${elbowLX} ${elbowLY} L ${handLX} ${handLY}`}
        />

        {/* Right Arm (single connected polyline: shoulder -> elbow -> hand) */}
        <path
          d={`M ${shoulderRX} ${shoulderRY} L ${elbowRX} ${elbowRY} L ${handRX} ${handRY}`}
        />

        {/* Connected Pelvis / Hips */}
        <path
          d={`M ${hipLX} ${hipLY} L ${hipCenterX} ${hipCenterY} L ${hipRX} ${hipRY}`}
        />
        <circle cx={hipLX} cy={hipLY} r="6" fill="#111111" stroke="none" />
        <circle cx={hipRX} cy={hipRY} r="6" fill="#111111" stroke="none" />

        {/* Left Leg & Foot (single connected polyline: hip -> knee -> ankle -> foot) */}
        <path
          d={`M ${hipLX} ${hipLY} L ${kneeLX} ${kneeLY} L ${ankleLX} ${ankleLY} L ${footLX} ${footLY}`}
        />

        {/* Right Leg & Foot (single connected polyline: hip -> knee -> ankle -> foot) */}
        <path
          d={`M ${hipRX} ${hipRY} L ${kneeRX} ${kneeRY} L ${ankleRX} ${ankleRY} L ${footRX} ${footRY}`}
        />
      </g>
    </svg>
  );
}
