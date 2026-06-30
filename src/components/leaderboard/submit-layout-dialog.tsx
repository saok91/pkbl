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
  success: "border-primary/30 bg-primary/10 text-primary",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-accent/30 bg-accent/10 text-accent",
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
          reason: data.reason === "new_best" ? "new_best" : "first_entry",
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
        className="border-border-strong bg-popover w-full max-w-lg rounded-2xl border p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="submit-layout-title"
          className="text-text-secondary text-base font-semibold"
        >
          ثبت در جدول امتیازات
        </h2>
        <p className="text-text-dim mt-2 text-sm">
          چیدمان فعلی بدون نیاز به ورود ثبت می‌شود. بالاتر = بهتر.
        </p>

        <dl className="border-border-strong bg-surface-panel mt-4 grid grid-cols-2 gap-3 rounded-xl border p-3 text-sm">
          <div>
            <dt className="text-text-faint text-xs">corpus</dt>
            <dd className="text-text-secondary">{presetLabel}</dd>
          </div>
          <div>
            <dt className="text-text-faint text-xs">امتیاز</dt>
            <dd className="text-primary font-semibold tabular-nums">
              {totalScore !== null ? formatScore(totalScore) : "—"}
              {isScoreStale ? (
                <span className="text-text-dim mr-2 text-xs font-normal">
                  (در حال محاسبه…)
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-text-faint text-xs">پوشش charset</dt>
            <dd className="text-text-secondary tabular-nums">
              {formatScore(completenessScore)}٪
            </dd>
          </div>
          <div>
            <dt className="text-text-faint text-xs">بهترین ثبت‌شده</dt>
            <dd className="text-text-secondary tabular-nums">
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
              className="text-text-dim mb-1.5 block text-sm"
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
              className="border-border-strong bg-surface-panel text-text-secondary placeholder:text-text-faint focus:border-primary/50 focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
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
            className="border-border-strong bg-surface-panel text-text-secondary rounded-lg border px-4 py-2 text-sm enabled:hover:bg-[#0C1E38] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resultView ? "بستن" : "انصراف"}
          </button>
          {resultView === null ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-primary text-primary-foreground enabled:hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitMutation.isPending ? "در حال ثبت…" : "ثبت چیدمان"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
