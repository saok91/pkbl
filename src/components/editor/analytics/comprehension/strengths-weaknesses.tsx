import type { Insight } from "@/lib/scoring/insights";

import { COMPREHENSION_SECTION_FA } from "./comprehension-labels";
import { InsightCard } from "./insight-card";

type StrengthsWeaknessesProps = {
  strengths: readonly Insight[];
  weaknesses: readonly Insight[];
  incomplete: boolean;
};

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
  incomplete,
}: StrengthsWeaknessesProps) {
  if (incomplete) {
    return (
      <p className="text-sm text-amber-300">
        {COMPREHENSION_SECTION_FA.incompleteLayout}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <section aria-label={COMPREHENSION_SECTION_FA.strengths}>
        <h3 className="mb-2 text-xs font-medium tracking-wide text-emerald-400/90 uppercase">
          {COMPREHENSION_SECTION_FA.strengths}
        </h3>
        {strengths.length > 0 ? (
          <ul className="space-y-2">
            {strengths.map((insight) => (
              <InsightCard key={insight.metric} insight={insight} />
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500">
            {COMPREHENSION_SECTION_FA.noStrengths}
          </p>
        )}
      </section>

      <section aria-label={COMPREHENSION_SECTION_FA.weaknesses}>
        <h3 className="mb-2 text-xs font-medium tracking-wide text-amber-400/90 uppercase">
          {COMPREHENSION_SECTION_FA.weaknesses}
        </h3>
        {weaknesses.length > 0 ? (
          <ul className="space-y-2">
            {weaknesses.map((insight) => (
              <InsightCard key={insight.metric} insight={insight} />
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500">
            {COMPREHENSION_SECTION_FA.noWeaknesses}
          </p>
        )}
      </section>
    </div>
  );
}
