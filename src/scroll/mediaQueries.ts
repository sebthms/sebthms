export const FLOW_LAYOUT_QUERY = "(max-width: 1024px), (max-height: 720px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const isFlowLayout = (): boolean =>
  window.matchMedia(FLOW_LAYOUT_QUERY).matches;

export const prefersReducedMotion = (): boolean =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
