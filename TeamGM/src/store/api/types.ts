import type { MajorLeague, MockGame } from '@/mock-data/types/scores';

export type FavoriteTeamRow = {
  id: string;
  user_id: string;
  league: MajorLeague;
  api_sports_team_id: number;
  team_name: string;
  team_abbreviation: string;
  created_at: string;
};

export type LeagueScoresResponse = {
  status: string;
  message: string;
  date?: string;
  league?: {
    id?: number;
    name?: string;
    logo?: string;
    season?: number;
  };
  games: MockGame[];
};

export type NhlScoresResponse = LeagueScoresResponse;
export type MlbScoresResponse = LeagueScoresResponse;

export type GameEvent = {
  period?: string | null;
  minute?: string | null;
  type?: string | null;
  comment?: string | null;
  teamName?: string | null;
  players?: string[];
  assists?: string[];
};

export type GameDetailResponse = {
  status: string;
  source: string;
  game: MockGame;
  boxScore: Record<string, unknown>;
  teamStats: {
    away: Record<string, unknown> | null;
    home: Record<string, unknown> | null;
  };
  events?: GameEvent[];
  playerStatsAvailable: boolean;
  message?: string | null;
};
