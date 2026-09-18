import { CARD_INITIAL } from "./constants";

/** Synchronise les variables CSS --card-initial-* avec les ratios JS */
export function syncLandingVars(winH: number): void {
  document.documentElement.style.setProperty(
    "--card-initial-height",
    `${CARD_INITIAL.height * winH}px`,
  );
  document.documentElement.style.setProperty(
    "--card-initial-bottom",
    `${CARD_INITIAL.bottom * winH}px`,
  );
}
