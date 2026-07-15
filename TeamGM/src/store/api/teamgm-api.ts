import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';

import { API_BASE_URL } from '@/constants/api';

import { favoriteTeamsEndpoints } from './endpoints/favorite-teams-endpoints';
import { gameDetailEndpoints } from './endpoints/game-detail-endpoints';
import { homeInsightsEndpoints } from './endpoints/home-insights-endpoints';
import { myGmEndpoints } from './endpoints/mygm-endpoints';
import { scoresEndpoints } from './endpoints/scores-endpoints';

export const teamgmApi = createApi({
  reducerPath: 'teamgmApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['NhlGames', 'MlbGames', 'GameDetail', 'FavoriteTeams', 'HomeInsights', 'MyGm'],
  endpoints: (builder) => ({
    ...scoresEndpoints(builder),
    ...gameDetailEndpoints(builder),
    ...favoriteTeamsEndpoints(builder),
    ...homeInsightsEndpoints(builder),
    ...myGmEndpoints(builder),
  }),
});

export type TeamgmEndpointBuilder = EndpointBuilder<
  ReturnType<typeof fetchBaseQuery>,
  'NhlGames' | 'MlbGames' | 'GameDetail' | 'FavoriteTeams' | 'HomeInsights' | 'MyGm',
  'teamgmApi'
>;

export const {
  useGetNhlGamesQuery,
  useGetMlbGamesQuery,
  useGetGameDetailQuery,
  useGetFavoriteTeamsQuery,
  useToggleFavoriteTeamMutation,
  useGetHomeInsightsQuery,
  useGenerateHomeInsightsMutation,
  useGetMyGmDashboardQuery,
  useGetMyGmPlayerQuery,
} = teamgmApi;
