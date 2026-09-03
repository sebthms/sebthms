/** Références DOM du portfolio — centralisées pour éviter les querySelector éparpillés */
export interface PortfolioElements {
  heroSection: HTMLElement;
  container: HTMLElement;
  processSection: HTMLElement;
  journeySection: HTMLElement;
  passionSection: HTMLElement;
  passionLabel: HTMLElement | null;
  contactSection: HTMLElement | null;
  heroScrollContainer: HTMLElement;
  scrollIndicator: HTMLElement | null;
  header: HTMLElement | null;
  preScrollContent: HTMLElement | null;
  timelineProgressPath: SVGPathElement | null;
  timelineHProgress: HTMLElement | null;
  navLinks: NodeListOf<HTMLElement>;
}

const REQUIRED_IDS = [
  "hero-section",
  "container",
  "process",
  "parcours",
  "passion",
  "home",
] as const;

/** Récupère et valide les éléments DOM requis au démarrage */
export function getPortfolioElements(): PortfolioElements | null {
  const heroSection = document.getElementById("hero-section");
  const container = document.getElementById("container");
  const processSection = document.getElementById("process");
  const journeySection = document.getElementById("parcours");
  const passionSection = document.getElementById("passion");
  const heroScrollContainer = document.getElementById("home");

  const missing = REQUIRED_IDS.filter((id) => !document.getElementById(id));
  if (
    missing.length > 0 ||
    !heroSection ||
    !container ||
    !processSection ||
    !journeySection ||
    !passionSection ||
    !heroScrollContainer
  ) {
    console.error("Missing elements:", missing);
    return null;
  }

  return {
    heroSection,
    container,
    processSection,
    journeySection,
    passionSection,
    passionLabel: document.getElementById("passion-label"),
    contactSection: document.getElementById("contact"),
    heroScrollContainer,
    scrollIndicator: document.getElementById("scroll-indicator"),
    header: document.getElementById("header"),
    preScrollContent: document.getElementById("pre-scroll-content"),
    timelineProgressPath: document.getElementById(
      "timeline-progress",
    ) as SVGPathElement | null,
    timelineHProgress: document.getElementById("timeline-h-progress"),
    navLinks: document.querySelectorAll(".nav-link") as NodeListOf<HTMLElement>,
  };
}
