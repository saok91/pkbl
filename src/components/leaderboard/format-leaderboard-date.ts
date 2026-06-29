import { toPersianDigits } from "@/lib/corpus/config";

const faDateTime = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatLeaderboardDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return toPersianDigits(faDateTime.format(date));
}
