import type { Layout } from "./types";

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
