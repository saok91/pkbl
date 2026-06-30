/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Insight } from "@/lib/scoring/insights";

import { StrengthsWeaknesses } from "./strengths-weaknesses";

const strength: Insight = {
  kind: "strength",
  metric: "homeRowUsage",
  severity: 5,
  titleFa: "استفاده خوب از ردیف home",
  adviceFa: "حروف پرتکرار در ردیف وسط قرار دارند.",
};

const weakness: Insight = {
  kind: "weakness",
  metric: "weakKeyPenalty",
  severity: 8,
  titleFa: "بار زیاد روی کلیدهای دشوار",
  adviceFa: "حروف پرتکرار را منتقل کنید.",
};

describe("StrengthsWeaknesses", () => {
  it("shows incomplete layout message", () => {
    render(<StrengthsWeaknesses strengths={[]} weaknesses={[]} incomplete />);

    expect(screen.getByText("اول چیدمان را کامل کنید")).toBeInTheDocument();
  });

  it("renders strength and weakness cards", () => {
    render(
      <StrengthsWeaknesses
        strengths={[strength]}
        weaknesses={[weakness]}
        incomplete={false}
      />,
    );

    expect(screen.getByText(strength.titleFa)).toBeInTheDocument();
    expect(screen.getByText(weakness.titleFa)).toBeInTheDocument();
  });

  it("shows empty state when no insights", () => {
    render(
      <StrengthsWeaknesses strengths={[]} weaknesses={[]} incomplete={false} />,
    );

    expect(screen.getByText(/قوت مشخصی یافت نشد/)).toBeInTheDocument();
    expect(screen.getByText(/ضعف مشخصی یافت نشد/)).toBeInTheDocument();
  });
});
