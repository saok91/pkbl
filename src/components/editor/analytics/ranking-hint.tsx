"use client";

type RankingHintProps = {
  hint: string | null;
};

export function RankingHint({ hint }: RankingHintProps) {
  if (!hint) {
    return null;
  }

  return <p className="text-sm leading-relaxed text-slate-400">{hint}</p>;
}
