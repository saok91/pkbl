export type Finger = "thumb" | "index" | "middle" | "ring" | "pinky";

export type Hand = "left" | "right";

export type Row = "home" | "top" | "bottom" | "number";

/** Static finger assignment for a physical key (no penalties). */
export type FingerAssignment = {
  finger: Finger;
  hand: Hand;
  row: Row;
};

export type KeyMetrics = FingerAssignment & {
  reachPenalty: number;
  weakKeyPenalty: number;
};

/** Per-key finger/hand/row mapping keyed by stable template keyId. */
export type FingerMap = Readonly<Record<string, FingerAssignment>>;
