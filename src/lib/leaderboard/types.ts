export type SubmitDecision =
  | {
      readonly accepted: true;
      readonly reason: "new_best" | "first_entry";
      readonly rank: number;
      readonly totalScore: number;
    }
  | {
      readonly accepted: false;
      readonly reason: "duplicate" | "score_too_low";
      readonly rank: number | null;
      readonly totalScore: number;
      readonly currentBestScore: number | null;
    };

export type LeaderboardEntry = {
  readonly id: string;
  readonly rank: number;
  readonly alias: string | null;
  readonly totalScore: number;
  readonly corpusPresetId: string;
  readonly submittedAt: Date;
  readonly fingerprint: string;
};

export type CommunityTemplate = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly kleSerialized: string;
  readonly promotedAt: Date;
};

export type PlacementSuggestion = {
  readonly char: string;
  readonly keyId: string;
  readonly layer: "base" | "shift";
  readonly estimatedGain: number;
};
