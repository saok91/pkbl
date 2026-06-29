/** Evaluate whether a submitted score should be accepted (E10/E12 rules). */
export function evaluateSubmitScore(
  totalScore: number,
  currentBestScore: number | null,
): {
  readonly accepted: boolean;
  readonly reason: "new_best" | "first_entry" | "score_too_low";
} {
  if (currentBestScore === null) {
    return { accepted: true, reason: "first_entry" };
  }

  if (totalScore > currentBestScore) {
    return { accepted: true, reason: "new_best" };
  }

  return { accepted: false, reason: "score_too_low" };
}

/** Rank is 1-based position when sorted by score descending. */
export function computeRank(
  totalScore: number,
  higherScores: readonly number[],
): number {
  const betterCount = higherScores.filter((score) => score > totalScore).length;
  return betterCount + 1;
}
