/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScoreDeltaBadge } from "./score-delta-badge";

describe("ScoreDeltaBadge", () => {
  it("renders positive delta in green", () => {
    render(<ScoreDeltaBadge delta={12} visible />);

    expect(screen.getByText("+۱۲")).toBeInTheDocument();
  });

  it("renders negative delta in red styling", () => {
    render(<ScoreDeltaBadge delta={-8} visible />);

    expect(screen.getByText("−۸")).toBeInTheDocument();
  });

  it("renders nothing when not visible", () => {
    render(<ScoreDeltaBadge delta={12} visible={false} />);

    expect(screen.queryByText("+۱۲")).not.toBeInTheDocument();
  });

  it("renders nothing on first score without previous total", () => {
    render(<ScoreDeltaBadge delta={null} visible={false} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders nothing for zero delta", () => {
    render(<ScoreDeltaBadge delta={0} visible />);

    expect(screen.queryByText("۰")).not.toBeInTheDocument();
  });
});
