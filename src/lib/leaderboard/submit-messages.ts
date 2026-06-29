import { toPersianDigits } from "@/lib/corpus/config";

import { MIN_LAYOUT_COMPLETENESS } from "./submit-rules";

export type SubmitResultView =
  | {
      readonly kind: "accepted";
      readonly reason: "new_best" | "first_entry";
      readonly rank: number;
      readonly totalScore: number;
    }
  | {
      readonly kind: "rejected";
      readonly reason: "duplicate" | "score_too_low" | "incomplete_layout";
      readonly totalScore: number;
      readonly currentBestScore: number | null;
    };

export type SubmitPreviewView = {
  readonly totalScore: number;
  readonly currentBestScore: number | null;
  readonly completenessScore: number;
};

export type SubmitMessageTone = "success" | "error" | "info";

export type SubmitMessage = {
  readonly title: string;
  readonly message: string;
  readonly tone: SubmitMessageTone;
};

function formatScore(value: number): string {
  return toPersianDigits(
    new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(
      Math.round(value),
    ),
  );
}

export function describeSubmitPreview(preview: SubmitPreviewView): SubmitMessage {
  if (preview.completenessScore < MIN_LAYOUT_COMPLETENESS) {
    return {
      tone: "error",
      title: "چیدمان ناقص",
      message: `پوشش charset ${formatScore(preview.completenessScore)}٪ است. برای ثبت، همهٔ کاراکترهای مجاز باید جایگذاری شوند.`,
    };
  }

  if (preview.currentBestScore === null) {
    return {
      tone: "info",
      title: "اولین ثبت ممکن",
      message: `هنوز چیدمانی برای این corpus ثبت نشده. امتیاز فعلی شما ${formatScore(preview.totalScore)} است.`,
    };
  }

  if (preview.totalScore > preview.currentBestScore) {
    return {
      tone: "success",
      title: "بهتر از رتبهٔ ۱",
      message: `امتیاز ${formatScore(preview.totalScore)} از بهترین ثبت‌شده (${formatScore(preview.currentBestScore)}) بالاتر است — ارزش submit دارد.`,
    };
  }

  return {
    tone: "info",
    title: "هنوز از رتبهٔ ۱ بهتر نیست",
    message: `امتیاز ${formatScore(preview.totalScore)} باید از ${formatScore(preview.currentBestScore)} بالاتر باشد تا ثبت شود.`,
  };
}

export function describeSubmitResult(result: SubmitResultView): SubmitMessage {
  if (result.kind === "accepted") {
    if (result.reason === "first_entry") {
      return {
        tone: "success",
        title: "اولین ثبت!",
        message: `چیدمان شما با امتیاز ${formatScore(result.totalScore)} به‌عنوان اولین ورودی در جدول امتیازات ثبت شد.`,
      };
    }

    return {
      tone: "success",
      title: "رکورد جدید!",
      message: `چیدمان شما با امتیاز ${formatScore(result.totalScore)} در رتبهٔ ${formatScore(result.rank)} ثبت شد.`,
    };
  }

  if (result.reason === "duplicate") {
    return {
      tone: "info",
      title: "چیدمان تکراری",
      message:
        "این چیدمان قبلاً برای این corpus ثبت شده است. برای ثبت مجدد، چیدمان را تغییر دهید.",
    };
  }

  if (result.reason === "incomplete_layout") {
    return {
      tone: "error",
      title: "چیدمان ناقص",
      message:
        "همهٔ کاراکترهای charset باید جایگذاری شوند قبل از ثبت در جدول امتیازات.",
    };
  }

  const bestLabel =
    result.currentBestScore !== null
      ? formatScore(result.currentBestScore)
      : "—";

  return {
    tone: "error",
    title: "امتیاز کافی نیست",
    message: `امتیاز فعلی (${formatScore(result.totalScore)}) از بهترین ثبت‌شده (${bestLabel}) بالاتر نیست. چیدمان را بهبود دهید و دوباره تلاش کنید.`,
  };
}
