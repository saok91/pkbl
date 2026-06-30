import {
  DEFAULT_NORMALIZATION_CONFIG,
  LATIN_TO_PERSIAN_DIGIT,
  PERSIAN_TO_LATIN_DIGIT,
  REMOVED_ZERO_WIDTH_CHARS,
  type NormalizationConfig,
} from "./config";

export type NormalizeResult = {
  readonly text: string;
  readonly normalizedVersion: string;
};

const SPACE_LIKE = /[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/g;

/** Persian punctuation that should not be preceded by a space. */
const PUNCT_NO_SPACE_BEFORE = / ([،؛؟»])/g;

/** Persian punctuation that should not be followed by a space. */
const PUNCT_NO_SPACE_AFTER = /([«]) /g;

function normalizePunctuationSpacing(text: string): string {
  return text
    .replace(PUNCT_NO_SPACE_BEFORE, "$1")
    .replace(PUNCT_NO_SPACE_AFTER, "$1");
}

function unifyCharVariants(
  char: string,
  variantMap: NormalizationConfig["charVariantMap"],
): string {
  return variantMap[char] ?? char;
}

function unifyPunctVariants(
  char: string,
  punctMap: NormalizationConfig["punctVariantMap"],
): string {
  return punctMap[char] ?? char;
}

function normalizeDigit(
  char: string,
  digitPolicy: NormalizationConfig["digitPolicy"],
): string {
  if (digitPolicy === "latin") {
    return PERSIAN_TO_LATIN_DIGIT[char] ?? char;
  }
  if (digitPolicy === "persian") {
    return LATIN_TO_PERSIAN_DIGIT[char] ?? char;
  }
  return char;
}

function normalizeChar(
  char: string,
  config: NormalizationConfig,
): string | null {
  if (REMOVED_ZERO_WIDTH_CHARS.has(char)) {
    return null;
  }
  const unified = unifyCharVariants(char, config.charVariantMap);
  const punctuated = unifyPunctVariants(unified, config.punctVariantMap);
  return normalizeDigit(punctuated, config.digitPolicy);
}

/** Normalize Persian corpus text before n-gram extraction (E3-S1). */
export function normalizePersianText(
  input: string,
  config: NormalizationConfig = DEFAULT_NORMALIZATION_CONFIG,
): NormalizeResult {
  const chars: string[] = [];

  for (const char of input) {
    const normalized = normalizeChar(char, config);
    if (normalized !== null) {
      chars.push(normalized);
    }
  }

  const collapsed = chars.join("").replace(SPACE_LIKE, " ").trim();

  return {
    text: normalizePunctuationSpacing(collapsed),
    normalizedVersion: config.normalizedVersion,
  };
}
