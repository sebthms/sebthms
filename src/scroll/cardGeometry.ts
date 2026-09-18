import { CARD_INITIAL } from "./constants";
import type { PhaseProgress, ScrollContext } from "./types";

export interface CardLayout {
  width: number;
  height: number;
  bottom: number;
  radius: number;
  shadow: number;
}

export function computeCardLayout(
  ctx: ScrollContext,
  phases: PhaseProgress,
): CardLayout {
  const { winW, winH } = ctx;
  const { phase1, phase2 } = phases;

  const startBottom = winH * CARD_INITIAL.bottom;
  const startH = winH * CARD_INITIAL.height;
  const startW = winW * CARD_INITIAL.width;
  const centeredBottom = (winH - startH) / 2;
  const phase1Bottom =
    startBottom + (centeredBottom - startBottom) * Math.min(phase1, 1);

  const width = startW + (winW - startW) * phase2;
  const height = startH + (winH - startH) * phase2;
  const bottom = phase1Bottom * (1 - phase2);
  const radius = CARD_INITIAL.radius * (1 - phase2);
  const shadow = 0.5 * (1 - phase2);

  return { width, height, bottom, radius, shadow };
}
