import type { PortfolioElements } from "../../dom/elements";
import {
  PHASE4_ACTIVE_END,
  PHASE4_ENTER_END,
  PHASE4_ENTER_START,
  PHASE4_FADE_END,
} from "../constants";
import { easeInOut, phaseRange } from "../easing";
import { resolvePhaseWindow } from "../phaseWindow";
import type { ScrollContext } from "../types";

export function applyQuotePhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const section = elements.quoteSection;
  const state = resolvePhaseWindow(
    ctx.progress,
    PHASE4_ENTER_START,
    PHASE4_ENTER_END,
    PHASE4_ACTIVE_END,
    PHASE4_FADE_END,
  );
  const enter = easeInOut(
    phaseRange(ctx.progress, PHASE4_ENTER_START, PHASE4_ENTER_END),
  );
  const opacity =
    ctx.progress < PHASE4_ENTER_END ? enter : state.opacity;

  section.style.opacity = String(opacity);
  section.style.transform = `translate3d(0, ${(1 - enter) * 48}px, 0) scale(${0.97 + enter * 0.03})`;
  section.style.visibility = state.isVisible ? "visible" : "hidden";
  section.style.pointerEvents = opacity > 0.65 ? "auto" : "none";
  section.inert = !state.isVisible;
  section.setAttribute("aria-hidden", String(!state.isVisible));
}
