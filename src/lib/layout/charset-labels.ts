import { toPersianDigits } from "@/lib/corpus/config";

type CharLabel = {
  short: string;
  description: string;
};

/** Human-readable labels for invisible or ambiguous assignable characters. */
const CHAR_LABELS: Record<string, CharLabel> = {
  "\u200c": {
    short: "نیم‌فاصله",
    description: "نیم‌فاصله (U+200C) — جداکنندهٔ بدون عرض، مثل «می‌رود»",
  },
  "\u200d": {
    short: "اتصال",
    description: "اتصال مجازی (U+200D) — برای چسباندن حروف در ترکیب‌ها",
  },
  " ": {
    short: "فاصله",
    description: "فاصلهٔ معمولی (Space)",
  },
};

export function getCharDisplayLabel(char: string): string {
  return toPersianDigits(CHAR_LABELS[char]?.short ?? char);
}

export function getCharDescription(char: string): string | undefined {
  return CHAR_LABELS[char]?.description;
}

export function hasCustomCharLabel(char: string): boolean {
  return char in CHAR_LABELS;
}
