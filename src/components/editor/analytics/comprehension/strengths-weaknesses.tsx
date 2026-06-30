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
      <p className="text-text-dim text-[11px]">
        {COMPREHENSION_SECTION_FA.incompleteLayout}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <section aria-label={COMPREHENSION_SECTION_FA.strengths}>
        {strengths.length > 0 ? (
          <ul className="space-y-1.5">
            {strengths.map((insight) => (
              <InsightCard key={insight.metric} insight={insight} />
            ))}
          </ul>
        ) : (
          <p className="text-text-faint text-[11px]">
            {COMPREHENSION_SECTION_FA.noStrengths}
          </p>
        )}
      </section>

      <section aria-label={COMPREHENSION_SECTION_FA.weaknesses}>
        {weaknesses.length > 0 ? (
          <ul className="space-y-1.5">
            {weaknesses.map((insight) => (
              <InsightCard key={insight.metric} insight={insight} />
            ))}
          </ul>
        ) : (
          <p className="text-text-faint text-[11px]">
            {COMPREHENSION_SECTION_FA.noWeaknesses}
          </p>
        )}
      </section>
    </div>
  );
}
