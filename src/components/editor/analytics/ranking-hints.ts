import { RANKING_HINT_THRESHOLDS } from "@/lib/scoring/insights/thresholds";
import { EDITABLE_CHARSET } from "@/lib/layout/editable-scope";
import { getUnassignedChars } from "@/lib/layout/analysis";
import type { Layout } from "@/lib/layout/types";
import type { ScoreBreakdown } from "@/lib/scoring/types";

export { RANKING_HINT_THRESHOLDS } from "@/lib/scoring/insights/thresholds";

export type RankingHintInput = {
  readonly layout: Layout;
  readonly breakdown: ScoreBreakdown;
};

export function hasUnassignedEditableChars(layout: Layout): boolean {
  return getUnassignedChars(layout, EDITABLE_CHARSET).length > 0;
}

/**
 * Template-based ranking hint (E6-S4).
 * Returns the first matching rule by priority.
 */
export function deriveRankingHint(input: RankingHintInput): string {
  const { layout, breakdown } = input;
  const t = RANKING_HINT_THRESHOLDS;

  if (
    hasUnassignedEditableChars(layout) &&
    breakdown.unigramCost >= t.unigramCostWithMissing
  ) {
    return "برخی حروف پرکاربرد هنوز جایگاه ندارند — اول آن‌ها را بچینید.";
  }

  if (breakdown.weakKeyPenalty > t.weakKeyPenalty) {
    return "بار روی کلیدهای دشوار (مثل انگشت کوچک) بالاست.";
  }

  if (breakdown.sameFingerBigrams > t.sameFingerBigrams) {
    return "توالی‌های هم‌انگشتی زیاد است — حروف پرتکرار را از هم جدا کنید.";
  }

  if (breakdown.homeRowUsage < t.homeRowUsageMin) {
    return "استفاده از ردیف home کم است — حروف پرتکرار را به مرکز ببرید.";
  }

  if (breakdown.handBalance < t.handBalanceMin) {
    return "بار بین دو دست نامتوازن است.";
  }

  if (breakdown.rowSwitching > t.rowSwitching) {
    return "جابه‌جایی بین ردیف‌ها زیاد است.";
  }

  return "چیدمان متعادل است — برای بهبود، hotspots را بررسی کنید.";
}
