/** Minimum charset completeness (percent) required for leaderboard submit. */
export const MIN_LAYOUT_COMPLETENESS = 100;

export type SubmitAcceptReason = "new_best" | "first_entry";

export type SubmitRejectReason =
  "score_too_low" | "incomplete_layout" | "duplicate";

export type SubmitDecisionReason = SubmitAcceptReason | SubmitRejectReason;

/** Evaluate whether a submitted score should be accepted (E10/E12 rules). */
export function evaluateSubmitScore(
  totalScore: number,
  currentBestScore: number | null,
): {
  readonly accepted: boolean;
  readonly reason: SubmitAcceptReason | "score_too_low";
} {
  if (currentBestScore === null) {
    return { accepted: true, reason: "first_entry" };
  }

  if (totalScore > currentBestScore) {
    return { accepted: true, reason: "new_best" };
  }

  return { accepted: false, reason: "score_too_low" };
}

/** Full submit gate: completeness + score vs current best. */
export function evaluateSubmitEligibility(
  totalScore: number,
  currentBestScore: number | null,
  completenessScore: number,
  minCompleteness: number = MIN_LAYOUT_COMPLETENESS,
): {
  readonly accepted: boolean;
  readonly reason: SubmitDecisionReason;
} {
  if (completenessScore < minCompleteness) {
    return { accepted: false, reason: "incomplete_layout" };
  }

  return evaluateSubmitScore(totalScore, currentBestScore);
}

/** Rank is 1-based position when sorted by score descending. */
export function computeRank(
  totalScore: number,
  higherScores: readonly number[],
): number {
  const betterCount = higherScores.filter((score) => score > totalScore).length;
  return betterCount + 1;
}
