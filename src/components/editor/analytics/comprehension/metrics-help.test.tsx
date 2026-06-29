/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetricsHelp } from "./metrics-help";

describe("MetricsHelp", () => {
  it("expands and collapses glossary section", () => {
    render(<MetricsHelp />);

    const trigger = screen.getByRole("button", { name: /راهنمای امتیاز/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("یونی‌گرام")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
