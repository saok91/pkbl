"use client";

import { useEffect, useState } from "react";

import { formatSignedScore } from "../format-analytics";

const FADE_MS = 2000;

type ScoreDeltaBadgeProps = {
  delta: number | null;
  visible: boolean;
};

export function ScoreDeltaBadge({ delta, visible }: ScoreDeltaBadgeProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible || delta === null) {
      setFading(false);
      return;
    }

    setFading(false);
    const fadeTimer = window.setTimeout(() => {
      setFading(true);
    }, FADE_MS - 300);

    return () => {
      window.clearTimeout(fadeTimer);
    };
  }, [visible, delta]);

  if (!visible || delta === null || delta === 0) {
    return null;
  }

  const isPositive = delta > 0;

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums transition-opacity duration-300 ${
        isPositive
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-red-500/20 text-red-300"
      } ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {formatSignedScore(delta)}
    </span>
  );
}
