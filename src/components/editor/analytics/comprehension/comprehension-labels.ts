import type { MetricQuality } from "@/lib/scoring/insights";

export { VERDICT_LABEL_FA as VERDICT_BAND_LABEL_FA } from "@/lib/scoring/insights";

export const METRIC_QUALITY_LABEL_FA: Record<MetricQuality, string> = {
  good: "خوب",
  ok: "متوسط",
  poor: "ضعیف",
};

export const COMPREHENSION_SECTION_FA = {
  strengths: "قوت‌ها",
  weaknesses: "ضعف‌ها",
  fingerLoad: "بار انگشتان",
  handBalance: "تعادل دست",
  metricsHelp: "راهنمای امتیاز",
  incompleteLayout: "اول چیدمان را کامل کنید",
  noStrengths: "قوت مشخصی یافت نشد — hotspots را بررسی کنید.",
  noWeaknesses: "ضعف مشخصی یافت نشد.",
} as const;

export const VIEW_MODE_FA = {
  simple: "نمای ساده",
  expert: "نمای متخصص",
} as const;
