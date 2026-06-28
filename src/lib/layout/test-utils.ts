import type { Layout } from "./types";

/** Stable keyIds by US QWERTY physical position on the 60% ANSI template. */
export const ANSI_60_KEY_IDS = {
  Q: "R1C1",
  W: "R1C2",
  D: "R2C3",
  F: "R2C4",
  G: "R2C5",
  H: "R2C6",
  J: "R2C7",
  K: "R2C8",
} as const;

export type Ansi60PhysicalKey = keyof typeof ANSI_60_KEY_IDS;

export function keyIdAt(name: Ansi60PhysicalKey): string {
  return ANSI_60_KEY_IDS[name];
}

/** Find stable keyId by KLE default label (for tests). */
export function findKeyIdByLabel(layout: Layout, label: string): string {
  const entry = [...layout.keys.entries()].find(
    ([, key]) => key.defaultLabel === label,
  );
  if (!entry) {
    throw new Error(`Key with label "${label}" not found`);
  }
  return entry[0];
}

/** Find keyId whose base assignment matches `char`. */
export function findKeyIdByBaseChar(layout: Layout, char: string): string {
  const entry = [...layout.assignments.entries()].find(
    ([, slot]) => slot.base === char,
  );
  if (!entry) {
    throw new Error(`Key with base char "${char}" not found`);
  }
  return entry[0];
}
