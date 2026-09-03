import "./style.css";

import { getPortfolioElements } from "./dom/elements";
import { initCardSpotlight } from "./effects/card-spotlight";
import { initCursorEffect } from "./effects/cursor-effect";
import { initMobileNav } from "./scroll/mobile-nav";
import { initNav } from "./scroll/nav";
import { createScrollEngine } from "./scroll/scroll-engine";

document.addEventListener("DOMContentLoaded", () => {
  const elements = getPortfolioElements();
  if (!elements) return;

  initCardSpotlight(elements.container);
  initCursorEffect();

  const closeMobileNav = initMobileNav();
  const engine = createScrollEngine(elements);
  initNav(elements, engine.getWinH, closeMobileNav);
  if (window.location.hash === "#contact" && elements.contactSection) {
    elements.contactSection.scrollIntoView();
  }

  engine.update();
});
