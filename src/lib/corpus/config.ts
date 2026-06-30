import { EDITABLE_CHARSET_SET } from "@/lib/layout/editable-scope";

/** How to normalize digit variants during corpus preprocessing. */
export type DigitPolicy = "latin" | "persian" | "preserve";

/** Versioned Persian text normalization policy (E3-S1, E16-S1). */
export type NormalizationConfig = {
  readonly version: number;
  /** Stable string embedded in NgramStats for reproducibility. */
  readonly normalizedVersion: string;
  readonly digitPolicy: DigitPolicy;
  readonly charVariantMap: Readonly<Record<string, string>>;
  readonly punctVariantMap: Readonly<Record<string, string>>;
};

/** Arabic/Persian character variant unification — v1 (includes ى→ی and ة→ه). */
export const CHAR_VARIANT_MAP_V1: Readonly<Record<string, string>> = {
  "\u064A": "\u06CC", // ي → ی
  "\u0649": "\u06CC", // ى → ی
  "\u0643": "\u06A9", // ك → ک
  "\u0629": "\u0647", // ة → ه
};

/** Arabic/Persian character variant unification — v2 (only ي→ی and ك→ک). */
export const CHAR_VARIANT_MAP_V2: Readonly<Record<string, string>> = {
  "\u064A": "\u06CC", // ي → ی
  "\u0643": "\u06A9", // ك → ک
};

/** @deprecated Use `CHAR_VARIANT_MAP_V1` or config.charVariantMap. */
export const CHAR_VARIANT_MAP = CHAR_VARIANT_MAP_V1;

/** No punctuation canonicalization in v1. */
export const PUNCT_VARIANT_MAP_V1: Readonly<Record<string, string>> = {};

/**
 * Latin punctuation → Persian keyboard forms (E16-S1).
 * Canonicalizes corpus punctuation to match standard layout charset.
 */
export const PUNCT_VARIANT_MAP_V2: Readonly<Record<string, string>> = {
  ",": "\u060C", // , → ،
  ";": "\u061B", // ; → ؛
  "?": "\u061F", // ? → ؟
};

/** @deprecated Use `PUNCT_VARIANT_MAP_V1`/`PUNCT_VARIANT_MAP_V2` or config.punctVariantMap. */
export const PUNCT_VARIANT_MAP = PUNCT_VARIANT_MAP_V1;

export const NORMALIZATION_CONFIG_V1: NormalizationConfig = {
  version: 1,
  normalizedVersion: "fa-normalize-v1",
  digitPolicy: "latin",
  charVariantMap: CHAR_VARIANT_MAP_V1,
  punctVariantMap: PUNCT_VARIANT_MAP_V1,
};

export const NORMALIZATION_CONFIG_V2: NormalizationConfig = {
  version: 2,
  normalizedVersion: "fa-normalize-v2",
  digitPolicy: "persian",
  charVariantMap: CHAR_VARIANT_MAP_V2,
  punctVariantMap: PUNCT_VARIANT_MAP_V2,
};

/** Default normalization config (v1 until corpus artifacts are rebuilt in E16-S2). */
export const DEFAULT_NORMALIZATION_CONFIG = NORMALIZATION_CONFIG_V1;

/**
 * Target charset for n-gram counting — aligned with v1 editable scope.
 * Only these characters participate in unigram/bigram/trigram stats.
 */
export const CORPUS_TARGET_CHARSET_SET: ReadonlySet<string> =
  EDITABLE_CHARSET_SET;

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

/** Convert Latin digits in display text to Persian (۰–۹). */
export function toPersianDigits(text: string): string {
  return [...text].map((char) => LATIN_TO_PERSIAN_DIGIT[char] ?? char).join("");
}
