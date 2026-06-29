export { computeLayoutFingerprint } from "./fingerprint";
export { computeRank, evaluateSubmitScore } from "./submit-rules";
export { resolveKeyboardTemplateSlug } from "./template-slug";
export type {
  CommunityTemplate,
  LeaderboardEntry,
  PlacementSuggestion,
  SubmitDecision,
} from "./types";

/** Pure domain module — leaderboard rules, promotion (E10). */
export const LEADERBOARD_MODULE = "leaderboard" as const;
