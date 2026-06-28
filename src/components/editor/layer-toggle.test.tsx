import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LayerToggle } from "./layer-toggle";

describe("LayerToggle", () => {
  it("switches layer on click", () => {
    const onChange = vi.fn();
    render(<LayerToggle activeLayer="base" onChange={onChange} />);

    fireEvent.click(screen.getByRole("tab", { name: /شیفت/i }));
    expect(onChange).toHaveBeenCalledWith("shift");
  });

  it("moves focus with arrow keys", () => {
    const onChange = vi.fn();
    render(<LayerToggle activeLayer="base" onChange={onChange} />);

    const baseTab = screen.getByRole("tab", { name: /پایه/i });
    baseTab.focus();

    fireEvent.keyDown(baseTab, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("shift");
  });
});
