/** Références DOM du portfolio — centralisées pour éviter les querySelector éparpillés */
export interface PortfolioElements {
  heroSection: HTMLElement;
  container: HTMLElement;
  processSection: HTMLElement;
  quoteSection: HTMLElement;
  contactSection: HTMLElement | null;
  heroScrollContainer: HTMLElement;
  header: HTMLElement | null;
  preScrollContent: HTMLElement | null;
  navLinks: NodeListOf<HTMLElement>;
}

const REQUIRED_IDS = [
  "hero-section",
  "container",
  "process",
  "devis",
  "home",
] as const;

/** Récupère et valide les éléments DOM requis au démarrage */
export function getPortfolioElements(): PortfolioElements | null {
  const heroSection = document.getElementById("hero-section");
  const container = document.getElementById("container");
  const processSection = document.getElementById("process");
  const quoteSection = document.getElementById("devis");
  const heroScrollContainer = document.getElementById("home");

  const missing = REQUIRED_IDS.filter((id) => !document.getElementById(id));
  if (
    missing.length > 0 ||
    !heroSection ||
    !container ||
    !processSection ||
    !quoteSection ||
    !heroScrollContainer
  ) {
    console.error("Missing elements:", missing);
    return null;
  }

  return {
    heroSection,
    container,
    processSection,
    quoteSection,
    contactSection: document.getElementById("contact"),
    heroScrollContainer,
    header: document.getElementById("header"),
    preScrollContent: document.getElementById("pre-scroll-content"),
    navLinks: document.querySelectorAll(".nav-link") as NodeListOf<HTMLElement>,
  };
}
