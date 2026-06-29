/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { deriveVerdict } from "@/lib/scoring/insights";

import { BaselineCompare } from "./baseline-compare";

describe("BaselineCompare", () => {
  it("shows positive delta when layout beats baseline", () => {
    render(<BaselineCompare total={1180} baselineTotal={1000} isStale={false} />);

    expect(screen.getByText(/بهتر از چیدمان پیش‌فرض/)).toBeInTheDocument();
  });

  it("shows negative delta when layout is worse than baseline", () => {
    render(<BaselineCompare total={850} baselineTotal={1000} isStale={false} />);

    expect(screen.getByText(/بدتر از چیدمان پیش‌فرض/)).toBeInTheDocument();
  });

  it("shows equal message when scores match", () => {
    render(<BaselineCompare total={1000} baselineTotal={1000} isStale={false} />);

    expect(screen.getByText("برابر با چیدمان پیش‌فرض")).toBeInTheDocument();
  });
});

describe("BaselineCompare with verdict", () => {
  it("integrates with deriveVerdict baseline totals", () => {
    const verdict = deriveVerdict(1050, 1000);
    render(
      <BaselineCompare
        total={verdict.total}
        baselineTotal={verdict.baselineTotal}
        isStale={false}
      />,
    );

    expect(screen.getByText(/بهتر از چیدمان پیش‌فرض/)).toBeInTheDocument();
  });
});
