import { beforeEach, describe, expect, it } from "vitest";

import { assignChar, getDefaultTemplate } from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";
import { CORPUS_PRESET_STORAGE_KEY } from "@/lib/corpus/client-presets";
import {
  clearEditorDraft,
  createEditorDraft,
  draftToLayout,
  EDITOR_DRAFT_STORAGE_KEY,
  parseEditorDraft,
  readEditorDraft,
  readEditorDraftCorpusPresetId,
  writeEditorDraft,
} from "@/lib/persistence";

describe("editor draft persistence", () => {
  const storage = {
    store: new Map<string, string>(),
    get length() {
      return this.store.size;
    },
    clear() {
      this.store.clear();
    },
    key(index: number) {
      return [...this.store.keys()][index] ?? null;
    },
    getItem(key: string) {
      return this.store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      this.store.set(key, value);
    },
    removeItem(key: string) {
      this.store.delete(key);
    },
  } satisfies Storage;

  beforeEach(() => {
    storage.store.clear();
  });

  it("round-trips layout and corpus preset through storage", () => {
    const layout = assignChar(getDefaultTemplate(), keyIdAt("Q"), "base", "ق");
    const draft = createEditorDraft(layout, "varzesh3", "2026-06-30T12:00:00.000Z");

    const result = writeEditorDraft(draft, storage);
    expect(result).toEqual({ ok: true });

    const restored = readEditorDraft(storage);

    expect(restored).toEqual(draft);
    expect(draftToLayout(restored!).assignments.get(keyIdAt("Q"))?.base).toBe(
      "ق",
    );
  });

  it("returns null for missing or invalid draft payloads", () => {
    expect(readEditorDraft(storage)).toBeNull();

    storage.setItem(EDITOR_DRAFT_STORAGE_KEY, "{not-json");
    expect(readEditorDraft(storage)).toBeNull();

    storage.setItem(
      EDITOR_DRAFT_STORAGE_KEY,
      JSON.stringify({ version: 99, savedAt: "x", corpusPresetId: "wiki-fa" }),
    );
    expect(readEditorDraft(storage)).toBeNull();
  });

  it("rejects drafts with unknown corpus preset ids", () => {
    const layout = getDefaultTemplate();
    const invalid = {
      version: 1,
      savedAt: "2026-06-30T12:00:00.000Z",
      corpusPresetId: "unknown",
      layout: createEditorDraft(layout, "wiki-fa").layout,
    };

    expect(parseEditorDraft(invalid)).toBeNull();
  });

  it("rejects drafts with invalid savedAt timestamps", () => {
    const layout = getDefaultTemplate();
    const invalid = {
      version: 1,
      savedAt: "not-a-date",
      corpusPresetId: "wiki-fa",
      layout: createEditorDraft(layout, "wiki-fa").layout,
    };

    expect(parseEditorDraft(invalid)).toBeNull();
  });

  it("rejects wire payloads with invalid geometry", () => {
    const layout = getDefaultTemplate();
    const wire = createEditorDraft(layout, "wiki-fa").layout;
    const tamperedKey = wire.keys[0];
    if (!tamperedKey) {
      throw new Error("expected at least one key in wire layout");
    }

    const invalid = {
      version: 1,
      savedAt: "2026-06-30T12:00:00.000Z",
      corpusPresetId: "wiki-fa",
      layout: {
        ...wire,
        keys: [
          [
            tamperedKey[0],
            {
              ...tamperedKey[1],
              geometry: { ...tamperedKey[1].geometry, width: -1 },
            },
          ],
        ],
      },
    };

    expect(parseEditorDraft(invalid)).toBeNull();
  });

  it("returns storage error when setItem throws", () => {
    const failingStorage = {
      ...storage,
      setItem: () => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      },
    } satisfies Storage;

    const result = writeEditorDraft(
      createEditorDraft(getDefaultTemplate(), "wiki-fa"),
      failingStorage,
    );

    expect(result).toEqual({ ok: false, error: "quota_exceeded" });
  });

  it("reads corpus preset from draft before standalone storage key", () => {
    storage.setItem(CORPUS_PRESET_STORAGE_KEY, "wiki-fa");
    writeEditorDraft(createEditorDraft(getDefaultTemplate(), "varzesh3"), storage);

    expect(readEditorDraftCorpusPresetId(storage)).toBe("varzesh3");
  });

  it("falls back to standalone corpus preset when no draft exists", () => {
    storage.setItem(CORPUS_PRESET_STORAGE_KEY, "varzesh3");

    expect(readEditorDraftCorpusPresetId(storage)).toBe("varzesh3");
  });

  it("clears stored draft", () => {
    writeEditorDraft(createEditorDraft(getDefaultTemplate(), "wiki-fa"), storage);
    clearEditorDraft(storage);
    expect(readEditorDraft(storage)).toBeNull();
  });
});
