import type { SubmitAcceptReason, SubmitRejectReason } from "./submit-rules";

export type SubmitDecision =
  | {
      readonly accepted: true;
      readonly reason: SubmitAcceptReason;
      readonly rank: number;
      readonly totalScore: number;
    }
  | {
      readonly accepted: false;
      readonly reason: SubmitRejectReason;
      readonly rank: null;
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
};

export type LeaderboardStatus = {
  readonly currentBestScore: number | null;
  readonly currentBestAlias: string | null;
  readonly totalEntries: number;
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
