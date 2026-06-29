"use client";

type RankingHintProps = {
  hint: string | null;
};

export function RankingHint({ hint }: RankingHintProps) {
  if (!hint) {
    return null;
  }

  return <span>{hint}</span>;
}
