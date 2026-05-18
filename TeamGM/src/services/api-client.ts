import { API_BASE_URL, API_HEALTH_PATH } from '@/constants/api';

export type ApiHealthResponse = {
  status: string;
  message: string;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// Returns the configured API base URL or throws if missing
export function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new ApiClientError(
      'EXPO_PUBLIC_API_URL is not set. Add it to TeamGM/.env and restart Expo.',
    );
  }
  return API_BASE_URL;
}

// Pings GET /api/v1/health on the LLM API
export async function fetchApiHealth(): Promise<ApiHealthResponse> {
  const url = `${getApiBaseUrl()}${API_HEALTH_PATH}`;
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new ApiClientError(
      'Could not reach the API. Start uvicorn, then tap Check API health again.',
    );
  }

  if (!response.ok) {
    throw new ApiClientError(`API returned ${response.status}`, response.status);
  }

  return (await response.json()) as ApiHealthResponse;
}
