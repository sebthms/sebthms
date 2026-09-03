import { getCardConfig } from "./constants";

/** Synchronise les variables CSS --card-initial-* avec les ratios JS */
export function syncLandingVars(winW: number, winH: number): void {
  const { initial } = getCardConfig(winW);

  document.documentElement.style.setProperty(
    "--card-initial-height",
    `${initial.height * winH}px`,
  );
  document.documentElement.style.setProperty(
    "--card-initial-bottom",
    `${initial.bottom * winH}px`,
  );
}
