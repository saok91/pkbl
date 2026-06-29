"use client";

import { useMemo, useRef, useState } from "react";

import { formatScore } from "@/components/editor/analytics/format-analytics";
import { useFocusTrap } from "@/components/editor/use-focus-trap";
import {
  CLIENT_CORPUS_PRESETS,
  type CorpusPresetId,
} from "@/lib/corpus/client-presets";
import { getCompletenessScore } from "@/lib/layout/analysis";
import type { Layout } from "@/lib/layout/types";
import { layoutToWire } from "@/lib/layout/wire";
import {
  describeSubmitPreview,
  describeSubmitResult,
  type SubmitResultView,
} from "@/lib/leaderboard/submit-messages";
import { api } from "~/trpc/react";

type SubmitLayoutDialogProps = {
  readonly isOpen: boolean;
  readonly layout: Layout;
  readonly corpusPresetId: CorpusPresetId;
  readonly totalScore: number | null;
  readonly isScoreStale: boolean;
  readonly onClose: () => void;
};

const TONE_CLASSES = {
  success: "border-emerald-600/50 bg-emerald-950/40 text-emerald-100",
  error: "border-rose-600/50 bg-rose-950/40 text-rose-100",
  info: "border-sky-600/50 bg-sky-950/40 text-sky-100",
} as const;

export function SubmitLayoutDialog({
  isOpen,
  layout,
  corpusPresetId,
  totalScore,
  isScoreStale,
  onClose,
}: SubmitLayoutDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [alias, setAlias] = useState("");
  const [resultView, setResultView] = useState<SubmitResultView | null>(null);

  const utils = api.useUtils();

  const statusQuery = api.leaderboard.status.useQuery(
    { corpusPresetId },
    { enabled: isOpen && resultView === null },
  );

  const completenessScore = useMemo(
    () => getCompletenessScore(layout),
    [layout],
  );

  const submitMutation = api.leaderboard.submit.useMutation({
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        return;
      }

      void utils.leaderboard.list.invalidate();
      void utils.leaderboard.status.invalidate({ corpusPresetId });

      const data = response.data;

      if (data.accepted) {
        setResultView({
          kind: "accepted",
          reason:
            data.reason === "new_best" ? "new_best" : "first_entry",
          rank: data.rank,
          totalScore: data.totalScore,
        });
        return;
      }

      setResultView({
        kind: "rejected",
        reason:
          data.reason === "duplicate"
            ? "duplicate"
            : data.reason === "incomplete_layout"
              ? "incomplete_layout"
              : "score_too_low",
        totalScore: data.totalScore,
        currentBestScore: data.currentBestScore,
      });
    },
  });

  useFocusTrap(dialogRef, isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  const presetLabel =
    CLIENT_CORPUS_PRESETS.find((preset) => preset.id === corpusPresetId)
      ?.nameFa ?? corpusPresetId;

  const currentBestScore =
    statusQuery.data?.success && statusQuery.data.data
      ? statusQuery.data.data.currentBestScore
      : null;

  const previewMessage =
    resultView === null && totalScore !== null && !isScoreStale
      ? describeSubmitPreview({
          totalScore,
          currentBestScore,
          completenessScore,
        })
      : null;

  const canSubmit =
    totalScore !== null &&
    !isScoreStale &&
    !submitMutation.isPending &&
    resultView === null &&
    previewMessage?.tone !== "error";

  const submitMessage = resultView ? describeSubmitResult(resultView) : null;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    const trimmedAlias = alias.trim();
    submitMutation.mutate({
      layout: layoutToWire(layout),
      corpusPresetId,
      ...(trimmedAlias.length > 0 ? { alias: trimmedAlias } : {}),
    });
  };

  const handleClose = () => {
    if (submitMutation.isPending) {
      return;
    }
    setAlias("");
    setResultView(null);
    submitMutation.reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-layout-title"
        className="w-full max-w-lg rounded-xl border border-slate-600 bg-slate-800 p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="submit-layout-title"
          className="text-base font-semibold text-slate-100"
        >
          ثبت در جدول امتیازات
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          چیدمان فعلی بدون نیاز به ورود ثبت می‌شود. بالاتر = بهتر.
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">corpus</dt>
            <dd className="text-slate-200">{presetLabel}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">امتیاز</dt>
            <dd className="font-semibold text-white tabular-nums">
              {totalScore !== null ? formatScore(totalScore) : "—"}
              {isScoreStale ? (
                <span className="mr-2 text-xs font-normal text-slate-400">
                  (در حال محاسبه…)
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">پوشش charset</dt>
            <dd className="text-slate-200 tabular-nums">
              {formatScore(completenessScore)}٪
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">بهترین ثبت‌شده</dt>
            <dd className="text-slate-200 tabular-nums">
              {statusQuery.isLoading
                ? "…"
                : currentBestScore !== null
                  ? formatScore(currentBestScore)
                  : "—"}
            </dd>
          </div>
        </dl>

        {previewMessage ? (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${TONE_CLASSES[previewMessage.tone]}`}
            role="status"
          >
            <p className="font-medium">{previewMessage.title}</p>
            <p className="mt-1">{previewMessage.message}</p>
          </div>
        ) : null}

        {resultView === null ? (
          <div className="mt-4">
            <label
              htmlFor="submit-alias"
              className="mb-1.5 block text-sm text-slate-300"
            >
              نام نمایشی (اختیاری)
            </label>
            <input
              id="submit-alias"
              type="text"
              maxLength={64}
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              placeholder="مثلاً چیدمان من"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        ) : null}

        {submitMutation.error ? (
          <p className="mt-4 text-sm text-rose-300" role="alert">
            {submitMutation.error.message}
          </p>
        ) : null}

        {submitMessage ? (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${TONE_CLASSES[submitMessage.tone]}`}
            role="status"
          >
            <p className="font-medium">{submitMessage.title}</p>
            <p className="mt-1">{submitMessage.message}</p>
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitMutation.isPending}
            className="rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-200 enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resultView ? "بستن" : "انصراف"}
          </button>
          {resultView === null ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-lg border border-sky-600/60 bg-sky-950/60 px-4 py-2 text-sm text-sky-100 enabled:hover:bg-sky-900/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitMutation.isPending ? "در حال ثبت…" : "ثبت چیدمان"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
