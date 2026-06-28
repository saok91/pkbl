import fingerMapData from "./finger-map-60.json";
import type { FingerAssignment, FingerMap } from "./types";

export const FINGER_MAP_60_TEMPLATE_ID = fingerMapData.templateId;
export const FINGER_MAP_60_VERSION = fingerMapData.version;

const fingerMap60: FingerMap = Object.freeze(
  fingerMapData.keys as Record<string, FingerAssignment>,
);

/** All keyIds in the 60% ANSI finger map. */
export const FINGER_MAP_60_KEY_IDS = Object.freeze(
  Object.keys(fingerMap60),
) as readonly string[];

/** Static finger/hand/row map for the default 60% ANSI template. */
export function getFingerMap60(): FingerMap {
  return fingerMap60;
}

/** Lookup finger assignment for a keyId; throws if unmapped. */
export function getFingerAssignment(keyId: string): FingerAssignment {
  const assignment = fingerMap60[keyId];
  if (!assignment) {
    throw new Error(`No finger assignment for keyId: ${keyId}`);
  }
  return assignment;
}

/** True when every keyId in the list has a finger assignment. */
export function isFingerMapComplete(keyIds: readonly string[]): boolean {
  return keyIds.every((keyId) => keyId in fingerMap60);
}
