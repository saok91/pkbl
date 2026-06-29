import { getAssignedCharsForLayer } from "@/lib/layout";
import type { Layout } from "@/lib/layout/types";

/** Palette legend / button assignment state. */
export type PaletteCharAssignment = "free" | "base" | "shift";

export function getAssignedCharSets(layout: Layout): {
  base: ReadonlySet<string>;
  shift: ReadonlySet<string>;
} {
  return {
    base: new Set(getAssignedCharsForLayer(layout, "base")),
    shift: new Set(getAssignedCharsForLayer(layout, "shift")),
  };
}

export function getPaletteCharAssignment(
  char: string,
  baseAssigned: ReadonlySet<string>,
  shiftAssigned: ReadonlySet<string>,
): PaletteCharAssignment {
  const onBase = baseAssigned.has(char);
  const onShift = shiftAssigned.has(char);

  if (!onBase && !onShift) {
    return "free";
  }
  if (onBase) {
    return "base";
  }
  return "shift";
}
