import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EditorToolbar } from "./editor-toolbar";

describe("EditorToolbar", () => {
  it("disables undo when history is empty", () => {
    render(
      <EditorToolbar
        canUndo={false}
        canRedo={false}
        selectedKeyId={null}
        onUndo={vi.fn()}
        onRedo={vi.fn()}
        onResetKey={vi.fn()}
        onResetAll={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "بازگشت" })).toBeDisabled();
  });

  it("calls undo when enabled", () => {
    const onUndo = vi.fn();
    render(
      <EditorToolbar
        canUndo
        canRedo={false}
        selectedKeyId={null}
        onUndo={onUndo}
        onRedo={vi.fn()}
        onResetKey={vi.fn()}
        onResetAll={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "بازگشت" }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("shows accessible confirm dialog before reset all", () => {
    const onResetAll = vi.fn();
    render(
      <EditorToolbar
        canUndo={false}
        canRedo={false}
        selectedKeyId={null}
        onUndo={vi.fn()}
        onRedo={vi.fn()}
        onResetKey={vi.fn()}
        onResetAll={onResetAll}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "بازنشانی همه" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "بله، بازنشانی" }));
    expect(onResetAll).toHaveBeenCalledOnce();
  });
});
