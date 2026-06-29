import { z } from "zod";

import type { Layout } from "@/lib/layout/types";
import { layoutWireSchema } from "@/lib/layout/wire-schema";
import {
  layoutFromWire,
  layoutToWire,
  type LayoutWire,
} from "@/lib/layout/wire";

function isLayout(value: unknown): value is Layout {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Layout;
  return (
    typeof candidate.templateId === "string" &&
    candidate.templateId.length > 0 &&
    candidate.keys instanceof Map &&
    candidate.assignments instanceof Map &&
    Array.isArray(candidate.kleStructure)
  );
}

/** Validates a runtime Layout (Maps preserved via superjson). */
export const layoutSchema = z.custom<Layout>(isLayout, {
  message: "Invalid layout payload",
});

export { layoutWireSchema };

export type { LayoutWire };

export { layoutFromWire, layoutToWire };

/** API boundary — validates wire format and converts to runtime Layout. */
export const layoutInputSchema = layoutWireSchema.transform(layoutFromWire);
