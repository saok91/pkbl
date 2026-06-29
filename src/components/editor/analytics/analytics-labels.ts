import type { Finger, Hand } from "@/lib/ergonomics/types";

export const FINGER_LABEL_FA: Record<Finger, string> = {
  thumb: "شست",
  index: "اشاره",
  middle: "وسطی",
  ring: "حلقه",
  pinky: "کوچک",
};

export const HAND_LABEL_FA: Record<Hand, string> = {
  left: "چپ",
  right: "راست",
};

export const BREAKDOWN_SECTION_FA = {
  ngram: "امتیاز n-gram",
  ergonomics: "ارگونومی",
  penalties: "جریمه‌ها",
} as const;

export const ANALYTICS_PANEL_SECTION_FA = {
  breakdown: "جزئیات امتیاز",
  hotspots: "نقاط پرهزینه",
} as const;

/** Caption for aggregate finger load (both hands combined). */
export const FINGER_LOAD_CAPTION_FA = `میانگین هر دو دست (${HAND_LABEL_FA.left} و ${HAND_LABEL_FA.right})`;

export const BREAKDOWN_FIELD_FA = {
  unigramScore: "یونی‌گرام",
  bigramScore: "بی‌گرام",
  trigramScore: "تری‌گرام",
  homeRowUsage: "ردیف home",
  handBalance: "تعادل دست",
  fingerLoad: "بار انگشت",
  sameFingerBigrams: "بی‌گرام هم‌انگشتی",
  sameHandBigrams: "بی‌گرام هم‌دست",
  handAlternation: "تعویض دست",
  rowSwitching: "تعویض ردیف",
  weakKeyPenalty: "کلیدهای ضعیف",
  unigramCost: "هزینه خام یونی‌گرام",
} as const;
