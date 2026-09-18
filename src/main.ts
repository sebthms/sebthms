import "./style.css";

import { getPortfolioElements } from "./dom/elements";
import { initQuoteForm } from "./quoteForm";
import { NAV_TARGETS } from "./scroll/constants";
import { isFlowLayout } from "./scroll/mediaQueries";
import { initMobileNav } from "./scroll/mobileNav";
import { initNav } from "./scroll/nav";
import { createScrollEngine } from "./scroll/scrollEngine";

document.addEventListener("DOMContentLoaded", () => {
  const elements = getPortfolioElements();
  if (!elements) return;

  initQuoteForm();

  const closeMobileNav = initMobileNav();
  const engine = createScrollEngine(elements);
  initNav(elements, engine.getWinH, closeMobileNav);
  if (window.location.hash === "#contact" && elements.contactSection) {
    if (isFlowLayout()) {
      elements.contactSection.scrollIntoView();
    } else {
      const maxScroll =
        elements.heroScrollContainer.offsetHeight - engine.getWinH();
      window.scrollTo({ top: NAV_TARGETS.contact * maxScroll });
    }
  }

  engine.update();
  window.addEventListener("pagehide", engine.destroy, { once: true });
});
