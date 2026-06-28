/** Display order for the character palette — grouped for quick lookup. */

export type PaletteSection = {
  id: string;
  label: string;
  chars: string;
};

/** Canonical section order; chars not listed fall into «سایر». */
const PALETTE_SECTION_DEFS: Omit<PaletteSection, "chars">[] = [
  { id: "letters", label: "حروف فارسی" },
  { id: "shift-letters", label: "حروف شیفت" },
  { id: "digits", label: "اعداد" },
  { id: "punctuation", label: "نشانه‌گذاری" },
  { id: "spacing", label: "فاصله و جداکننده" },
  { id: "diacritics", label: "اعراب" },
  { id: "symbols", label: "نمادها" },
];

const SECTION_CHARS: Record<string, string> = {
  letters: "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی",
  "shift-letters": "آئؤءةيك",
  digits: "۰۱۲۳۴۵۶۷۸۹",
  punctuation: "«»؛؟،",
  spacing: "\u200c\u200d ",
  diacritics: "ًٌٍَُِّْٰٴ",
  symbols: "!٬٫﷼٪×*()+-=ـ[]{}\\|:;<>./",
};

function charsInCharset(template: string, charsetSet: Set<string>): string {
  const seen = new Set<string>();
  let result = "";
  for (const char of template) {
    if (charsetSet.has(char) && !seen.has(char)) {
      seen.add(char);
      result += char;
    }
  }
  return result;
}

/**
 * Build palette sections from the full assignable charset.
 * Preserves logical grouping; unknown chars go to «سایر».
 */
export function buildPaletteSections(charset: string): PaletteSection[] {
  const charsetSet = new Set(charset);
  const used = new Set<string>();
  const sections: PaletteSection[] = [];

  for (const def of PALETTE_SECTION_DEFS) {
    const template = SECTION_CHARS[def.id] ?? "";
    const chars = charsInCharset(template, charsetSet);
    for (const char of chars) {
      used.add(char);
    }
    if (chars.length > 0) {
      sections.push({ ...def, chars });
    }
  }

  const remaining = [...charsetSet].filter((char) => !used.has(char));
  if (remaining.length > 0) {
    sections.push({
      id: "other",
      label: "سایر",
      chars: remaining.join(""),
    });
  }

  return sections;
}

/** Flat palette order (all sections concatenated). */
export function flattenPaletteSections(sections: PaletteSection[]): string {
  return sections.map((section) => section.chars).join("");
}
