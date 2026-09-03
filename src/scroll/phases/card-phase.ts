import type { PortfolioElements } from "../../dom/elements";
import { computeCardLayout } from "../card-geometry";
import type { PhaseProgress, ScrollContext } from "../types";

/**
 * Phases 2 & 5 — Carte noire immersive.
 *
 * Phase 2 : agrandissement plein écran.
 * Phase 5 : réduction vers card Micro Voxel + sortie vers contact.
 *
 * La carte reste position:fixed pendant tout le scroll.
 */
export function applyCardPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
  phases: PhaseProgress,
): ReturnType<typeof computeCardLayout> {
  const { container, preScrollContent } = elements;
  const { exitEased } = ctx;
  const { phase2 } = phases;
  const layout = computeCardLayout(ctx, phases);

  container.style.position = "fixed";
  container.style.top = "auto";
  container.style.width = `${layout.width}px`;
  container.style.height = `${layout.height}px`;
  container.style.borderRadius = `${Math.max(0, layout.radius)}px`;
  container.style.bottom = `${layout.bottom}px`;
  container.style.transform = `translateX(-50%) translateY(-${layout.exitTranslateY}px)`;
  container.style.opacity = String(1 - exitEased * 0.9);
  container.style.boxShadow = `0 40px 80px -20px rgba(0, 0, 0, ${layout.shadow * (1 - exitEased)})`;
  container.style.pointerEvents = exitEased > 0.85 ? "none" : "auto";
  container.style.visibility = exitEased >= 1 ? "hidden" : "visible";

  if (preScrollContent) {
    const preScrollOpacity = Math.max(0, 1 - phase2 * 1.5);
    preScrollContent.style.opacity = String(preScrollOpacity);
    preScrollContent.style.transform = `scale(${Math.max(0.95, 1 - phase2 * 0.1)})`;
    preScrollContent.style.display =
      preScrollOpacity < 0.01 ? "none" : "flex";
  }

  return layout;
}
