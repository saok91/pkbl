import { isModifierLabel } from "./modifiers";
import type { KleRaw } from "./types";

function parseSlot(label: string): { base: string; shift: string } {
  const parts = label.split("\n");
  if (parts.length === 1) {
    return { shift: "", base: parts[0] ?? "" };
  }
  return {
    shift: parts[0] ?? "",
    base: parts[1] ?? "",
  };
}

function isPaletteChar(char: string): boolean {
  return [...char].length === 1;
}

/**
 * Unique assignable characters from a KLE layout (base + shift layers),
 * in row-major keyboard order.
 */
export function extractCharsetFromKle(structure: KleRaw): string {
  const seen = new Set<string>();
  const ordered: string[] = [];

  const add = (char: string) => {
    if (!char || !isPaletteChar(char)) {
      return;
    }
    if (seen.has(char)) {
      return;
    }
    seen.add(char);
    ordered.push(char);
  };

  for (const row of structure) {
    for (const item of row) {
      if (typeof item !== "string" || isModifierLabel(item)) {
        continue;
      }
      const slot = parseSlot(item);
      add(slot.base);
      add(slot.shift);
    }
  }

  return ordered.join("");
}
