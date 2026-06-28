import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import {
  DEFAULT_NORMALIZATION_CONFIG,
  NORMALIZATION_CONFIG_V1,
} from "../src/lib/corpus/config";
import { extractNgrams, mergeNgramStats } from "../src/lib/corpus/ngram-extract";
import { ngramStatsToArtifact } from "../src/lib/corpus/serialize";

const ROOT = process.cwd();
const OUTPUT_DIR = join(ROOT, "packages", "corpus-data");

type SqliteSource = {
  corpusId: string;
  dbPath: string;
  sql: string;
  version: string;
  outputFileName: string;
};

const SOURCES: readonly SqliteSource[] = [
  {
    corpusId: "wiki-fa",
    dbPath: join(ROOT, "corpus", "wiki_fa.sqlite"),
    sql: "SELECT plain_text FROM articles",
    version: "1",
    outputFileName: "wiki-fa.ngrams.json",
  },
  {
    corpusId: "varzesh3",
    dbPath: join(ROOT, "corpus", "varzesh3.sqlite"),
    sql: "SELECT message FROM comments",
    version: "1",
    outputFileName: "varzesh3.ngrams.json",
  },
];

function buildFromSqlite(source: SqliteSource) {
  if (!existsSync(source.dbPath)) {
    throw new Error(
      `[corpus:build] SQLite source not found: ${source.dbPath}\n` +
        `Place the database under corpus/ before running corpus:build.`,
    );
  }

  const db = new DatabaseSync(source.dbPath);
  try {
    const rows = db.prepare(source.sql).all() as Array<Record<string, string>>;

    const parts = rows.map((row) => {
      const text = Object.values(row)[0] ?? "";
      return extractNgrams(text, source.corpusId, DEFAULT_NORMALIZATION_CONFIG);
    });

    const merged = mergeNgramStats(
      source.corpusId,
      NORMALIZATION_CONFIG_V1.normalizedVersion,
      parts,
    );

    const builtAt = new Date().toISOString();
    const artifact = ngramStatsToArtifact(merged, source.version, builtAt);

    mkdirSync(OUTPUT_DIR, { recursive: true });
    const outputPath = join(OUTPUT_DIR, source.outputFileName);
    writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

    console.log(
      `[corpus:build] ${source.corpusId}: ${artifact.charCount} chars → ${outputPath}`,
    );

    return artifact;
  } finally {
    db.close();
  }
}

function main() {
  const manifest: Record<
    string,
    { charCount: number; version: string; builtAt: string }
  > = {};

  for (const source of SOURCES) {
    const artifact = buildFromSqlite(source);
    manifest[source.corpusId] = {
      charCount: artifact.charCount,
      version: artifact.version,
      builtAt: artifact.builtAt,
    };
  }

  writeFileSync(
    join(OUTPUT_DIR, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log("[corpus:build] done");
}

main();
