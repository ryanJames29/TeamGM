import { API_BASE_URL, API_HEALTH_PATH, API_NHL_GAMES_PATH } from '@/constants/api';
import type { MockGame } from '@/mock-data/types/scores';

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

export type NhlLeagueInfo = {
  id?: number;
  name?: string;
  logo?: string;
  season?: number;
};

export type NhlScoresResponse = {
  status: string;
  message: string;
  date?: string;
  league?: NhlLeagueInfo;
  games: MockGame[];
};

export async function fetchNhlScores(centerDate?: string): Promise<NhlScoresResponse> {
  const query = centerDate ? `?date=${encodeURIComponent(centerDate)}` : '';
  const url = `${getApiBaseUrl()}${API_NHL_GAMES_PATH}${query}`;
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new ApiClientError(
      'Could not reach the API. Start uvicorn and try again.',
    );
  }

  if (!response.ok) {
    let detail = `API returned ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      // ignore parse errors
    }
    throw new ApiClientError(detail, response.status);
  }

  return (await response.json()) as NhlScoresResponse;
}
