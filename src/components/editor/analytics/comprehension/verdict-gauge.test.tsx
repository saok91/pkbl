/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { deriveVerdict } from "@/lib/scoring/insights";

import { VerdictGauge } from "./verdict-gauge";

describe("VerdictGauge", () => {
  it("renders qualitative label for good verdict", () => {
    const verdict = deriveVerdict(1050, 1000);
    render(<VerdictGauge verdict={verdict} isStale={false} />);

    expect(
      screen.getByRole("img", { name: /وضعیت چیدمان: چیدمان خوب/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/امتیاز:/)).toBeInTheDocument();
  });

  it("exposes aria-live region for band changes", () => {
    const verdict = deriveVerdict(900, 1000);
    const { rerender } = render(
      <VerdictGauge verdict={verdict} isStale={false} />,
    );

    expect(
      screen.getByRole("img", { name: /وضعیت چیدمان: نیازمند بهبود/ }),
    ).toBeInTheDocument();
    expect(document.querySelector("[aria-live='polite']")).toHaveTextContent(
      "نیازمند بهبود",
    );

    rerender(
      <VerdictGauge verdict={deriveVerdict(1050, 1000)} isStale={false} />,
    );

    expect(document.querySelector("[aria-live='polite']")).toHaveTextContent(
      "چیدمان خوب",
    );
  });

  it("shows baseline compare and score delta badge", () => {
    const verdict = deriveVerdict(1050, 1000);
    render(
      <VerdictGauge
        verdict={verdict}
        isStale={false}
        scoreDelta={12}
        showScoreDelta
      />,
    );

    expect(screen.getByText(/بهتر از چیدمان پیش‌فرض/)).toBeInTheDocument();
    expect(screen.getByText("+۱۲")).toBeInTheDocument();
  });
});
