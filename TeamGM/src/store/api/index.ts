export {
  teamgmApi,
  useGetFavoriteTeamsQuery,
  useGetGameDetailQuery,
  useGetMlbGamesQuery,
  useGetNhlGamesQuery,
  useToggleFavoriteTeamMutation,
} from './teamgm-api';

export type { ToggleFavoriteTeamArgs } from './endpoints/favorite-teams-endpoints';
export type {
  FavoriteTeamRow,
  GameDetailResponse,
  GameEvent,
  LeagueScoresResponse,
  MlbScoresResponse,
  NhlScoresResponse,
} from './types';

export { getRtkErrorMessage } from './get-rtk-error-message';
