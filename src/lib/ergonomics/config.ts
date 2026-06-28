import type { Finger, Row } from "./types";

/** Versioned penalty tables consumed by the scoring engine (E4). */
export type ErgonomicsConfig = {
  version: number;
  /** Row reach cost — distance from home row. */
  rowReachPenalty: Readonly<Record<Row, number>>;
  /** Base finger weakness cost (pinky highest). */
  fingerWeakPenalty: Readonly<Record<Finger, number>>;
  /** Extra penalty for outer-column pinky keys (Q, A, Z, P, etc.). */
  outerColumnPenalty: number;
  /** Dedicated thumb penalty for spacebar (lower than pinky stretch keys). */
  thumbSpacePenalty: number;
  /** Penalty for non-space thumb keys (Alt, Win). */
  thumbModifierPenalty: number;
};

export const ERGONOMICS_CONFIG_V1: ErgonomicsConfig = {
  version: 1,
  rowReachPenalty: {
    home: 0,
    top: 0.25,
    bottom: 0.35,
    number: 0.55,
  },
  fingerWeakPenalty: {
    index: 0,
    middle: 0.05,
    ring: 0.15,
    pinky: 0.4,
    thumb: 0.08,
  },
  outerColumnPenalty: 0.12,
  thumbSpacePenalty: 0.05,
  thumbModifierPenalty: 0.18,
};

/** Default ergonomics config (latest stable version). */
export const DEFAULT_ERGONOMICS_CONFIG = ERGONOMICS_CONFIG_V1;

/** Outer-column keys that incur extra pinky stretch penalty. */
export const OUTER_COLUMN_KEY_IDS = new Set([
  "R0C0",
  "R0C1",
  "R0C10",
  "R0C11",
  "R0C12",
  "R0C13",
  "R1C0",
  "R1C1",
  "R1C10",
  "R1C11",
  "R1C12",
  "R1C13",
  "R2C0",
  "R2C1",
  "R2C10",
  "R2C11",
  "R2C12",
  "R3C0",
  "R3C1",
  "R3C10",
  "R3C11",
  "R4C0",
  "R4C6",
  "R4C7",
]);

/** Spacebar keyId on the 60% ANSI template. */
export const SPACEBAR_KEY_ID = "R4C3";
