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
        className={`inline-flex items-center gap-1.5 ${muted ? "text-text-faint" : "text-text-dim"}`}
      >
        {label}
        {info}
      </span>
      <span
        className={`tabular-nums ${muted ? "text-text-faint" : "font-medium text-text-secondary"}`}
      >
        {value}
      </span>
    </div>
  );
}
