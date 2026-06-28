import { isCharInEditableScope } from "@/lib/layout/editable-scope";
import { parseLabelLayers } from "@/lib/layout/kle-parser";
import type { Layout } from "@/lib/layout/types";
import type { CharResolution } from "./types";

/** Build char → key lookup from layout assignments (base and shift layers). */
export function buildCharLookup(
  layout: Layout,
): ReadonlyMap<string, CharResolution> {
  const lookup = new Map<string, CharResolution>();

  for (const [keyId, key] of layout.keys) {
    if (!key.isEditable) {
      continue;
    }

    const slot =
      layout.assignments.get(keyId) ?? parseLabelLayers(key.defaultLabel);
    if (slot.base && isCharInEditableScope(slot.base)) {
      lookup.set(slot.base, { keyId, layer: "base" });
    }
    if (slot.shift && isCharInEditableScope(slot.shift)) {
      lookup.set(slot.shift, { keyId, layer: "shift" });
    }
  }

  return lookup;
}

/** Resolve a single character to its physical key (or null if unassigned). */
export function resolveChar(
  lookup: ReadonlyMap<string, CharResolution>,
  char: string,
): CharResolution | null {
  return lookup.get(char) ?? null;
}
