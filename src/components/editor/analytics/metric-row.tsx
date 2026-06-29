import type { ReactNode } from "react";

type MetricRowProps = {
  label: string;
  value: string;
  muted?: boolean;
  info?: ReactNode;
};

export function MetricRow({ label, value, muted = false, info }: MetricRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
      <span
        className={`inline-flex items-center gap-1.5 ${muted ? "text-slate-500" : "text-slate-300"}`}
      >
        {label}
        {info}
      </span>
      <span
        className={`tabular-nums ${muted ? "text-slate-500" : "font-medium text-slate-100"}`}
      >
        {value}
      </span>
    </div>
  );
}
