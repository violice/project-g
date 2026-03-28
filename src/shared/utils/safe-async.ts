export type AsyncResult<T> = { ok: true; data: T } | { ok: false; error: unknown };

export const safeAsync = async <T>(promise: Promise<T>): Promise<AsyncResult<T>> => {
  try {
    const data = await promise;
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error };
  }
};
