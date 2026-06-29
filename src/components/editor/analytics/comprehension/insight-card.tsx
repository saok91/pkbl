import type { Insight } from "@/lib/scoring/insights";

type InsightCardProps = {
  insight: Insight;
};

const ACCENT_CLASS = {
  strength: "border-s-emerald-500/60",
  weakness: "border-s-amber-500/60",
} as const;

const DOT_CLASS = {
  strength: "bg-emerald-400",
  weakness: "bg-amber-400",
} as const;

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <li
      className={`rounded-lg border border-slate-800 border-s-2 bg-slate-950/40 px-3 py-2.5 ${ACCENT_CLASS[insight.kind]}`}
    >
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT_CLASS[insight.kind]}`}
        />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-slate-200">
            {insight.titleFa}
          </p>
          <p className="text-xs leading-relaxed text-slate-400">
            {insight.adviceFa}
          </p>
        </div>
      </div>
    </li>
  );
}
