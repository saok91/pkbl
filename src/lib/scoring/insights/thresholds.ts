/** v1 p75-style thresholds — tunable after corpus baseline calibration. */
export const RANKING_HINT_THRESHOLDS = {
  weakKeyPenalty: 18,
  sameFingerBigrams: 12,
  homeRowUsageMin: 45,
  handBalanceMin: 0.85,
  rowSwitching: 28,
  unigramCostWithMissing: 40,
} as const;
