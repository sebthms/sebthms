import {
  getCardConfig,
  PROJECTS_SHRINK_END,
  PHASE6_ENTER_END,
  PHASE6_ENTER_START,
} from "./constants";
import { clamp, easeInOut } from "./easing";
import type { PhaseProgress, ScrollContext } from "./types";

export interface CardLayout {
  width: number;
  height: number;
  bottom: number;
  radius: number;
  shadow: number;
  exitTranslateY: number;
}

export function computeCardLayout(
  ctx: ScrollContext,
  phases: PhaseProgress,
): CardLayout {
  const { winW, winH, progress, exitEased } = ctx;
  const { phase1, phase2 } = phases;
  const { initial, passion } = getCardConfig(winW);

  const shrink = easeInOut(clamp(
    (progress - PHASE6_ENTER_END) / (PROJECTS_SHRINK_END - PHASE6_ENTER_END),
    0, 1,
  ));

  const startBottom = winH * initial.bottom;
  const startH = winH * initial.height;
  const startW = winW * initial.width;
  const centeredBottom = (winH - startH) / 2;
  const phase1Bottom =
    startBottom + (centeredBottom - startBottom) * Math.min(phase1, 1);

  const passionTargetW = winW * passion.width;
  const passionTargetH = winH * passion.height;
  const passionTargetBottom = (winH - passionTargetH) / 2;

  let width = startW + (winW - startW) * phase2;
  let height = startH + (winH - startH) * phase2;
  let bottom = phase1Bottom * (1 - phase2);
  let radius = initial.radius * (1 - phase2);
  let shadow = 0.5 * (1 - phase2);

  if (progress >= PHASE6_ENTER_START) {
    width = winW + (passionTargetW - winW) * shrink;
    height = winH + (passionTargetH - winH) * shrink;
    bottom = passionTargetBottom * shrink;
    radius =
      initial.radius * (1 - phase2) +
      (passion.radius - initial.radius * (1 - phase2)) * shrink;
    shadow = 0.15 + 0.35 * shrink;
  }

  const cardTop = winH - bottom - height;
  const exitTranslateY = (cardTop + height + 32) * exitEased;

  return { width, height, bottom, radius, shadow, exitTranslateY };
}
