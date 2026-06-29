import type { Insight } from "@/lib/scoring/insights";

type InsightCardProps = {
  insight: Insight;
};

export function InsightCard({ insight }: InsightCardProps) {
  const isStrength = insight.kind === "strength";

  return (
    <li
      className={`flex gap-2 rounded-lg border p-2 ${
        isStrength
          ? "border-primary/15 bg-primary/6"
          : "border-destructive/15 bg-destructive/6"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 shrink-0 text-[12px] ${
          isStrength ? "text-primary" : "text-destructive"
        }`}
      >
        {isStrength ? "✓" : "!"}
      </span>
      <div className="min-w-0">
        <p
          className={`text-[11px] font-medium ${
            isStrength ? "text-primary" : "text-destructive"
          }`}
        >
          {insight.titleFa}
        </p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-text-dim">
          {insight.adviceFa}
        </p>
      </div>
    </li>
  );
}
