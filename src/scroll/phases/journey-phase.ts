import type { PortfolioElements } from "../../dom/elements";
import {
  MOBILE_BREAKPOINT,
  PHASE4_ENTER_END,
  PHASE4_ENTER_START,
  PHASE5_ACTIVE_END,
  PHASE5_FADE_END,
} from "../constants";
import { resolvePhaseWindow } from "../phase-window";
import type { ScrollContext } from "../types";

const OPEN_PORTION = 0.22;
const HOLD_CENTER = 0.62;

function queryIndex(section: HTMLElement): NodeListOf<HTMLElement> {
  return section.querySelectorAll(".journey-index-item");
}

function queryPanels(section: HTMLElement): NodeListOf<HTMLElement> {
  return section.querySelectorAll(".journey-panel");
}

function activeIndex(active: number, itemCount: number): number {
  const raw = active * itemCount;
  const current = Math.min(itemCount - 1, Math.floor(raw));
  const t = raw - Math.floor(raw);
  if (current > 0 && t < OPEN_PORTION) return current - 1;
  return current;
}

export function getJourneySnapScrollY(
  progress: number,
  maxScroll: number,
  itemCount: number,
): number | null {
  if (
    itemCount < 1 ||
    progress < PHASE4_ENTER_END ||
    progress > PHASE5_ACTIVE_END
  ) {
    return null;
  }

  const span = PHASE5_ACTIVE_END - PHASE4_ENTER_END;
  const local = (progress - PHASE4_ENTER_END) / span;
  const raw = local * itemCount;
  const index = Math.min(itemCount - 1, Math.floor(raw));
  const t = raw - index;
  if (t >= OPEN_PORTION) return null;

  const targetLocal = (index + HOLD_CENTER) / itemCount;
  return (PHASE4_ENTER_END + targetLocal * span) * maxScroll;
}

export function getJourneyMissionScrollY(
  index: number,
  itemCount: number,
  maxScroll: number,
): number {
  const span = PHASE5_ACTIVE_END - PHASE4_ENTER_END;
  const targetLocal = (index + HOLD_CENTER) / Math.max(itemCount, 1);
  return (PHASE4_ENTER_END + targetLocal * span) * maxScroll;
}

let clicksBound = false;
let maxScrollRef = 1;
let mobilePick: number | null = null;

function applyMission(
  items: NodeListOf<HTMLElement>,
  panels: NodeListOf<HTMLElement>,
  current: number,
  focus: number,
  mobile: boolean,
): void {
  items.forEach((item, index) => {
    const isActive = index === current;
    item.classList.toggle("active", isActive);
    item.classList.toggle(
      "is-near",
      !mobile && !isActive && Math.abs(index - focus) < 1.15,
    );
    const btn = item.querySelector("button");
    btn?.setAttribute("aria-pressed", String(isActive));
    btn?.setAttribute("aria-controls", `journey-panel-${index}`);
  });

  panels.forEach((panel, index) => {
    panel.id = `journey-panel-${index}`;
    panel.classList.toggle("active", index === current);
    panel.setAttribute("aria-hidden", String(index !== current));
  });
}

function bindIndexClicks(section: HTMLElement): void {
  if (clicksBound) return;
  clicksBound = true;
  queryIndex(section).forEach((item, index) => {
    const btn = item.querySelector("button");
    btn?.addEventListener("click", () => {
      const count = queryIndex(section).length;
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        mobilePick = index;
        applyMission(
          queryIndex(section),
          queryPanels(section),
          index,
          index,
          true,
        );
        return;
      }
      window.scrollTo({
        top: getJourneyMissionScrollY(index, count, maxScrollRef),
        behavior: "smooth",
      });
    });
  });
}

export function applyJourneyPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const section = elements.journeySection;
  maxScrollRef = ctx.maxScroll;
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
  section.classList.toggle("is-visible", state.opacity > 0.55);

  if (!state.isVisible) mobilePick = null;

  const items = queryIndex(section);
  const panels = queryPanels(section);
  const itemCount = items.length;
  const mobile = ctx.winW <= MOBILE_BREAKPOINT;

  bindIndexClicks(section);

  if (itemCount === 0) return;

  const current =
    mobile && mobilePick !== null
      ? mobilePick
      : activeIndex(state.active, itemCount);
  const focus = state.active * Math.max(itemCount - 1, 1);

  applyMission(items, panels, current, focus, mobile);
}
