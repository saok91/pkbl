import type { NgramArtifact } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFrequencyRecord(value: unknown): value is Record<string, number> {
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).every(
    (count) =>
      typeof count === "number" && Number.isFinite(count) && count >= 0,
  );
}

function requireNonEmptyString(
  value: unknown,
  field: string,
): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid n-gram artifact: missing or empty ${field}`);
  }
}

/** Validate unknown JSON payload before converting to NgramStats. */
export function assertNgramArtifact(
  value: unknown,
): asserts value is NgramArtifact {
  if (!isRecord(value)) {
    throw new Error("Invalid n-gram artifact: expected object");
  }

  requireNonEmptyString(value.corpusId, "corpusId");
  requireNonEmptyString(value.version, "version");
  requireNonEmptyString(value.normalizedVersion, "normalizedVersion");
  requireNonEmptyString(value.builtAt, "builtAt");

  if (
    typeof value.charCount !== "number" ||
    !Number.isFinite(value.charCount)
  ) {
    throw new Error(
      "Invalid n-gram artifact: charCount must be a finite number",
    );
  }
  if (value.charCount < 0) {
    throw new Error("Invalid n-gram artifact: charCount must be >= 0");
  }

  if (!isFrequencyRecord(value.unigrams)) {
    throw new Error(
      "Invalid n-gram artifact: unigrams must be a frequency record",
    );
  }
  if (!isFrequencyRecord(value.bigrams)) {
    throw new Error(
      "Invalid n-gram artifact: bigrams must be a frequency record",
    );
  }
  if (!isFrequencyRecord(value.trigrams)) {
    throw new Error(
      "Invalid n-gram artifact: trigrams must be a frequency record",
    );
  }
}
