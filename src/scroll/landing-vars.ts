import { getFittedCardInitial } from "./constants";

export function measureHeroBottom(heroSection: HTMLElement): number {
  const top = parseFloat(getComputedStyle(heroSection).top) || 0;
  return top + heroSection.offsetHeight;
}

/** Synchronise les variables CSS --card-initial-* avec les ratios JS */
export function syncLandingVars(
  winW: number,
  winH: number,
  heroBottom: number,
): void {
  const initial = getFittedCardInitial(winW, winH, heroBottom);

  document.documentElement.style.setProperty(
    "--card-initial-height",
    `${initial.height * winH}px`,
  );
  document.documentElement.style.setProperty(
    "--card-initial-bottom",
    `${initial.bottom * winH}px`,
  );
}
