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

export type HomeInsightPlayerTrend = {
  name: string;
  stat: string;
};

export type TeamHomeInsight = {
  teamKey: string;
  league: MajorLeague;
  teamName: string;
  whyItMatters: string[];
  briefing: {
    team: string;
    summary: string;
    context: string;
  };
  concernLevel: {
    level: number;
    description: string;
  };
  playerTrends: {
    stockUp: HomeInsightPlayerTrend[];
    stockDown: HomeInsightPlayerTrend[];
  };
  recentPerformance: {
    headline: string;
    summary: string;
    wentRight: string;
    wentWrong: string;
  };
};

export type HomeInsightsResponse = {
  status: string;
  generatedAt: string;
  factsAsOf?: string | null;
  source: string;
  insight: TeamHomeInsight;
  nextGame?: {
    id?: number | null;
    status?: string | null;
    scheduledAt?: string | null;
    periodLabel?: string | null;
    venue?: string | null;
    teamScore?: number | null;
    opponentScore?: number | null;
    opponentName?: string | null;
    opponentAbbreviation?: string | null;
    opponentApiSportsTeamId?: number | null;
    location?: string | null;
  } | null;
};
