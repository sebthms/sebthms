import type { PortfolioElements } from "../../dom/elements";
import { computeCardLayout } from "../cardGeometry";
import type { PhaseProgress, ScrollContext } from "../types";

/**
 * Phase 2 : agrandissement plein écran.
 */
export function applyCardPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
  phases: PhaseProgress,
): void {
  const { container, preScrollContent } = elements;
  const { phase2 } = phases;
  const layout = computeCardLayout(ctx, phases);

  container.style.position = "fixed";
  container.style.top = "auto";
  container.style.width = `${layout.width}px`;
  container.style.height = `${layout.height}px`;
  container.style.borderRadius = `${Math.max(0, layout.radius)}px`;
  container.style.bottom = `${layout.bottom}px`;
  container.style.transformOrigin = "50% 50%";
  container.style.transform = "translateX(-50%)";
  container.style.opacity = "1";
  container.style.boxShadow = `0 40px 80px -20px rgba(0, 0, 0, ${layout.shadow})`;
  container.style.pointerEvents = "auto";
  container.style.visibility = "visible";

  if (preScrollContent) {
    const preScrollOpacity = Math.max(0, 1 - phase2 * 1.5);
    preScrollContent.style.opacity = String(preScrollOpacity);
    preScrollContent.style.transform = `scale(${Math.max(0.95, 1 - phase2 * 0.1)})`;
    preScrollContent.style.display =
      preScrollOpacity < 0.01 ? "none" : "flex";
  }
}
