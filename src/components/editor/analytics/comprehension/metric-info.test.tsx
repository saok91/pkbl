/**
 * @vitest-environment jsdom
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { METRIC_GLOSSARY } from "./metric-glossary";
import { MetricInfo } from "./metric-info";

describe("MetricInfo", () => {
  const entry = METRIC_GLOSSARY[0]!;

  it("opens popover on click", () => {
    render(<MetricInfo entry={entry} />);

    fireEvent.click(screen.getByRole("button", { name: /توضیح/i }));
    expect(screen.getByRole("tooltip")).toHaveTextContent(entry.definitionFa);
  });

  it("closes popover on Escape", () => {
    render(<MetricInfo entry={entry} />);

    fireEvent.click(screen.getByRole("button", { name: /توضیح/i }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens popover on hover after delay", async () => {
    vi.useFakeTimers();
    render(<MetricInfo entry={entry} />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: /توضیح/i }));
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole("tooltip")).toHaveTextContent(entry.definitionFa);
    vi.useRealTimers();
  });
});
