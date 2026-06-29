export type GlossaryEntry = {
  readonly termFa: string;
  readonly definitionFa: string;
  readonly exampleFa?: string;
};

export const METRIC_GLOSSARY: readonly GlossaryEntry[] = [
  {
    termFa: "n-gram",
    definitionFa:
      "الگوی چند حرف پشت‌سرهم در متن — پایهٔ محاسبهٔ هزینهٔ تایپ.",
  },
  {
    termFa: "یونی‌گرام",
    definitionFa: "تک‌حرف و فراوانی آن در corpus.",
    exampleFa: "«ا» پرتکرارترین حرف فارسی است.",
  },
  {
    termFa: "بی‌گرام",
    definitionFa: "دو حرف پشت‌سرهم در متن.",
    exampleFa: "‹سل› در ‹سلام› یک بی‌گرام است.",
  },
  {
    termFa: "تری‌گرام",
    definitionFa: "سه حرف پشت‌سرهم در متن.",
    exampleFa: "‹سلا› در ‹سلام› یک تری‌گرام است.",
  },
  {
    termFa: "ردیف home",
    definitionFa:
      "ردیف وسط صفحه‌کلید (جای انگشتان در حالت استراحت) — راحت‌ترین ردیف.",
  },
  {
    termFa: "بار انگشت",
    definitionFa: "سهم هر انگشت از کل تایپ — توزیع نامتوازن خسته‌کننده است.",
  },
  {
    termFa: "تعادل دست",
    definitionFa: "توزیع بار بین دست چپ و راست — ۵۰/۵۰ ایده‌آل است.",
  },
  {
    termFa: "بی‌گرام هم‌انگشتی",
    definitionFa: "دو حرف پشت‌سرهم که با یک انگشت تایپ می‌شوند — کند و خسته‌کننده.",
  },
  {
    termFa: "بی‌گرام هم‌دست",
    definitionFa: "دو حرف پشت‌سرهم که با یک دست تایپ می‌شوند.",
  },
  {
    termFa: "تعویض دست",
    definitionFa:
      "دو حرف پشت‌سرهم که با دست‌های مختلف تایپ می‌شوند — معمولاً بهتر است.",
  },
  {
    termFa: "کلیدهای ضعیف",
    definitionFa: "جایگاه‌های دشوار مثل گوشه‌ها یا انگشت کوچک.",
  },
  {
    termFa: "تعویض ردیف",
    definitionFa: "جابه‌جایی انگشت بین ردیف‌های بالا، وسط و پایین.",
  },
  {
    termFa: "نقطه پرهزینه",
    definitionFa:
      "حرفی که تایپ آن سخت یا پرهزینه است — معمولاً جایگاه نامناسبی دارد.",
  },
  {
    termFa: "هزینه خام یونی‌گرام",
    definitionFa: "مجموع هزینهٔ تایپ تک‌حرف‌ها قبل از نرمال‌سازی — فقط برای متخصص.",
  },
  {
    termFa: "هزینه خام بی‌گرام",
    definitionFa: "مجموع هزینهٔ توالی‌های دوحرفی قبل از نرمال‌سازی — فقط برای متخصص.",
  },
  {
    termFa: "هزینه خام تری‌گرام",
    definitionFa: "مجموع هزینهٔ توالی‌های سه‌حرفی قبل از نرمال‌سازی — فقط برای متخصص.",
  },
] as const;

const GLOSSARY_ALIASES: Readonly<Record<string, string>> = {
  "کلید ضعیف": "کلیدهای ضعیف",
};

export function findGlossaryEntry(termFa: string): GlossaryEntry | undefined {
  const normalized = GLOSSARY_ALIASES[termFa] ?? termFa;
  return METRIC_GLOSSARY.find((entry) => entry.termFa === normalized);
}
