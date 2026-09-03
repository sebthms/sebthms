import { EXIT_SCROLL_RATIO, PHASE1_END, PHASE2_END } from "./constants";
import { clamp, easeInOut, phaseRange } from "./easing";
import type { PhaseProgress, ScrollContext } from "./types";

export function computeScrollContext(
  scrollY: number,
  winW: number,
  winH: number,
  heroH: number,
  contactTop: number | null,
): ScrollContext {
  const maxScroll = Math.max(heroH - winH, 1);
  const progress = clamp(scrollY / maxScroll, 0, 1);
  const inContactZone =
    contactTop !== null && scrollY + winH * 0.55 >= contactTop;
  const scrollPastHero = Math.max(0, scrollY - maxScroll);
  const exitScrollRange = winH * EXIT_SCROLL_RATIO;
  const exitProgress = clamp(scrollPastHero / exitScrollRange, 0, 1);

  return {
    scrollY,
    winW,
    winH,
    heroH,
    maxScroll,
    progress,
    inContactZone,
    scrollPastHero,
    exitProgress,
    exitEased: easeInOut(exitProgress),
  };
}

export function computePhaseProgress(progress: number): PhaseProgress {
  return {
    phase1: Math.min(progress / PHASE1_END, 1),
    phase2: phaseRange(progress, PHASE1_END, PHASE2_END),
  };
}
