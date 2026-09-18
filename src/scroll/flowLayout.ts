import type { PortfolioElements } from "../dom/elements";
import { FLOW_LAYOUT_QUERY } from "./mediaQueries";

export function createFlowLayout(elements: PortfolioElements) {
  const media = window.matchMedia(FLOW_LAYOUT_QUERY);
  const animated = [
    elements.heroSection,
    elements.container,
    elements.preScrollContent,
    elements.processSection,
    elements.quoteSection,
    elements.contactSection,
    ...elements.container.querySelectorAll<HTMLElement>(
      ".journey-dock",
    ),
  ].filter((element): element is HTMLElement => element !== null);
  const initialStyles = animated.map((element) => element.getAttribute("style"));
  const sections = [
    elements.heroSection,
    elements.processSection,
    elements.quoteSection,
    elements.contactSection,
  ];
  let wasFlow = false;

  return () => {
    if (!media.matches) {
      wasFlow = false;
      return false;
    }

    if (!wasFlow) {
      animated.forEach((element, index) => {
        const style = initialStyles[index];
        if (style == null) element.removeAttribute("style");
        else element.setAttribute("style", style);
      });
      elements.processSection
        .querySelectorAll<HTMLElement>(".journey-title-word")
        .forEach(
          (word, index) => {
            const isActive = index === 0;
            word.classList.toggle("is-active", isActive);
            word.setAttribute("aria-hidden", String(!isActive));
          },
        );
      elements.processSection
        .querySelectorAll<HTMLElement>(".journey-dock")
        .forEach((entry) => entry.removeAttribute("aria-hidden"));
      [elements.processSection, elements.quoteSection, elements.contactSection]
        .filter((section): section is HTMLElement => section !== null)
        .forEach((section) => {
          section.inert = false;
          section.removeAttribute("aria-hidden");
        });
      wasFlow = true;
    }

    let active = "home";
    for (const section of sections) {
      if (section && section.getBoundingClientRect().top <= 120) {
        active = section === elements.heroSection ? "home" : section.id;
      }
    }
    elements.navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === active);
    });
    elements.header?.classList.toggle(
      "dark-mode",
      window.scrollY >= elements.heroSection.offsetHeight - 80,
    );
    elements.header?.classList.toggle("is-scrolled", window.scrollY > 28);
    return true;
  };
}
