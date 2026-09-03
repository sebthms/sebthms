import type { PortfolioElements } from "../dom/elements";
import { updateBodyClasses } from "./body-state";
import { applyHeaderState } from "./header-state";
import { syncLandingVars } from "./landing-vars";
import { updateActiveNavLink } from "./nav";
import { computePhaseProgress, computeScrollContext } from "./progress";
import { applyCardPhase } from "./phases/card-phase";
import { applyJourneyPhase } from "./phases/journey-phase";
import { applyHeroPhase } from "./phases/hero-phase";
import { applyPassionPhase } from "./phases/passion-phase";
import { applyProcessPhase } from "./phases/process-phase";

export function createScrollEngine(elements: PortfolioElements) {
  let winW = window.innerWidth;
  let winH = window.innerHeight;

  const getWinH = () => winH;

  const update = () => {
    const contactTop = elements.contactSection?.offsetTop ?? null;
    const ctx = computeScrollContext(
      window.scrollY,
      winW,
      winH,
      elements.heroScrollContainer.offsetHeight,
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
    syncLandingVars(winW, winH);
    update();
  };

  syncLandingVars(winW, winH);

  window.addEventListener("scroll", () => requestAnimationFrame(update), {
    passive: true,
  });
  window.addEventListener("resize", onResize);

  return { update, getWinH };
}
