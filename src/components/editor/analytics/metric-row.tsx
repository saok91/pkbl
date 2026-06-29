type MetricRowProps = {
  label: string;
  value: string;
  muted?: boolean;
};

export function MetricRow({ label, value, muted = false }: MetricRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
      <span className={muted ? "text-slate-500" : "text-slate-300"}>
        {label}
      </span>
      <span
        className={`tabular-nums ${muted ? "text-slate-500" : "font-medium text-slate-100"}`}
      >
        {value}
      </span>
    </div>
  );
}
