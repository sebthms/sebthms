import type { PortfolioElements } from "../../dom/elements";
import {
  PHASE3_ACTIVE_END,
  PHASE3_DOCK_END,
  PHASE3_ENTER_END,
  PHASE3_ENTER_START,
  PHASE3_FADE_END,
} from "../constants";
import { clamp, easeInOut, phaseRange } from "../easing";
import { applyProcessDock } from "../dockScroll";
import { resolvePhaseWindow } from "../phaseWindow";
import type { ScrollContext } from "../types";

export function applyProcessPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const section = elements.processSection;
  const state = resolvePhaseWindow(
    ctx.progress,
    PHASE3_ENTER_START,
    PHASE3_ENTER_END,
    PHASE3_ACTIVE_END,
    PHASE3_FADE_END,
  );
  const exit = easeInOut(
    phaseRange(ctx.progress, PHASE3_ACTIVE_END, PHASE3_FADE_END),
  );
  section.style.opacity = String(state.opacity);
  section.style.transform = `translate3d(0, ${exit * -56}px, 0) scale(${1 - exit * 0.025})`;
  section.style.visibility = state.isVisible ? "visible" : "hidden";
  section.style.pointerEvents = state.opacity > 0.05 ? "auto" : "none";
  section.inert = !state.isVisible;
  section.setAttribute("aria-hidden", String(!state.isVisible));

  const move = clamp(
    (ctx.progress - PHASE3_ENTER_END) /
      (PHASE3_DOCK_END - PHASE3_ENTER_END),
    0,
    1,
  );
  applyProcessDock(section, state.isVisible ? 1 : 0, move);
}
