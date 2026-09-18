import { clamp } from "../scroll/easing";

const EASE = "0.5s cubic-bezier(0.22, 1, 0.36, 1)";
const THRESHOLD = 72;

export interface ProjectStackControls {
  setEnabled: (enabled: boolean) => void;
  getIndex: () => number;
}

export function initProjectStack(
  stack: HTMLElement,
  pagination: HTMLElement | null,
): ProjectStackControls {
  const cards = [
    ...stack.querySelectorAll<HTMLElement>(".passion-card"),
  ];
  const dots = pagination
    ? [...pagination.querySelectorAll<HTMLButtonElement>(".projects-dots button")]
    : [];
  const count = cards.length;

  let index = 0;
  let enabled = false;
  let dragging = false;
  let dragX = 0;
  let startX = 0;
  let startY = 0;
  let locked: "x" | "y" | null = null;
  let suppressClick = false;
  let pointerId: number | null = null;

  const wrap = (value: number) => ((value % count) + count) % count;

  const render = () => {
    cards.forEach((card, i) => {
      const rel = wrap(i - index);
      const isFront = rel === 0;
      card.classList.toggle("is-front", isFront);
      card.inert = !enabled || !isFront;
      card.style.zIndex = String(count - rel);
      card.style.transition = dragging && isFront ? "none" : `transform ${EASE}, opacity ${EASE}`;

      if (isFront) {
        const rot = (dragX / 640) * 4;
        card.style.opacity = "1";
        card.style.transform = `translateX(${dragX}px) rotate(${rot}deg)`;
        return;
      }

      const depth = Math.min(rel, 2);
      const rise = dragging ? clamp(dragX / 240, 0, 1) : 0;
      const y = depth * 7 - rise * 6;
      card.style.opacity = "1";
      card.style.transform = `translateY(${y}px)`;
    });

    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      if (on) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const go = (next: number) => {
    index = wrap(next);
    dragX = 0;
    dragging = false;
    render();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!enabled || event.button !== 0) return;
    dragging = true;
    locked = null;
    suppressClick = false;
    dragX = 0;
    startX = event.clientX;
    startY = event.clientY;
    pointerId = event.pointerId;
    stack.setPointerCapture(event.pointerId);
    stack.classList.add("is-dragging");
    render();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      locked = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (locked === "y") {
        dragging = false;
        stack.classList.remove("is-dragging");
        try {
          stack.releasePointerCapture(event.pointerId);
        } catch {
          /* already released */
        }
        dragX = 0;
        render();
        return;
      }
    }
    event.preventDefault();
    dragX = Math.max(0, dx);
    render();
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    stack.classList.remove("is-dragging");
    try {
      stack.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (!dragging) return;
    dragging = false;
    if (dragX > THRESHOLD) {
      suppressClick = true;
      go(index + 1);
    } else {
      if (dragX > 10) suppressClick = true;
      dragX = 0;
      render();
    }
  };

  stack.addEventListener("pointerdown", onPointerDown);
  stack.addEventListener("pointermove", onPointerMove);
  stack.addEventListener("pointerup", onPointerUp);
  stack.addEventListener("pointercancel", onPointerUp);
  stack.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true,
  );

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      if (!enabled) return;
      go(i);
    });
  });

  pagination
    ?.querySelector(".projects-nav-prev")
    ?.addEventListener("click", () => {
      if (!enabled) return;
      go(index - 1);
    });
  pagination
    ?.querySelector(".projects-nav-next")
    ?.addEventListener("click", () => {
      if (!enabled) return;
      go(index + 1);
    });

  render();

  return {
    getIndex: () => index,
    setEnabled: (value: boolean) => {
      enabled = value;
      stack.classList.toggle("is-enabled", value);
      if (!value) {
        dragging = false;
        dragX = 0;
      }
      render();
    },
  };
}
