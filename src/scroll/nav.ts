import type { PortfolioElements } from "../dom/elements";
import {
  NAV_TARGETS,
  PHASE2_END,
  PHASE4_ENTER_START,
} from "./constants";
import type { ScrollContext } from "./types";
import { isFlowLayout, prefersReducedMotion } from "./mediaQueries";

export function updateActiveNavLink(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const { progress, inContactZone } = ctx;

  let section: string;
  if (inContactZone) {
    section = "contact";
  } else if (progress < PHASE2_END) {
    section = "home";
  } else if (progress < PHASE4_ENTER_START) {
    section = "process";
  } else {
    section = "devis";
  }

  elements.navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === section);
  });
}

export function initNav(
  elements: PortfolioElements,
  getWinH: () => number,
  closeMobileNav: () => void,
): void {
  const { heroScrollContainer } = elements;

  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      closeMobileNav();

      const sectionId = link.getAttribute("data-section");
      const behavior = prefersReducedMotion() ? "instant" : "smooth";

      if (isFlowLayout() && sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior });
        return;
      }

      if (sectionId === "home" || !sectionId) {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      const maxScroll = heroScrollContainer.offsetHeight - getWinH();
      const targetProgress =
        NAV_TARGETS[sectionId as keyof typeof NAV_TARGETS] ?? 0;

      window.scrollTo({
        top: targetProgress * maxScroll,
        behavior,
      });
    });
  });
}
