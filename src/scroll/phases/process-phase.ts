import type { PortfolioElements } from "../../dom/elements";
import {
  MOBILE_BREAKPOINT,
  PHASE3_ACTIVE_END,
  PHASE3_ENTER_END,
  PHASE3_ENTER_START,
  PHASE3_FADE_END,
} from "../constants";
import { clamp } from "../easing";
import { resolvePhaseWindow } from "../phase-window";
import type { ScrollContext } from "../types";

export function applyProcessPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const { processSection, timelineProgressPath, timelineHProgress } = elements;
  const { winW, progress } = ctx;

  const state = resolvePhaseWindow(
    progress,
    PHASE3_ENTER_START,
    PHASE3_ENTER_END,
    PHASE3_ACTIVE_END,
    PHASE3_FADE_END,
  );

  processSection.style.opacity = String(state.opacity);
  processSection.style.transform =
    progress >= PHASE3_ACTIVE_END && progress < PHASE3_FADE_END
      ? `translateX(${-winW * 0.3 * (1 - state.opacity)}px)`
      : "translateX(0)";
  processSection.style.pointerEvents =
    state.opacity > 0.05 ? "auto" : "none";

  if (timelineProgressPath) {
    timelineProgressPath.style.strokeDashoffset = String(
      400 - state.active * 400,
    );
  }

  if (timelineHProgress) {
    timelineHProgress.style.width = `${state.active * 100}%`;
  }

  const timelineItems = processSection.querySelectorAll(
    ".timeline-item",
  ) as NodeListOf<HTMLElement>;
  const itemCount = timelineItems.length;
  const activeItemIndex = Math.floor(state.active * itemCount);

  timelineItems.forEach((item, index) => {
    const detail = item.querySelector(".timeline-detail") as HTMLElement;
    if (!detail) return;

    if (state.active === 0) {
      detail.style.maxHeight = "0";
      detail.style.opacity = "0";
      detail.style.marginTop = "0";
      item.classList.remove("active");
      return;
    }

    const itemStart = index / itemCount;
    const itemEnd = (index + 1) / itemCount;
    const itemProgress = clamp(
      (state.active - itemStart) / (itemEnd - itemStart),
      0,
      1,
    );

    let openAmount = 0;
    if (index === activeItemIndex) {
      openAmount = itemProgress;
    } else if (index === activeItemIndex - 1 && itemProgress < 0.3) {
      openAmount = 1 - itemProgress / 0.3;
    }

    const eased =
      openAmount < 0.5
        ? 2 * openAmount * openAmount
        : 1 - Math.pow(-2 * openAmount + 2, 2) / 2;

    const detailMaxHeight = winW <= MOBILE_BREAKPOINT ? 200 : 100;
    detail.style.maxHeight = `${eased * detailMaxHeight}px`;
    detail.style.opacity = String(eased);
    detail.style.marginTop = eased > 0.1 ? "0.75rem" : "0";
    item.classList.toggle("active", openAmount > 0.1);
  });
}
