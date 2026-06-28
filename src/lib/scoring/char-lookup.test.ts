import { describe, expect, it } from "vitest";

import { assignChar, getDefaultTemplate } from "@/lib/layout";
import { parseLabelLayers } from "@/lib/layout/kle-parser";
import { findKeyIdByLabel } from "@/lib/layout/test-utils";
import { buildCharLookup, resolveChar } from "./char-lookup";

describe("buildCharLookup", () => {
  it("maps assigned chars to keyId and layer", () => {
    const layout = getDefaultTemplate();
    const fKey = findKeyIdByLabel(layout, "F");
    const jKey = findKeyIdByLabel(layout, "J");
    const scored = assignChar(
      assignChar(layout, fKey, "base", "ا"),
      jKey,
      "shift",
      "؟",
    );

    const lookup = buildCharLookup(scored);

    expect(resolveChar(lookup, "ا")).toEqual({ keyId: fKey, layer: "base" });
    expect(resolveChar(lookup, "؟")).toEqual({ keyId: jKey, layer: "shift" });
    expect(resolveChar(lookup, "ز")).toBeNull();
  });

  it("uses last layout.keys entry when two editable keys share a char", () => {
    const layout = getDefaultTemplate();
    const fKey = findKeyIdByLabel(layout, "F");
    const gKey = findKeyIdByLabel(layout, "G");
    const both = assignChar(
      assignChar(layout, fKey, "base", "ا"),
      gKey,
      "base",
      "ا",
    );

    let lastKeyId: string | null = null;
    for (const [keyId, key] of both.keys) {
      if (!key.isEditable) {
        continue;
      }
      const slot =
        both.assignments.get(keyId) ??
        parseLabelLayers(key.defaultLabel);
      if (slot.base === "ا") {
        lastKeyId = keyId;
      }
    }

    const lookup = buildCharLookup(both);
    expect(lastKeyId).not.toBeNull();
    expect(resolveChar(lookup, "ا")).toEqual({
      keyId: lastKeyId!,
      layer: "base",
    });
  });

  it("skips non-editable keys", () => {
    const layout = getDefaultTemplate();
    const lookup = buildCharLookup(layout);

    for (const resolution of lookup.values()) {
      expect(layout.keys.get(resolution.keyId)?.isEditable).toBe(true);
    }
  });
});
