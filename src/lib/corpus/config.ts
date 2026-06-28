import { EDITABLE_CHARSET_SET } from "@/lib/layout/editable-scope";

/** How to normalize digit variants during corpus preprocessing. */
export type DigitPolicy = "latin" | "persian" | "preserve";

/** Versioned Persian text normalization policy (E3-S1). */
export type NormalizationConfig = {
  readonly version: number;
  /** Stable string embedded in NgramStats for reproducibility. */
  readonly normalizedVersion: string;
  readonly digitPolicy: DigitPolicy;
};

export const NORMALIZATION_CONFIG_V1: NormalizationConfig = {
  version: 1,
  normalizedVersion: "fa-normalize-v1",
  digitPolicy: "latin",
};

/** Default normalization config (latest stable version). */
export const DEFAULT_NORMALIZATION_CONFIG = NORMALIZATION_CONFIG_V1;

/**
 * Target charset for n-gram counting — aligned with v1 editable scope.
 * Only these characters participate in unigram/bigram/trigram stats.
 */
export const CORPUS_TARGET_CHARSET_SET: ReadonlySet<string> =
  EDITABLE_CHARSET_SET;

/** Arabic/Persian character variant unification (documented policy). */
export const CHAR_VARIANT_MAP: Readonly<Record<string, string>> = {
  "\u064A": "\u06CC", // ي → ی
  "\u0649": "\u06CC", // ى → ی
  "\u0643": "\u06A9", // ك → ک
  "\u0629": "\u0647", // ة → ه
};

/** Zero-width characters removed during normalization (ZWNJ is preserved). */
export const REMOVED_ZERO_WIDTH_CHARS = new Set([
  "\u200B", // ZWSP
  "\u200D", // ZWJ
  "\uFEFF", // BOM
  "\u2060", // WORD JOINER
]);

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const LATIN_DIGITS = "0123456789";

/** Map Persian digits to Latin (index-aligned). */
export const PERSIAN_TO_LATIN_DIGIT: Readonly<Record<string, string>> =
  Object.fromEntries(
    [...PERSIAN_DIGITS].map((digit, index) => [
      digit,
      LATIN_DIGITS[index] ?? digit,
    ]),
  );

/** Map Latin digits to Persian (index-aligned). */
export const LATIN_TO_PERSIAN_DIGIT: Readonly<Record<string, string>> =
  Object.fromEntries(
    [...LATIN_DIGITS].map((digit, index) => [
      digit,
      PERSIAN_DIGITS[index] ?? digit,
    ]),
  );
