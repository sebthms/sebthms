import { PHASE1_END, PHASE2_END } from "./constants";
import { clamp, phaseRange } from "./easing";
import type { PhaseProgress, ScrollContext } from "./types";

export function computeScrollContext(
  scrollY: number,
  winW: number,
  winH: number,
  heroH: number,
  contactStartProgress: number | null,
): ScrollContext {
  const maxScroll = Math.max(heroH - winH, 1);
  const progress = clamp(scrollY / maxScroll, 0, 1);
  const inContactZone =
    contactStartProgress !== null && progress >= contactStartProgress;

  return {
    scrollY,
    winW,
    winH,
    heroH,
    maxScroll,
    progress,
    inContactZone,
  };
}

export function computePhaseProgress(progress: number): PhaseProgress {
  return {
    phase1: Math.min(progress / PHASE1_END, 1),
    phase2: phaseRange(progress, PHASE1_END, PHASE2_END),
  };
}
