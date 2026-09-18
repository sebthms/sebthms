import type { PortfolioElements } from "../dom/elements";
import { FLOW_LAYOUT_QUERY } from "./mediaQueries";

const LAYOUT_PROPS = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "width",
  "height",
  "margin",
  "transform",
  "transformOrigin",
  "opacity",
  "filter",
  "visibility",
  "pointerEvents",
  "borderRadius",
  "boxShadow",
  "display",
] as const;

function clearLayoutStyles(element: HTMLElement | null) {
  if (!element) return;
  for (const prop of LAYOUT_PROPS) {
    element.style.removeProperty(prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
  }
}

export function createFlowLayout(elements: PortfolioElements) {
  const media = window.matchMedia(FLOW_LAYOUT_QUERY);
  const sections = [
    elements.heroSection,
    elements.processSection,
    elements.quoteSection,
    elements.contactSection,
  ];

  return () => {
    document.documentElement.classList.toggle("is-flow-layout", media.matches);

    if (!media.matches) {
      return false;
    }

    clearLayoutStyles(elements.heroSection);
    clearLayoutStyles(elements.container);
    clearLayoutStyles(elements.preScrollContent);
    clearLayoutStyles(elements.processSection);
    clearLayoutStyles(elements.quoteSection);
    clearLayoutStyles(elements.contactSection);

    elements.processSection
      .querySelectorAll<HTMLElement>(".journey-title-word")
      .forEach((word, index) => {
        const isActive = index === 0;
        word.classList.toggle("is-active", isActive);
        word.setAttribute("aria-hidden", String(!isActive));
      });
    elements.processSection
      .querySelectorAll<HTMLElement>(".journey-dock")
      .forEach((entry) => {
        clearLayoutStyles(entry);
        entry.removeAttribute("aria-hidden");
      });
    [elements.processSection, elements.quoteSection, elements.contactSection]
      .filter((section): section is HTMLElement => section !== null)
      .forEach((section) => {
        section.inert = false;
        section.removeAttribute("aria-hidden");
      });

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
