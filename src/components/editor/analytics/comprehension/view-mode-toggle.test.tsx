/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ANALYTICS_VIEW_MODE_KEY, useAnalyticsViewMode, ViewModeToggle } from "./view-mode-toggle";

describe("ViewModeToggle", () => {
  it("calls onChange with selected mode", () => {
    const onChange = vi.fn();
    render(<ViewModeToggle mode="simple" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /نمای متخصص/i }));
    expect(onChange).toHaveBeenCalledWith("expert");
  });

  it("marks active mode with aria-pressed", () => {
    render(<ViewModeToggle mode="expert" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /نمای ساده/i }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: /نمای متخصص/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

describe("view mode storage", () => {
  it("reads expert mode from localStorage via useSyncExternalStore", () => {
    localStorage.clear();
    localStorage.setItem(ANALYTICS_VIEW_MODE_KEY, "expert");

    const { result } = renderHook(() => useAnalyticsViewMode());
    expect(result.current.mode).toBe("expert");
  });

  it("persists mode changes through hook", () => {
    localStorage.clear();
    const { result } = renderHook(() => useAnalyticsViewMode());

    act(() => {
      result.current.setMode("expert");
    });
    expect(localStorage.getItem(ANALYTICS_VIEW_MODE_KEY)).toBe("expert");
    expect(result.current.mode).toBe("expert");
  });
});
