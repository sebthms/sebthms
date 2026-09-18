import { clamp } from "./easing";

export function applyProcessDock(
  section: HTMLElement,
  opacity: number,
  move: number,
): void {
  const items = [...section.querySelectorAll<HTMLElement>(".journey-dock")];
  const count = items.length;
  if (count === 0) return;

  const last = Math.max(count - 1, 1);
  const position = clamp(move, 0, 1) * last;
  const activeIndex = Math.round(position);

  items.forEach((el, index) => {
    const isActive = index === activeIndex;
    const translateY = isActive
        ? "-1.6rem"
        : index < activeIndex
          ? "-5rem"
          : "1.8rem";
    el.style.opacity = isActive ? String(opacity) : "0";
    el.style.visibility = "visible";
    el.style.pointerEvents = isActive && opacity > 0.05 ? "auto" : "none";
    el.style.transform = `translateY(${translateY}) scale(${isActive ? 1 : 0.9})`;
    el.setAttribute("aria-hidden", String(!isActive));
  });

  const bestKind = items[activeIndex]?.dataset.kind ?? "";
  section.querySelectorAll<HTMLElement>(".journey-title-word").forEach((word) => {
    const isActive = word.dataset.label === bestKind;
    word.classList.toggle("is-active", isActive);
    word.setAttribute("aria-hidden", String(!isActive));
  });
}
