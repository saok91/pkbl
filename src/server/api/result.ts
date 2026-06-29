/** Consistent API envelope (architecture §10). */
export type ApiResult<T> = {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly meta?: {
    readonly total?: number;
    readonly page?: number;
    readonly limit?: number;
    readonly cursor?: string | null;
  };
};

export function apiOk<T>(data: T, meta?: ApiResult<T>["meta"]): ApiResult<T> {
  return {
    success: true,
    data,
    error: null,
    ...(meta !== undefined ? { meta } : {}),
  };
}

export function apiFail<T = never>(
  error: string,
  meta?: ApiResult<T>["meta"],
): ApiResult<T> {
  return {
    success: false,
    data: null,
    error,
    ...(meta !== undefined ? { meta } : {}),
  };
}
