import { apiGameDetailPath } from '@/constants/api';

import type { GameDetailResponse } from '../types';
import type { TeamgmEndpointBuilder } from '../teamgm-api';

type LiveLeague = 'nhl' | 'mlb';

type GameDetailArgs = {
  league: LiveLeague;
  id: string;
};

// Single-game detail query (box score, team stats, events)
export function gameDetailEndpoints(builder: TeamgmEndpointBuilder) {
  return {
    getGameDetail: builder.query<GameDetailResponse, GameDetailArgs>({
      query: ({ league, id }) => apiGameDetailPath(league, id),
      providesTags: (_result, _error, { league, id }) => [
        { type: 'GameDetail' as const, id: `${league}-${id}` },
      ],
      keepUnusedDataFor: 120,
    }),
  };
}
