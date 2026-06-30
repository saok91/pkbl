import { VERDICT_LABEL_FA } from "./labels";
import { VERDICT_BANDS_V1 } from "./metric-bands";
import type { VerdictBand, VerdictResult } from "./types";

export function deriveVerdictBand(ratioToBaseline: number): VerdictBand {
  if (ratioToBaseline >= VERDICT_BANDS_V1.goodMinRatio) {
    return "good";
  }
  if (ratioToBaseline >= VERDICT_BANDS_V1.okMinRatio) {
    return "ok";
  }
  return "poor";
}

export function deriveVerdict(
  total: number,
  baselineTotal: number,
): VerdictResult {
  const ratioToBaseline = baselineTotal > 0 ? total / baselineTotal : 1;
  const band = deriveVerdictBand(ratioToBaseline);

  return {
    band,
    labelFa: VERDICT_LABEL_FA[band],
    total,
    baselineTotal,
    ratioToBaseline,
  };
}

export { VERDICT_LABEL_FA };
