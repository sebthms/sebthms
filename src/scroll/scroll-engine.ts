import type { PortfolioElements } from "../dom/elements";
import { updateBodyClasses } from "./body-state";
import { applyHeaderState } from "./header-state";
import { syncLandingVars, measureHeroBottom } from "./landing-vars";
import { updateActiveNavLink } from "./nav";
import { computePhaseProgress, computeScrollContext } from "./progress";
import { applyCardPhase } from "./phases/card-phase";
import {
  applyJourneyPhase,
  getJourneySnapScrollY,
} from "./phases/journey-phase";
import { applyHeroPhase } from "./phases/hero-phase";
import { applyPassionPhase } from "./phases/passion-phase";
import {
  applyProcessPhase,
  getProcessSnapScrollY,
} from "./phases/process-phase";
import { MOBILE_BREAKPOINT } from "./constants";

export function createScrollEngine(elements: PortfolioElements) {
  let winW = window.innerWidth;
  let winH = window.innerHeight;

  const getWinH = () => winH;

  const update = () => {
    const contactTop = elements.contactSection?.offsetTop ?? null;
    const heroBottom = measureHeroBottom(elements.heroSection);
    const ctx = computeScrollContext(
      window.scrollY,
      winW,
      winH,
      elements.heroScrollContainer.offsetHeight,
      heroBottom,
      contactTop,
    );
    const phases = computePhaseProgress(ctx.progress);

    updateActiveNavLink(elements, ctx);
    updateBodyClasses(ctx);

    applyHeroPhase(elements, phases);
    const layout = applyCardPhase(elements, ctx, phases);
    applyProcessPhase(elements, ctx);
    applyJourneyPhase(elements, ctx);
    applyPassionPhase(elements, ctx, layout);
    applyHeaderState(elements, ctx);

    elements.scrollIndicator?.classList.toggle("hidden", ctx.progress > 0.03);
  };

  const onResize = () => {
    winW = window.innerWidth;
    winH = window.innerHeight;
    syncLandingVars(winW, winH, measureHeroBottom(elements.heroSection));
    update();
  };

  syncLandingVars(winW, winH, measureHeroBottom(elements.heroSection));

  let snapping = false;
  let snapTimer = 0;

  const trySnap = () => {
    if (snapping || winW <= MOBILE_BREAKPOINT) return;
    const heroBottom = measureHeroBottom(elements.heroSection);
    const ctx = computeScrollContext(
      window.scrollY,
      winW,
      winH,
      elements.heroScrollContainer.offsetHeight,
      heroBottom,
      elements.contactSection?.offsetTop ?? null,
    );
    const processCount =
      elements.processSection.querySelectorAll(".timeline-item").length;
    const processTarget = getProcessSnapScrollY(
      ctx.progress,
      ctx.maxScroll,
      processCount,
    );
    const journeyCount =
      elements.journeySection.querySelectorAll(".journey-index-item").length;
    const journeyTarget = getJourneySnapScrollY(
      ctx.progress,
      ctx.maxScroll,
      journeyCount,
    );
    const target = processTarget ?? journeyTarget;
    if (target === null) return;
    snapping = true;
    window.scrollTo({ top: target, behavior: "smooth" });
    window.setTimeout(() => {
      snapping = false;
      update();
    }, 420);
  };

  window.addEventListener(
    "scroll",
    () => {
      requestAnimationFrame(update);
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(trySnap, 140);
    },
    { passive: true },
  );
  window.addEventListener("resize", onResize);

  return { update, getWinH };
}
