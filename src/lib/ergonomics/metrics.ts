import {
  DEFAULT_ERGONOMICS_CONFIG,
  OUTER_COLUMN_KEY_IDS,
  SPACEBAR_KEY_ID,
  type ErgonomicsConfig,
} from "./config";
import { getFingerAssignment } from "./finger-map-60";
import type { FingerAssignment, KeyMetrics } from "./types";

function computeReachPenalty(
  assignment: FingerAssignment,
  config: ErgonomicsConfig,
): number {
  return config.rowReachPenalty[assignment.row];
}

function computeWeakKeyPenalty(
  keyId: string,
  assignment: FingerAssignment,
  config: ErgonomicsConfig,
): number {
  if (assignment.finger === "thumb") {
    return keyId === SPACEBAR_KEY_ID
      ? config.thumbSpacePenalty
      : config.thumbModifierPenalty;
  }

  const outerBonus =
    assignment.finger === "pinky" && OUTER_COLUMN_KEY_IDS.has(keyId)
      ? config.outerColumnPenalty
      : 0;

  return config.fingerWeakPenalty[assignment.finger] + outerBonus;
}

/** Compute full KeyMetrics (reach + weak penalties) for a physical key. */
export function getKeyMetrics(
  keyId: string,
  config: ErgonomicsConfig = DEFAULT_ERGONOMICS_CONFIG,
): KeyMetrics {
  const assignment = getFingerAssignment(keyId);

  return {
    ...assignment,
    reachPenalty: computeReachPenalty(assignment, config),
    weakKeyPenalty: computeWeakKeyPenalty(keyId, assignment, config),
  };
}

/** Build a metrics map for all keys in a finger map. */
export function buildKeyMetricsMap(
  keyIds: readonly string[],
  config: ErgonomicsConfig = DEFAULT_ERGONOMICS_CONFIG,
): ReadonlyMap<string, KeyMetrics> {
  return new Map(keyIds.map((keyId) => [keyId, getKeyMetrics(keyId, config)]));
}
