/** Pull a user-facing message from an RTK Query / fetchBaseQuery error. */
export function getRtkErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  if ('status' in error && error.status === 'FETCH_ERROR') {
    return 'Could not reach the API. Is uvicorn running?';
  }

  if ('status' in error && error.status === 'PARSING_ERROR') {
    return 'API returned an invalid response. Check that Redis is running (docker compose up -d).';
  }

  if ('data' in error && error.data && typeof error.data === 'object') {
    const data = error.data as { detail?: unknown };
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }
  }

  if ('error' in error && typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if ('status' in error && typeof error.status === 'number') {
    return `${fallback} (HTTP ${error.status})`;
  }

  return fallback;
}
