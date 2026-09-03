import type { PortfolioElements } from "../dom/elements";
import {
  NAV_TARGETS,
  PHASE2_END,
  PHASE4_ENTER_START,
  PHASE6_ENTER_START,
} from "./constants";
import type { ScrollContext } from "./types";

export function updateActiveNavLink(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const { progress, inContactZone } = ctx;

  elements.navLinks.forEach((link) => link.classList.remove("active"));

  let section: string;
  if (inContactZone) {
    section = "contact";
  } else if (progress < PHASE2_END) {
    section = "home";
  } else if (progress < PHASE4_ENTER_START) {
    section = "process";
  } else if (progress < PHASE6_ENTER_START) {
    section = "parcours";
  } else {
    section = "passion";
  }

  document
    .querySelector(`.nav-link[data-section="${section}"]`)
    ?.classList.add("active");
}

export function initNav(
  elements: PortfolioElements,
  getWinH: () => number,
  closeMobileNav: () => void,
): void {
  const { heroScrollContainer, contactSection } = elements;

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      closeMobileNav();

      const sectionId = link.getAttribute("data-section");

      if (sectionId === "contact") {
        contactSection?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (sectionId === "home" || !sectionId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const maxScroll = heroScrollContainer.offsetHeight - getWinH();
      const targetProgress =
        NAV_TARGETS[sectionId as keyof typeof NAV_TARGETS] ?? 0;

      window.scrollTo({
        top: targetProgress * maxScroll,
        behavior: "smooth",
      });
    });
  });
}
