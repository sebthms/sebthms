/** Spotlight radial sur la carte noire — variables --mouse-x / --mouse-y */
export function initCardSpotlight(container: HTMLElement): void {
  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    container.style.setProperty("--mouse-x", `${x}%`);
    container.style.setProperty("--mouse-y", `${y}%`);
  });
}
