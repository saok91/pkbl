import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";

import { resetEditorStore, useEditorStore } from "./use-editor-store";

describe("useEditorStore interactions", () => {
  it("assigns on click flow and supports undo", () => {
    resetEditorStore(getDefaultTemplate());
    const { result } = renderHook(() => useEditorStore());

    const keyId = keyIdAt("Q");

    act(() => {
      result.current.assignChar(keyId, "ق");
    });

    expect(result.current.layout.assignments.get(keyId)?.base).toBe("ق");
    expect(result.current.openPopoverKeyId).toBeNull();
    expect(result.current.pendingChar).toBeNull();

    act(() => {
      result.current.undo();
    });

    expect(result.current.layout.assignments.get(keyId)?.base).toBe("ض");
  });

  it("clears popover and pending char on reset key", () => {
    resetEditorStore(getDefaultTemplate());
    const { result } = renderHook(() => useEditorStore());
    const keyId = keyIdAt("Q");

    act(() => {
      result.current.assignChar(keyId, "ق");
      result.current.openPopover(keyId);
      result.current.setPendingChar("و");
      result.current.resetKey(keyId);
    });

    expect(result.current.openPopoverKeyId).toBeNull();
    expect(result.current.pendingChar).toBeNull();
  });
});
