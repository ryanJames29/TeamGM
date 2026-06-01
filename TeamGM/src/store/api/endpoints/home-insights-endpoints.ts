import { API_BASE_URL } from '@/constants/api';

import type { HomeInsightsResponse } from '../types';
import type { TeamgmEndpointBuilder } from '../teamgm-api';

// Home tab AI insights from the FastAPI backend (OpenAI + Redis facts)
export function homeInsightsEndpoints(builder: TeamgmEndpointBuilder) {
  return {
    getHomeInsights: builder.query<HomeInsightsResponse, string>({
      query: (userId) => ({
        url: '/api/v1/insights/home',
        params: { user_id: userId },
      }),
      providesTags: (_result, _error, userId) => [{ type: 'HomeInsights' as const, id: userId }],
    }),
    generateHomeInsights: builder.mutation<HomeInsightsResponse, string>({
      query: (userId) => ({
        url: '/api/v1/insights/home/generate',
        method: 'POST',
        params: { user_id: userId },
      }),
      invalidatesTags: (_result, _error, userId) => [{ type: 'HomeInsights' as const, id: userId }],
    }),
  };
}

export const homeInsightsApiEnabled = Boolean(API_BASE_URL);
