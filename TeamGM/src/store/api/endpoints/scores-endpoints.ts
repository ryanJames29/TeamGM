import { API_MLB_GAMES_PATH, API_NHL_GAMES_PATH } from '@/constants/api';

import type { MlbScoresResponse, NhlScoresResponse } from '../types';
import type { TeamgmEndpointBuilder } from '../teamgm-api';

function timezoneOffsetMinutes(): number {
  // JS returns minutes to add to local time to get UTC, so invert to get UTC->local offset.
  return -new Date().getTimezoneOffset();
}

// NHL and MLB scoreboard queries against the FastAPI backend
export function scoresEndpoints(builder: TeamgmEndpointBuilder) {
  return {
    getNhlGames: builder.query<NhlScoresResponse, string | void>({
      query: (centerDate) => ({
        url: API_NHL_GAMES_PATH,
        params: centerDate
          ? { date: centerDate, tz_offset_minutes: timezoneOffsetMinutes() }
          : { tz_offset_minutes: timezoneOffsetMinutes() },
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
        params: centerDate
          ? { date: centerDate, tz_offset_minutes: timezoneOffsetMinutes() }
          : { tz_offset_minutes: timezoneOffsetMinutes() },
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
