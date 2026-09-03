/** Limite une valeur entre min et max */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Courbe douce pour les transitions d'entrée/sortie */
export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** Progression linéaire entre deux seuils de phase */
export const phaseRange = (
  progress: number,
  start: number,
  end: number,
): number => clamp((progress - start) / (end - start), 0, 1);
