import { readFileSync } from "node:fs";

import { NextResponse } from "next/server";

import { resolvePresetArtifactPath } from "@/lib/corpus/load-artifact";
import { getPresetById } from "@/lib/corpus/presets";

type RouteParams = {
  params: Promise<{ presetId: string }>;
};

/** Serve precomputed n-gram artifacts until E12 tRPC corpus router ships. */
export async function GET(_request: Request, { params }: RouteParams) {
  const { presetId } = await params;
  const preset = getPresetById(presetId);

  if (!preset) {
    return NextResponse.json(
      { success: false, data: null, error: "Unknown corpus preset" },
      { status: 404 },
    );
  }

  try {
    const artifactPath = resolvePresetArtifactPath(presetId);
    const raw = readFileSync(artifactPath, "utf8");
    return new NextResponse(raw, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: "Corpus artifact not found" },
      { status: 404 },
    );
  }
}
