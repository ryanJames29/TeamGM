import { API_MLB_GAMES_PATH, API_NHL_GAMES_PATH } from '@/constants/api';

import type { MlbScoresResponse, NhlScoresResponse } from '../types';
import type { TeamgmEndpointBuilder } from '../teamgm-api';

type GamesQueryArg =
  | string
  | {
      date?: string;
      view?: 'scoreboard' | 'window';
    }
  | void;

function timezoneOffsetMinutes(): number {
  // JS returns minutes to add to local time to get UTC, so invert to get UTC->local offset.
  return -new Date().getTimezoneOffset();
}

// NHL and MLB scoreboard queries against the FastAPI backend
export function scoresEndpoints(builder: TeamgmEndpointBuilder) {
  return {
    getNhlGames: builder.query<NhlScoresResponse, GamesQueryArg>({
      query: (arg) => {
        const date = typeof arg === 'string' ? arg : arg?.date;
        const view = typeof arg === 'string' ? undefined : arg?.view;
        return {
        url: API_NHL_GAMES_PATH,
        params: {
          ...(date ? { date } : null),
          ...(view ? { view } : null),
          tz_offset_minutes: timezoneOffsetMinutes(),
        },
      };
      },
      transformResponse: (response: NhlScoresResponse) => ({
        ...response,
        games: Array.isArray(response.games) ? response.games : [],
      }),
      providesTags: ['NhlGames'] as const,
      keepUnusedDataFor: 120,
    }),
    getMlbGames: builder.query<MlbScoresResponse, GamesQueryArg>({
      query: (arg) => {
        const date = typeof arg === 'string' ? arg : arg?.date;
        const view = typeof arg === 'string' ? undefined : arg?.view;
        return {
        url: API_MLB_GAMES_PATH,
        params: {
          ...(date ? { date } : null),
          ...(view ? { view } : null),
          tz_offset_minutes: timezoneOffsetMinutes(),
        },
      };
      },
      transformResponse: (response: MlbScoresResponse) => ({
        ...response,
        games: Array.isArray(response.games) ? response.games : [],
      }),
      providesTags: ['MlbGames'] as const,
      keepUnusedDataFor: 120,
    }),
  };
}
