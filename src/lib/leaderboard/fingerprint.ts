import { createHash } from "node:crypto";

import type { Layout } from "@/lib/layout/types";

type AssignmentEntry = {
  readonly keyId: string;
  readonly base: string;
  readonly shift: string;
};

function normalizeAssignments(layout: Layout): readonly AssignmentEntry[] {
  return [...layout.assignments.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([keyId, slot]) => ({
      keyId,
      base: slot.base,
      shift: slot.shift,
    }));
}

/** Stable fingerprint from normalized assignments (architecture §17 #4). */
export function computeLayoutFingerprint(layout: Layout): string {
  const canonical = JSON.stringify({
    templateId: layout.templateId,
    assignments: normalizeAssignments(layout),
  });

  return createHash("sha256").update(canonical, "utf8").digest("hex");
}
