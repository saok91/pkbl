import type { ReactNode } from "react";

import { EDITOR_MAX_WIDTH_CLASS } from "@/components/editor/constants";

import { AppHeader } from "./app-header";

type PageShellProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
};

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <AppHeader />

      <main className={`mx-auto ${EDITOR_MAX_WIDTH_CLASS} px-4 py-8`}>
        <div className="mb-6">
          <h1 className="text-text-secondary text-lg font-semibold">{title}</h1>
          {subtitle ? (
            <p className="text-text-faint mt-0.5 text-[11px]">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
