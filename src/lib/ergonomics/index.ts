export {
  DEFAULT_ERGONOMICS_CONFIG,
  ERGONOMICS_CONFIG_V1,
  OUTER_COLUMN_KEY_IDS,
  SPACEBAR_KEY_ID,
} from "./config";
export type { ErgonomicsConfig } from "./config";

export {
  FINGER_MAP_60_KEY_IDS,
  FINGER_MAP_60_TEMPLATE_ID,
  FINGER_MAP_60_VERSION,
  getFingerAssignment,
  getFingerMap60,
  isFingerMapComplete,
} from "./finger-map-60";

export { buildKeyMetricsMap, getKeyMetrics } from "./metrics";

export type {
  Finger,
  FingerAssignment,
  FingerMap,
  Hand,
  KeyMetrics,
  Row,
} from "./types";

/** Domain module marker for boundary tests. */
export const ERGONOMICS_MODULE = "ergonomics" as const;
