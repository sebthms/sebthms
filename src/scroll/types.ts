/** État scroll calculé à chaque frame */
export interface ScrollContext {
  scrollY: number;
  winW: number;
  winH: number;
  heroH: number;
  maxScroll: number;
  progress: number;
  inContactZone: boolean;
  scrollPastHero: number;
  exitProgress: number;
  exitEased: number;
}

/** Sous-progressions hero + carte uniquement */
export interface PhaseProgress {
  phase1: number;
  phase2: number;
}
