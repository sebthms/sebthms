import type { PortfolioElements } from "../../dom/elements";
import type { CardLayout } from "../card-geometry";
import {
  PHASE6_ENTER_START,
  PHASE6_ENTER_END,
  PROJECTS_SHRINK_END,
  PROJECTS_SLIDE_START,
  PROJECTS_SLIDE_END,
} from "../constants";
import { clamp, easeInOut } from "../easing";
import type { ScrollContext } from "../types";

export function applyPassionPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
  layout: CardLayout,
): void {
  const { passionSection, passionLabel } = elements;
  const enter = easeInOut(clamp(
    (ctx.progress - PHASE6_ENTER_END) / (PROJECTS_SHRINK_END - PHASE6_ENTER_END),
    0, 1,
  ));
  const slideRaw = clamp(
    (ctx.progress - PROJECTS_SLIDE_START) / (PROJECTS_SLIDE_END - PROJECTS_SLIDE_START),
    0, 1,
  );
  const slide = slideRaw >= 0.5 ? 1 : 0;
  const visible = ctx.progress > PHASE6_ENTER_START && ctx.exitEased < 1;
  // Le GIF n'apparaît qu'une fois la réduction de la carte terminée.
  passionSection.classList.toggle(
    "is-layout-fixed",
    ctx.progress >= PROJECTS_SHRINK_END && visible,
  );
  passionSection.style.opacity = String(enter);
  passionSection.style.visibility = visible ? "visible" : "hidden";
  passionSection.style.pointerEvents = enter > 0.5 && ctx.exitEased < 0.2 ? "auto" : "none";

  const track = passionSection.querySelector<HTMLElement>(".projects-track");
  const viewport = passionSection.querySelector<HTMLElement>(".projects-viewport");
  if (track && viewport) {
    const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    track.style.transform = `translate3d(${-distance * slide}px, 0, 0)`;
  }
  const activeIndex = slide < 0.5 ? 0 : 1;
  passionSection.querySelectorAll<HTMLElement>(".passion-card").forEach((card, index) => {
    card.inert = !visible || enter < 0.5 || ctx.exitEased > 0.2 || index !== activeIndex;
  });
  passionSection.querySelectorAll(".projects-pagination span").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
  });
  if (passionLabel) {
    passionLabel.style.opacity = String(enter * (1 - ctx.exitEased));
    passionLabel.style.transform = `translateY(${-layout.exitTranslateY}px)`;
    passionLabel.style.visibility = visible ? "visible" : "hidden";
  }
}
