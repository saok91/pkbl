import { toPersianDigits } from "@/lib/corpus/config";

const faInteger = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
});

const faDecimal = new Intl.NumberFormat("fa-IR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const faPercent = new Intl.NumberFormat("fa-IR", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatNumber(formatter: Intl.NumberFormat, value: number): string {
  return toPersianDigits(formatter.format(value));
}

export function formatScore(value: number): string {
  return formatNumber(faInteger, Math.round(value));
}

export function formatSignedScore(value: number): string {
  const rounded = Math.round(value);
  const formatted = formatNumber(faInteger, Math.abs(rounded));
  if (rounded > 0) {
    return `+${formatted}`;
  }
  if (rounded < 0) {
    return `−${formatted}`;
  }
  return formatted;
}

export function formatPercent(value: number): string {
  return formatNumber(faPercent, value / 100);
}

export function formatRatio(value: number): string {
  return formatNumber(faDecimal, value);
}

export function formatCount(value: number): string {
  return formatNumber(faInteger, Math.round(value));
}

export function formatCost(value: number): string {
  return formatNumber(faDecimal, value);
}

export { toPersianDigits };
