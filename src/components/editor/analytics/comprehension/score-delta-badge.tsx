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
      className={`rounded-lg border px-2.5 py-1 font-mono text-sm font-bold tabular-nums transition-opacity duration-300 ${
        isPositive
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-destructive/25 bg-destructive/10 text-destructive"
      } ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {formatSignedScore(delta)}
    </span>
  );
}
