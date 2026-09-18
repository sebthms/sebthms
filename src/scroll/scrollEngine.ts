import type { PortfolioElements } from "../dom/elements";
import { PHASE5_ENTER_START } from "./constants";
import { clamp } from "./easing";
import { createFlowLayout } from "./flowLayout";
import { applyHeaderState } from "./headerState";
import { syncLandingVars } from "./landingVars";
import {
  FLOW_LAYOUT_QUERY,
  isFlowLayout,
  prefersReducedMotion,
  REDUCED_MOTION_QUERY,
} from "./mediaQueries";
import { updateActiveNavLink } from "./nav";
import { computePhaseProgress, computeScrollContext } from "./progress";
import { applyCardPhase } from "./phases/cardPhase";
import { applyContactPhase } from "./phases/contactPhase";
import { applyHeroPhase } from "./phases/heroPhase";
import { applyProcessPhase } from "./phases/processPhase";
import { applyQuotePhase } from "./phases/quotePhase";
import { createScrollInertia } from "./scrollInertia";

export function createScrollEngine(elements: PortfolioElements) {
  let winW = window.innerWidth;
  let winH = window.innerHeight;

  const getWinH = () => winH;
  const updateFlowLayout = createFlowLayout(elements);

  const getRawProgress = () => {
    const maxScroll = Math.max(
      elements.heroScrollContainer.offsetHeight - winH,
      1,
    );
    return clamp(window.scrollY / maxScroll, 0, 1);
  };

  const applyFrame = (smoothProgress: number) => {
    if (isFlowLayout()) {
      updateFlowLayout();
      return;
    }

    const heroHeight = elements.heroScrollContainer.offsetHeight;
    const maxScroll = Math.max(heroHeight - winH, 1);
    const animatedScrollY = smoothProgress * maxScroll;
    const ctx = computeScrollContext(
      animatedScrollY,
      winW,
      winH,
      heroHeight,
      PHASE5_ENTER_START,
    );
    const phases = computePhaseProgress(ctx.progress);

    updateActiveNavLink(elements, ctx);
    applyHeroPhase(elements, phases);
    applyCardPhase(elements, ctx, phases);
    applyProcessPhase(elements, ctx);
    applyQuotePhase(elements, ctx);
    applyContactPhase(elements, ctx);
    applyHeaderState(elements, ctx);
  };

  const inertia = createScrollInertia({
    getRawProgress,
    onTick: applyFrame,
    follow: 0.12,
  });

  const onScroll = () => {
    if (isFlowLayout()) {
      updateFlowLayout();
      return;
    }
    if (prefersReducedMotion()) {
      inertia.setImmediate(getRawProgress());
      return;
    }
    inertia.kick();
  };

  const onResize = () => {
    winW = window.innerWidth;
    winH = window.innerHeight;
    syncLandingVars(winH);
    if (isFlowLayout()) {
      updateFlowLayout();
      return;
    }
    inertia.setImmediate(getRawProgress());
  };

  const flowMedia = window.matchMedia(FLOW_LAYOUT_QUERY);
  const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

  syncLandingVars(winH);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  flowMedia.addEventListener("change", onResize);
  reducedMotionMedia.addEventListener("change", onResize);

  const update = () => inertia.setImmediate(getRawProgress());
  const destroy = () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    flowMedia.removeEventListener("change", onResize);
    reducedMotionMedia.removeEventListener("change", onResize);
    inertia.destroy();
  };

  return { update, getWinH, destroy };
}
