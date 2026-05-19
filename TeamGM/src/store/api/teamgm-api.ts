import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL, API_NHL_GAMES_PATH } from '@/constants/api';

import type { NhlScoresResponse } from './types';

export const teamgmApi = createApi({
  reducerPath: 'teamgmApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['NhlGames'],
  endpoints: (builder) => ({
    getNhlGames: builder.query<NhlScoresResponse, string | void>({
      query: (centerDate) => ({
        url: API_NHL_GAMES_PATH,
        params: centerDate ? { date: centerDate } : undefined,
      }),
      transformResponse: (response: NhlScoresResponse) => ({
        ...response,
        games: Array.isArray(response.games) ? response.games : [],
      }),
      providesTags: ['NhlGames'],
      keepUnusedDataFor: 120,
    }),
  }),
});

export const { useGetNhlGamesQuery } = teamgmApi;
