import type { PortfolioElements } from "../../dom/elements";
import {
  MOBILE_BREAKPOINT,
  PHASE3_ACTIVE_END,
  PHASE3_ENTER_END,
  PHASE3_ENTER_START,
  PHASE3_FADE_END,
} from "../constants";
import { resolvePhaseWindow } from "../phase-window";
import type { ScrollContext } from "../types";

const OPEN_PORTION = 0.22;
const HOLD_CENTER = 0.62;

function queryItems(processSection: HTMLElement): NodeListOf<HTMLElement> {
  return processSection.querySelectorAll(
    ".timeline-item",
  ) as NodeListOf<HTMLElement>;
}

function resetMobileItem(item: HTMLElement): void {
  item.style.transform = "";
  item.style.opacity = "";
  item.classList.remove("active", "is-near");
}

export function getProcessSnapScrollY(
  progress: number,
  maxScroll: number,
  itemCount: number,
): number | null {
  if (
    itemCount < 1 ||
    progress < PHASE3_ENTER_END ||
    progress > PHASE3_ACTIVE_END
  ) {
    return null;
  }

  const span = PHASE3_ACTIVE_END - PHASE3_ENTER_END;
  const local = (progress - PHASE3_ENTER_END) / span;
  const raw = local * itemCount;
  const index = Math.min(itemCount - 1, Math.floor(raw));
  const t = raw - index;
  if (t >= OPEN_PORTION) return null;

  const targetLocal = (index + HOLD_CENTER) / itemCount;
  return (PHASE3_ENTER_END + targetLocal * span) * maxScroll;
}

export function applyProcessPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const { processSection } = elements;
  const { winW, progress } = ctx;
  const mobile = winW <= MOBILE_BREAKPOINT;

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
  processSection.style.pointerEvents = state.opacity > 0.05 ? "auto" : "none";

  const timelineItems = queryItems(processSection);
  const itemCount = timelineItems.length;

  if (mobile) {
    timelineItems.forEach(resetMobileItem);
    return;
  }

  const focus = state.active * Math.max(itemCount - 1, 1);

  timelineItems.forEach((item, index) => {
    const raw = state.active * itemCount;
    const current = Math.min(itemCount - 1, Math.floor(raw));
    const t = raw - Math.floor(raw);

    let open = 0;
    if (index === current) {
      open = current === 0 || t >= OPEN_PORTION ? 1 : t / OPEN_PORTION;
    } else if (index === current - 1 && t < OPEN_PORTION) {
      open = 1;
    }
    if (index === itemCount - 1 && state.active >= 1) {
      open = 1;
    }

    item.classList.toggle("active", open > 0.85);
    item.classList.toggle(
      "is-near",
      open <= 0.85 && Math.abs(index - focus) < 1.15,
    );
  });
}
