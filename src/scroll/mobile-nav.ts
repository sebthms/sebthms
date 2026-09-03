/** Menu burger — panneau latéral mobile */
export function initMobileNav(): () => void {
  const header = document.getElementById("header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("header-nav");

  if (!header || !toggle || !nav) return () => {};

  const close = () => {
    header.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("nav-open");
  };

  const open = () => {
    header.classList.add("is-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fermer le menu");
    document.body.classList.add("nav-open");
  };

  toggle.addEventListener("click", () => {
    if (header.classList.contains("is-nav-open")) close();
    else open();
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  const onBodyClick = (e: MouseEvent) => {
    if (!header.classList.contains("is-nav-open")) return;
    const target = e.target as Node;
    if (!nav.contains(target) && !toggle.contains(target)) close();
  };

  document.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("click", onBodyClick);

  return close;
}
