import { easeInOut } from "./easing";

/** État d'une phase : fade entrée → actif (animations scroll) → fade sortie */
export interface PhaseState {
  opacity: number;
  isVisible: boolean;
}

export function resolvePhaseWindow(
  progress: number,
  enterStart: number,
  enterEnd: number,
  activeEnd: number,
  fadeEnd: number,
): PhaseState {
  if (progress <= enterStart) {
    return { opacity: 0, isVisible: false };
  }

  if (progress < enterEnd) {
    const t = (progress - enterStart) / (enterEnd - enterStart);
    const opacity = easeInOut(t);
    return { opacity, isVisible: opacity > 0.02 };
  }

  if (progress < activeEnd) {
    return { opacity: 1, isVisible: true };
  }

  if (progress < fadeEnd) {
    const t = (progress - activeEnd) / (fadeEnd - activeEnd);
    return { opacity: 1 - easeInOut(t), isVisible: true };
  }

  return { opacity: 0, isVisible: false };
}
