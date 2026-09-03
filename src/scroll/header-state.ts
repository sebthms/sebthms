import type { PortfolioElements } from "../dom/elements";
import {
  HEADER_DARK_MODE_THRESHOLD,
  PROJECTS_SHRINK_END,
  PHASE6_ENTER_END,
} from "./constants";
import { clamp, easeInOut } from "./easing";
import type { ScrollContext } from "./types";

export function applyHeaderState(
  elements: PortfolioElements,
  ctx: ScrollContext,
): void {
  const { header } = elements;
  if (!header) return;

  const { scrollY, progress, inContactZone } = ctx;
  const shrink = easeInOut(clamp(
    (progress - PHASE6_ENTER_END) / (PROJECTS_SHRINK_END - PHASE6_ENTER_END),
    0, 1,
  ));

  const darkMode =
    !inContactZone &&
    progress > HEADER_DARK_MODE_THRESHOLD &&
    shrink < 0.45;

  header.classList.toggle("dark-mode", darkMode);
  header.classList.toggle(
    "is-scrolled",
    scrollY > 28 || inContactZone || progress > 0.04,
  );
}
