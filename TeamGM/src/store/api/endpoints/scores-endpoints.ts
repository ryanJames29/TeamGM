import { API_MLB_GAMES_PATH, API_NHL_GAMES_PATH } from '@/constants/api';

import type { MlbScoresResponse, NhlScoresResponse } from '../types';
import type { TeamgmEndpointBuilder } from '../teamgm-api';

// NHL and MLB scoreboard queries against the FastAPI backend
export function scoresEndpoints(builder: TeamgmEndpointBuilder) {
  return {
    getNhlGames: builder.query<NhlScoresResponse, string | void>({
      query: (centerDate) => ({
        url: API_NHL_GAMES_PATH,
        params: centerDate ? { date: centerDate } : undefined,
      }),
      transformResponse: (response: NhlScoresResponse) => ({
        ...response,
        games: Array.isArray(response.games) ? response.games : [],
      }),
      providesTags: ['NhlGames'] as const,
      keepUnusedDataFor: 120,
    }),
    getMlbGames: builder.query<MlbScoresResponse, string | void>({
      query: (centerDate) => ({
        url: API_MLB_GAMES_PATH,
        params: centerDate ? { date: centerDate } : undefined,
      }),
      transformResponse: (response: MlbScoresResponse) => ({
        ...response,
        games: Array.isArray(response.games) ? response.games : [],
      }),
      providesTags: ['MlbGames'] as const,
      keepUnusedDataFor: 120,
    }),
  };
}
