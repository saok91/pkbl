import {
  LATIN_TO_PERSIAN_DIGIT,
  PERSIAN_TO_LATIN_DIGIT,
} from "@/lib/corpus/config";
import { isCharInEditableScope } from "@/lib/layout/editable-scope";
import { parseLabelLayers } from "@/lib/layout/kle-parser";
import type { Layout } from "@/lib/layout/types";
import type { CharResolution } from "./types";

function digitAlias(char: string): string | undefined {
  return LATIN_TO_PERSIAN_DIGIT[char] ?? PERSIAN_TO_LATIN_DIGIT[char];
}

function registerChar(
  lookup: Map<string, CharResolution>,
  char: string,
  resolution: CharResolution,
): void {
  lookup.set(char, resolution);
  const alias = digitAlias(char);
  if (alias && alias !== char) {
    lookup.set(alias, resolution);
  }
}

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
      registerChar(lookup, slot.base, { keyId, layer: "base" });
    }
    if (slot.shift && isCharInEditableScope(slot.shift)) {
      registerChar(lookup, slot.shift, { keyId, layer: "shift" });
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
