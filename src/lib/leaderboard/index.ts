export { computeLayoutFingerprint } from "./fingerprint";
export {
  corpusPresetAdvisoryLockKey,
  withCorpusPresetLock,
} from "./preset-lock";
export { computeCompetitionRanks } from "./rank";
export {
  computeRank,
  evaluateSubmitEligibility,
  evaluateSubmitScore,
  MIN_LAYOUT_COMPLETENESS,
} from "./submit-rules";
export type {
  SubmitAcceptReason,
  SubmitDecisionReason,
  SubmitRejectReason,
} from "./submit-rules";
export {
  describeSubmitPreview,
  describeSubmitResult,
} from "./submit-messages";
export { resolveKeyboardTemplateSlug } from "./template-slug";
export type {
  CommunityTemplate,
  LeaderboardEntry,
  LeaderboardStatus,
  PlacementSuggestion,
  SubmitDecision,
} from "./types";

export type {
  SubmitMessage,
  SubmitMessageTone,
  SubmitResultView,
} from "./submit-messages";

/** Pure domain module — leaderboard rules, promotion (E10). */
export const LEADERBOARD_MODULE = "leaderboard" as const;
