import { FLOW_LAYOUT_QUERY } from "./mediaQueries";

/** Menu burger — panneau latéral mobile */
export function initMobileNav(): () => void {
  const header = document.getElementById("header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("header-nav");
  const main = document.querySelector("main");

  if (!header || !toggle || !nav) return () => {};

  const media = window.matchMedia(FLOW_LAYOUT_QUERY);
  let lastFocused: HTMLElement | null = null;

  const setNavAvailability = (isOpen: boolean) => {
    const hidden = media.matches && !isOpen;
    nav.inert = hidden;
    if (hidden) nav.setAttribute("aria-hidden", "true");
    else nav.removeAttribute("aria-hidden");
  };

  const close = (restoreFocus = true) => {
    const wasOpen = header.classList.contains("is-nav-open");
    header.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("nav-open");
    if (main) main.inert = false;
    setNavAvailability(false);
    if (wasOpen && restoreFocus) lastFocused?.focus();
  };

  const open = () => {
    lastFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : toggle;
    header.classList.add("is-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fermer le menu");
    document.body.classList.add("nav-open");
    if (main) main.inert = true;
    setNavAvailability(true);
    nav.querySelector<HTMLElement>("a[href]")?.focus();
  };

  toggle.addEventListener("click", () => {
    if (header.classList.contains("is-nav-open")) close();
    else open();
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (!header.classList.contains("is-nav-open")) return;
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = [
      toggle,
      ...nav.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    ];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onBodyClick = (e: MouseEvent) => {
    if (!header.classList.contains("is-nav-open")) return;
    const target = e.target as Node;
    if (!nav.contains(target) && !toggle.contains(target)) close();
  };

  document.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("click", onBodyClick);
  media.addEventListener("change", () => close(false));
  setNavAvailability(false);

  return () => close(false);
}
