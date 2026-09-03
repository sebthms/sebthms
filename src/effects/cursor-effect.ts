/** Halo discret qui suit le curseur — désactivé sur écran tactile */
export function initCursorEffect(): void {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  document.addEventListener("mousemove", (e) => {
    document.body.style.setProperty("--cursor-x", `${e.clientX}px`);
    document.body.style.setProperty("--cursor-y", `${e.clientY}px`);
    document.body.classList.add("cursor-active");
  });
}
