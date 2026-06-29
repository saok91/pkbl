import { createHash } from "node:crypto";

import type { Prisma } from "../../../generated/prisma";

/** Deterministic lock key for `pg_advisory_xact_lock` (one lock per corpus preset). */
export function corpusPresetAdvisoryLockKey(corpusPresetId: string): bigint {
  const digest = createHash("sha256")
    .update(`pkbl:leaderboard:${corpusPresetId}`, "utf8")
    .digest();

  return digest.readBigInt64BE(0);
}

/** Serialize leaderboard mutations per corpus preset to prevent acceptance races. */
export async function withCorpusPresetLock<T>(
  tx: Prisma.TransactionClient,
  corpusPresetId: string,
  fn: () => Promise<T>,
): Promise<T> {
  const lockKey = corpusPresetAdvisoryLockKey(corpusPresetId);
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;
  return fn();
}
