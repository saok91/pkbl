import type { ReactNode } from "react";

import { EDITOR_MAX_WIDTH_CLASS } from "@/components/editor/constants";

import { AppNav } from "./app-nav";

type PageShellProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly eyebrow?: string;
  readonly children: ReactNode;
};

export function PageShell({
  title,
  subtitle,
  eyebrow = "Persian Keyboard Layout Lab",
  children,
}: PageShellProps) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div
          className={`mx-auto flex ${EDITOR_MAX_WIDTH_CLASS} flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div>
            <p className="text-xs tracking-widest text-slate-400 uppercase">
              {eyebrow}
            </p>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          <AppNav />
        </div>
      </header>

      <main className={`mx-auto ${EDITOR_MAX_WIDTH_CLASS} px-4 py-6`}>
        {children}
      </main>
    </div>
  );
}
