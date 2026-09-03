import { PHASE6_ENTER_END } from "./constants";
import type { ScrollContext } from "./types";

export function updateBodyClasses(ctx: ScrollContext): void {
  const { progress, inContactZone, exitProgress } = ctx;

  document.body.classList.toggle("contact-zone", inContactZone);
  document.body.classList.toggle(
    "passion-landing",
    progress >= PHASE6_ENTER_END && exitProgress < 0.08,
  );
}
