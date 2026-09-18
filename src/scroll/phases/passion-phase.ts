import type { PortfolioElements } from "../../dom/elements";
import type { CardLayout } from "../card-geometry";
import {
  PHASE6_ENTER_START,
  PHASE6_ENTER_END,
  PROJECTS_SHRINK_END,
} from "../constants";
import { clamp, easeInOut } from "../easing";
import type { ScrollContext } from "../types";
import type { ProjectStackControls } from "../../effects/project-stack";

let stackControls: ProjectStackControls | null = null;

export function bindPassionStack(controls: ProjectStackControls): void {
  stackControls = controls;
}

export function applyPassionPhase(
  elements: PortfolioElements,
  ctx: ScrollContext,
  layout: CardLayout,
): void {
  const { passionSection, passionLabel, projectsPagination } = elements;
  const enter = easeInOut(clamp(
    (ctx.progress - PHASE6_ENTER_END) / (PROJECTS_SHRINK_END - PHASE6_ENTER_END),
    0, 1,
  ));
  const visible = ctx.progress > PHASE6_ENTER_START && ctx.exitEased < 1;
  const interactive = enter > 0.5 && ctx.exitEased < 0.2;

  passionSection.classList.toggle(
    "is-layout-fixed",
    ctx.progress >= PROJECTS_SHRINK_END && visible,
  );
  passionSection.style.opacity = String(enter);
  passionSection.style.visibility = visible ? "visible" : "hidden";
  passionSection.style.pointerEvents = interactive ? "auto" : "none";
  stackControls?.setEnabled(interactive && visible);

  if (projectsPagination) {
    const show = visible && enter > 0.88 && ctx.exitEased < 0.12;
    projectsPagination.classList.toggle("is-visible", show);
    const cardTop = ctx.winH - layout.bottom - layout.height;
    projectsPagination.style.top = `${cardTop + layout.height + 26}px`;
  }

  if (passionLabel) {
    passionLabel.style.opacity = String(enter * (1 - ctx.exitEased));
    passionLabel.style.transform = `translateY(${-layout.exitTranslateY}px)`;
    passionLabel.style.visibility = visible ? "visible" : "hidden";
  }
}
