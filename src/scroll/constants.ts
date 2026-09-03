/**
 * Phases séquentielles sans chevauchement :
 * enter → active (animations scroll) → fade → phase suivante
 */
export const PHASE1_END = 0.1;
export const PHASE2_END = 0.18;

export const PHASE3_ENTER_START = PHASE2_END;
export const PHASE3_ENTER_END = 0.2;
export const PHASE3_ACTIVE_END = 0.36;
export const PHASE3_FADE_END = 0.4;

export const PHASE4_ENTER_START = 0.4;
export const PHASE4_ENTER_END = 0.42;
export const PHASE4_ACTIVE_END = 0.52;
export const PHASE4_FADE_END = 0.56;

export const PHASE5_ENTER_START = 0.56;
export const PHASE5_ENTER_END = 0.58;
export const PHASE5_ACTIVE_END = 0.68;
export const PHASE5_FADE_END = 0.72;

export const PHASE6_ENTER_START = 0.72;
export const PHASE6_ENTER_END = 0.74;
export const PHASE6_ACTIVE_END = 1;
export const PROJECTS_SHRINK_END = 0.82;
export const PROJECTS_SLIDE_START = 0.86;
export const PROJECTS_SLIDE_END = 0.96;

/** Alias rétrocompatibles pour la géométrie carte passion */
export const PHASE6_END = PHASE6_ACTIVE_END;

export const EXIT_SCROLL_RATIO = 0.48;
export const HEADER_DARK_MODE_THRESHOLD = 0.16;
export const MOBILE_BREAKPOINT = 768;

export const CARD_INITIAL = {
  width: 0.9,
  height: 0.44,
  bottom: 0.03,
  radius: 32,
} as const;

export const CARD_INITIAL_MOBILE = {
  width: 0.92,
  height: 0.4,
  bottom: 0.02,
  radius: 24,
} as const;

export const PASSION_CARD = {
  width: 0.9,
  height: 0.5,
  radius: 32,
} as const;

export const PASSION_CARD_MOBILE = {
  width: 0.92,
  height: 0.62,
  radius: 20,
} as const;

export type CardDimensions = {
  width: number;
  height: number;
  bottom: number;
  radius: number;
};

export function getCardConfig(winW: number): {
  initial: CardDimensions;
  passion: Omit<CardDimensions, "bottom">;
} {
  if (winW <= MOBILE_BREAKPOINT) {
    return { initial: CARD_INITIAL_MOBILE, passion: PASSION_CARD_MOBILE };
  }
  return { initial: CARD_INITIAL, passion: PASSION_CARD };
}

export const NAV_TARGETS = {
  process: (PHASE3_ENTER_END + PHASE3_ACTIVE_END) / 2,
  parcours: (PHASE4_ENTER_END + PHASE5_ACTIVE_END) / 2,
  passion: PROJECTS_SHRINK_END,
} as const;
