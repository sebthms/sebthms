import type { PortfolioElements } from "../../dom/elements";
import type { PhaseProgress } from "../types";

/**
 * Phase 1 — Hero blanc fixe disparaît au scroll.
 * Opacity + translateY + blur synchronisés sur phase1 (0→0.10).
 */
export function applyHeroPhase(
  elements: PortfolioElements,
  phases: PhaseProgress,
): void {
  const { phase1 } = phases;

  elements.heroSection.style.opacity = String(1 - phase1);
  elements.heroSection.style.transform = `translateY(${phase1 * -30}px)`;
  elements.heroSection.style.filter = `blur(${phase1 * 8}px)`;
}
