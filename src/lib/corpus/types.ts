/** Versioned normalization policy identifier for reproducible corpus stats. */
export type NormalizedVersion = string;

/** Runtime n-gram frequency stats (immutable maps). */
export type NgramStats = {
  readonly unigrams: ReadonlyMap<string, number>;
  readonly bigrams: ReadonlyMap<string, number>;
  readonly trigrams: ReadonlyMap<string, number>;
  readonly totalChars: number;
  readonly corpusId: string;
  readonly normalizedVersion: NormalizedVersion;
};

/** JSON-serializable n-gram artifact written by corpus-build. */
export type NgramArtifact = {
  readonly corpusId: string;
  readonly version: string;
  readonly normalizedVersion: NormalizedVersion;
  readonly charCount: number;
  readonly builtAt: string;
  readonly unigrams: Readonly<Record<string, number>>;
  readonly bigrams: Readonly<Record<string, number>>;
  readonly trigrams: Readonly<Record<string, number>>;
};

/** Preset metadata for UI and server selection. */
export type CorpusPreset = {
  readonly id: string;
  readonly nameFa: string;
  readonly descriptionFa: string;
  readonly charCount: number;
  readonly version: string;
  readonly artifactFileName: string;
};
