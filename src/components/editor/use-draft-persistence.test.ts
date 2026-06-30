import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * @vitest-environment jsdom
 */

import { assignChar, getDefaultTemplate } from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";
import {
  CORPUS_PRESET_STORAGE_KEY,
  type CorpusPresetId,
} from "@/lib/corpus/client-presets";
import {
  createEditorDraft,
  EDITOR_DRAFT_STORAGE_KEY,
  readEditorDraft,
} from "@/lib/persistence";

import { resetEditorStore, useEditorStore } from "./use-editor-store";
import { useDraftPersistence } from "./use-draft-persistence";

describe("useDraftPersistence", () => {
  beforeEach(() => {
    localStorage.clear();
    resetEditorStore(getDefaultTemplate());
  });

  it("restores draft layout on mount", async () => {
    const savedLayout = assignChar(
      getDefaultTemplate(),
      keyIdAt("Q"),
      "base",
      "ق",
    );
    localStorage.setItem(
      EDITOR_DRAFT_STORAGE_KEY,
      JSON.stringify(createEditorDraft(savedLayout, "varzesh3")),
    );

    renderHook(() =>
      useDraftPersistence(useEditorStore.getState().layout, "wiki-fa"),
    );

    await waitFor(() => {
      expect(
        useEditorStore.getState().layout.assignments.get(keyIdAt("Q"))?.base,
      ).toBe("ق");
    });
  });

  it("restores corpus preset via callback", async () => {
    localStorage.setItem(
      EDITOR_DRAFT_STORAGE_KEY,
      JSON.stringify(createEditorDraft(getDefaultTemplate(), "varzesh3")),
    );

    const onRestoreCorpusPreset = vi.fn();

    renderHook(() =>
      useDraftPersistence(
        useEditorStore.getState().layout,
        "wiki-fa",
        onRestoreCorpusPreset,
      ),
    );

    await waitFor(() => {
      expect(onRestoreCorpusPreset).toHaveBeenCalledWith("varzesh3");
    });
  });

  it("auto-saves layout changes after debounce", async () => {
    const { rerender } = renderHook(
      ({
        layout,
        presetId,
      }: {
        layout: ReturnType<typeof getDefaultTemplate>;
        presetId: CorpusPresetId;
      }) => useDraftPersistence(layout, presetId),
      {
        initialProps: {
          layout: getDefaultTemplate(),
          presetId: "wiki-fa" satisfies CorpusPresetId,
        },
      },
    );

    await waitFor(() => {
      expect(readEditorDraft()?.corpusPresetId).toBe("wiki-fa");
    });

    const nextLayout = assignChar(
      getDefaultTemplate(),
      keyIdAt("W"),
      "base",
      "و",
    );

    rerender({ layout: nextLayout, presetId: "wiki-fa" });

    await waitFor(
      () => {
        expect(
          readEditorDraft()?.layout.assignments.find(
            ([id]) => id === keyIdAt("W"),
          )?.[1].base,
        ).toBe("و");
      },
      { timeout: 1000 },
    );
  });

  it("syncs standalone corpus preset key on save", async () => {
    const { rerender } = renderHook(
      ({
        layout,
        presetId,
      }: {
        layout: ReturnType<typeof getDefaultTemplate>;
        presetId: CorpusPresetId;
      }) => useDraftPersistence(layout, presetId),
      {
        initialProps: {
          layout: getDefaultTemplate(),
          presetId: "wiki-fa" satisfies CorpusPresetId,
        },
      },
    );

    await waitFor(() => {
      expect(readEditorDraft()?.corpusPresetId).toBe("wiki-fa");
    });

    rerender({ layout: getDefaultTemplate(), presetId: "varzesh3" });

    await waitFor(
      () => {
        expect(localStorage.getItem(CORPUS_PRESET_STORAGE_KEY)).toBe(
          "varzesh3",
        );
        expect(readEditorDraft()?.corpusPresetId).toBe("varzesh3");
      },
      { timeout: 1000 },
    );
  });

  it("clears isSaving and surfaces error when write fails", async () => {
    const layout = getDefaultTemplate();
    const originalSetItem = Storage.prototype.setItem;
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(function (this: Storage, key: string, value: string) {
        if (key === EDITOR_DRAFT_STORAGE_KEY) {
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        }
        originalSetItem.call(this, key, value);
      });

    const { result } = renderHook(() => useDraftPersistence(layout, "wiki-fa"));

    await waitFor(
      () => {
        expect(result.current.isHydrated).toBe(true);
        expect(result.current.isSaving).toBe(false);
        expect(result.current.saveError).toContain("فضای ذخیره");
      },
      { timeout: 1000 },
    );

    setItemSpy.mockRestore();
  });

  it("coalesces rapid edits into a single debounced write", async () => {
    vi.useFakeTimers();

    try {
      const layout = getDefaultTemplate();
      const { rerender } = renderHook(
        ({ currentLayout }) => useDraftPersistence(currentLayout, "wiki-fa"),
        {
          initialProps: { currentLayout: layout },
        },
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(readEditorDraft()).not.toBeNull();

      rerender({
        currentLayout: assignChar(
          getDefaultTemplate(),
          keyIdAt("Q"),
          "base",
          "ق",
        ),
      });
      rerender({
        currentLayout: assignChar(
          getDefaultTemplate(),
          keyIdAt("W"),
          "base",
          "و",
        ),
      });
      rerender({
        currentLayout: assignChar(
          getDefaultTemplate(),
          keyIdAt("D"),
          "base",
          "د",
        ),
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(
        readEditorDraft()?.layout.assignments.find(
          ([id]) => id === keyIdAt("D"),
        )?.[1].base,
      ).toBe("د");
    } finally {
      vi.useRealTimers();
    }
  });
});
