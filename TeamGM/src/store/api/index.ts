export {
  teamgmApi,
  useGenerateHomeInsightsMutation,
  useGetFavoriteTeamsQuery,
  useGetGameDetailQuery,
  useGetHomeInsightsQuery,
  useGetMlbGamesQuery,
  useGetNhlGamesQuery,
  useToggleFavoriteTeamMutation,
} from './teamgm-api';

export { homeInsightsApiEnabled } from './endpoints/home-insights-endpoints';
export type { ToggleFavoriteTeamArgs } from './endpoints/favorite-teams-endpoints';
export type {
  FavoriteTeamRow,
  GameDetailResponse,
  GameEvent,
  HomeInsightsResponse,
  LeagueScoresResponse,
  MlbScoresResponse,
  NhlScoresResponse,
  TeamHomeInsight,
} from './types';

export { getRtkErrorMessage } from './get-rtk-error-message';
