import { clamp } from "./easing";

export type InertiaTick = (smoothProgress: number, rawProgress: number) => void;

/**
 * Suit le scroll natif avec un léger retard (lerp) :
 * le mouvement continue un peu après le relâchement, dans les deux sens.
 */
export function createScrollInertia(options: {
  getRawProgress: () => number;
  onTick: InertiaTick;
  follow?: number;
  epsilon?: number;
}) {
  const follow = options.follow ?? 0.11;
  const epsilon = options.epsilon ?? 0.00012;
  let smooth = options.getRawProgress();
  let raf = 0;
  let running = false;

  const tick = () => {
    const raw = clamp(options.getRawProgress(), 0, 1);
    const delta = raw - smooth;
    if (Math.abs(delta) < epsilon) {
      smooth = raw;
      options.onTick(smooth, raw);
      running = false;
      raf = 0;
      return;
    }

    smooth += delta * follow;
    options.onTick(smooth, raw);
    raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };

  const setImmediate = (progress: number) => {
    smooth = clamp(progress, 0, 1);
    options.onTick(smooth, smooth);
  };

  const destroy = () => {
    if (raf) cancelAnimationFrame(raf);
    running = false;
    raf = 0;
  };

  return { kick, setImmediate, destroy, getSmooth: () => smooth };
}
