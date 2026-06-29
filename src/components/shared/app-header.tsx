import type { ReactNode } from "react";

import { EDITOR_MAX_WIDTH_CLASS } from "@/components/editor/constants";

import { AppNav } from "./app-nav";

type AppHeaderProps = {
  readonly center?: ReactNode;
};

function KeyboardLogoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 text-primary"
      aria-hidden="true"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
    </svg>
  );
}

export function AppHeader({ center }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/96 backdrop-blur-md">
      <div
        className={`mx-auto flex h-12 ${EDITOR_MAX_WIDTH_CLASS} items-center gap-3 px-4`}
      >
        <div className="mr-auto flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
            <KeyboardLogoIcon />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider text-text-secondary">
            PKBL
          </span>
          <span className="hidden text-[11px] text-border-strong sm:inline">
            — آزمایشگاه چیدمان فارسی
          </span>
        </div>

        {center ? (
          <div className="flex flex-1 justify-center">{center}</div>
        ) : null}

        <AppNav />
      </div>
    </header>
  );
}
