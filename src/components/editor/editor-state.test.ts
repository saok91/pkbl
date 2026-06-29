import { describe, expect, it } from "vitest";

import { assignChar, getDefaultTemplate } from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";

import {
  canRedo,
  canUndo,
  createInitialEditorState,
  editorReducer,
} from "./editor-state";

describe("editorReducer", () => {
  it("assigns character on editable key", () => {
    const layout = getDefaultTemplate();
    const keyId = keyIdAt("Q");
    const state = createInitialEditorState(layout);

    const next = editorReducer(state, {
      type: "ASSIGN_CHAR",
      keyId,
      char: "ق",
    });

    expect(next.layout.assignments.get(keyId)?.base).toBe("ق");
    expect(canUndo(next)).toBe(true);
  });

  it("rejects out-of-scope character", () => {
    const layout = getDefaultTemplate();
    const keyId = keyIdAt("Q");
    const state = createInitialEditorState(layout);

    const next = editorReducer(state, {
      type: "ASSIGN_CHAR",
      keyId,
      char: "X",
    });

    expect(next.lastError).toBeTruthy();
    expect(next.layout).toBe(state.layout);
  });

  it("swaps keys on active layer only", () => {
    const layout = getDefaultTemplate();
    const keyQ = keyIdAt("Q");
    const keyW = keyIdAt("W");
    let state = createInitialEditorState(assignChar(layout, keyQ, "base", "ق"));
    state = editorReducer(state, {
      type: "ASSIGN_CHAR",
      keyId: keyW,
      char: "و",
    });

    const next = editorReducer(state, {
      type: "SWAP_KEYS",
      keyA: keyQ,
      keyB: keyW,
    });

    expect(next.layout.assignments.get(keyQ)?.base).toBe("و");
    expect(next.layout.assignments.get(keyW)?.base).toBe("ق");
  });

  it("supports undo and redo", () => {
    const layout = getDefaultTemplate();
    const keyId = keyIdAt("Q");
    const initial = createInitialEditorState(layout);
    const assigned = editorReducer(initial, {
      type: "ASSIGN_CHAR",
      keyId,
      char: "ق",
    });

    expect(canUndo(assigned)).toBe(true);
    const undone = editorReducer(assigned, { type: "UNDO" });
    expect(undone.layout.assignments.get(keyId)?.base).toBe("ض");
    expect(canRedo(undone)).toBe(true);

    const redone = editorReducer(undone, { type: "REDO" });
    expect(redone.layout.assignments.get(keyId)?.base).toBe("ق");
  });

  it("caps history at MAX_UNDO_STEPS", () => {
    const layout = getDefaultTemplate();
    const keyId = keyIdAt("Q");
    let state = createInitialEditorState(layout);

    for (let i = 0; i < 25; i++) {
      state = editorReducer(state, {
        type: "ASSIGN_CHAR",
        keyId,
        char: i % 2 === 0 ? "ق" : "و",
      });
    }

    expect(state.history.length).toBeLessThanOrEqual(21);
  });

  it("resets single key on active layer", () => {
    const layout = getDefaultTemplate();
    const keyId = keyIdAt("Q");
    let state = createInitialEditorState(
      assignChar(layout, keyId, "base", "ق"),
    );

    state = editorReducer(state, { type: "RESET_KEY", keyId });
    expect(state.layout.assignments.get(keyId)?.base).toBe("ض");
  });

  it("resets all editable keys", () => {
    const layout = getDefaultTemplate();
    const keyId = keyIdAt("Q");
    let state = createInitialEditorState(
      assignChar(layout, keyId, "base", "ق"),
    );

    state = editorReducer(state, { type: "RESET_ALL" });
    expect(state.layout.assignments.get(keyId)?.base).toBe("ض");
  });
});
