import { artifactToNgramStats } from "./serialize";
import type { NgramStats } from "./types";
import { assertNgramArtifact } from "./validate-artifact";

/** Parse artifact JSON without filesystem access (client + server safe). */
export function parseNgramArtifact(json: string): NgramStats {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid n-gram artifact JSON");
  }

  assertNgramArtifact(parsed);
  return artifactToNgramStats(parsed);
}
