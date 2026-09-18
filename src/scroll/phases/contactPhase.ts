import type { PortfolioElements } from "../../dom/elements";
import {
  PHASE5_ENTER_END,
  PHASE5_ENTER_START,
} from "../constants";
import { easeInOut, phaseRange } from "../easing";
import type { ScrollContext } from "../types";

export function applyContactPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const section = elements.contactSection;
  if (!section) return;

  const enter = easeInOut(
    phaseRange(ctx.progress, PHASE5_ENTER_START, PHASE5_ENTER_END),
  );
  const isVisible = ctx.progress > PHASE5_ENTER_START;

  section.style.opacity = String(enter);
  section.style.transform = `translate3d(0, ${(1 - enter) * 48}px, 0) scale(${0.97 + enter * 0.03})`;
  section.style.visibility = isVisible ? "visible" : "hidden";
  section.style.pointerEvents = enter > 0.65 ? "auto" : "none";
  section.inert = !isVisible;
  section.setAttribute("aria-hidden", String(!isVisible));
}
