"use client";

type DraftSaveIndicatorProps = {
  isSaving: boolean;
  lastSavedAt: string | null;
  isHydrated: boolean;
  saveError: string | null;
};

function formatSavedTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DraftSaveIndicator({
  isSaving,
  lastSavedAt,
  isHydrated,
  saveError,
}: DraftSaveIndicatorProps) {
  if (!isHydrated) {
    return (
      <span
        className="text-text-faint font-mono text-[10px]"
        aria-live="polite"
      >
        در حال بارگذاری پیش‌نویس…
      </span>
    );
  }

  if (saveError) {
    return (
      <span
        className="text-destructive/70 font-mono text-[10px]"
        aria-live="polite"
        role="alert"
      >
        {saveError}
      </span>
    );
  }

  if (isSaving) {
    return (
      <span
        className="text-text-faint font-mono text-[10px]"
        aria-live="polite"
      >
        در حال ذخیره…
      </span>
    );
  }

  if (!lastSavedAt) {
    return null;
  }

  const savedTime = formatSavedTime(lastSavedAt);

  return (
    <span className="text-text-faint font-mono text-[10px]" aria-live="polite">
      {savedTime ? `پیش‌نویس ذخیره شد · ${savedTime}` : "پیش‌نویس ذخیره شد"}
    </span>
  );
}
