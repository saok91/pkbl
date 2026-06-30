import type { Layout } from "@/lib/layout/types";
import { layoutToWire, type LayoutWire } from "~/server/api/schemas/layout";

/** Converts a runtime Layout to wire input for tRPC callers in tests. */
export function layoutAsWireInput(layout: Layout): LayoutWire {
  return layoutToWire(layout);
}
