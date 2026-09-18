import type { PortfolioElements } from "../dom/elements";
import { HEADER_DARK_MODE_THRESHOLD } from "./constants";
import type { ScrollContext } from "./types";

export function applyHeaderState(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const { header } = elements;
  if (!header) return;

  const { scrollY, progress, inContactZone } = ctx;
  const darkMode = progress > HEADER_DARK_MODE_THRESHOLD;

  header.classList.toggle("dark-mode", darkMode);
  header.classList.toggle(
    "is-scrolled",
    scrollY > 28 || inContactZone || progress > 0.04,
  );
}
