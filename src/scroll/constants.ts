/** Phases séquentielles pilotées par l'unique progression du hero. */
export const PHASE1_END = 0.1;
export const PHASE2_END = 0.18;

export const PHASE3_ENTER_START = PHASE2_END;
export const PHASE3_ENTER_END = 0.2;
export const PHASE3_DOCK_END = 0.64;
export const PHASE3_ACTIVE_END = 0.7;
export const PHASE3_FADE_END = 0.8;

/** Devis */
export const PHASE4_ENTER_START = PHASE3_ACTIVE_END;
export const PHASE4_ENTER_END = PHASE3_FADE_END;
export const PHASE4_ACTIVE_END = 0.88;
export const PHASE4_FADE_END = 0.94;

/** Contact dans la carte noire */
export const PHASE5_ENTER_START = PHASE4_ACTIVE_END;
export const PHASE5_ENTER_END = PHASE4_FADE_END;

export const HEADER_DARK_MODE_THRESHOLD = 0.16;

export type CardDimensions = {
  width: number;
  height: number;
  bottom: number;
  radius: number;
};

export const CARD_INITIAL: CardDimensions = {
  width: 0.9,
  height: 0.44,
  bottom: 0.03,
  radius: 32,
};

export const NAV_TARGETS = {
  process: (PHASE3_ENTER_END + PHASE3_ACTIVE_END) / 2,
  devis: (PHASE4_ENTER_END + PHASE4_ACTIVE_END) / 2,
  contact: (PHASE5_ENTER_END + 1) / 2,
} as const;
