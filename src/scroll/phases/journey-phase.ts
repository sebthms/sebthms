import type { PortfolioElements } from "../../dom/elements";
import {
  MOBILE_BREAKPOINT,
  PHASE4_ENTER_END,
  PHASE4_ENTER_START,
  PHASE5_ACTIVE_END,
  PHASE5_FADE_END,
} from "../constants";
import { clamp } from "../easing";
import { resolvePhaseWindow } from "../phase-window";
import type { ScrollContext } from "../types";

/** Le scroll vertical fait parcourir toute la frise, sans déplacement par carte. */
export function applyJourneyPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const section = elements.journeySection;
  const state = resolvePhaseWindow(
    ctx.progress,
    PHASE4_ENTER_START,
    PHASE4_ENTER_END,
    PHASE5_ACTIVE_END,
    PHASE5_FADE_END,
  );
  section.style.opacity = String(state.opacity);
  section.style.visibility = state.isVisible ? "visible" : "hidden";
  section.style.pointerEvents = state.opacity > 0.05 ? "auto" : "none";

  const track = section.querySelector<HTMLElement>(".journey-timeline");
  const viewport = section.querySelector<HTMLElement>(".journey-viewport");
  if (!track || !viewport) return;

  // Progression linéaire : vitesse stable et bornes recalculées au resize.
  const progress = clamp(
    (ctx.progress - PHASE4_ENTER_END) / (PHASE5_ACTIVE_END - PHASE4_ENTER_END),
    0,
    1,
  );
  const isMobile = ctx.winW <= MOBILE_BREAKPOINT;

  if (isMobile) {
    const distance = Math.max(0, track.scrollHeight - viewport.clientHeight);
    track.style.transform = `translate3d(0, ${-distance * progress}px, 0)`;
  } else {
    const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    track.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
  }
}
