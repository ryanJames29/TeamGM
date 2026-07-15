import type { MajorLeague, MockGame } from '@/mock-data/types/scores';
import type { Database } from '@/types/supabase/rawDatabase.types';

export type MyGmCapSummary =
  Database['public']['Views']['nhl_team_cap_summary']['Row'];
export type MyGmRosterPlayer =
  Database['public']['Views']['nhl_roster_with_contracts']['Row'];
export type MyGmStaffMember =
  Database['public']['Views']['nhl_team_staff_current']['Row'];
export type MyGmPlayerStats =
  Database['public']['Tables']['nhl_player_season_stats']['Row'];

export type MyGmDashboard = {
  capSummary: MyGmCapSummary | null;
  roster: MyGmRosterPlayer[];
  staff: MyGmStaffMember[];
};

export type MyGmPlayerDetail = {
  player: MyGmRosterPlayer | null;
  stats: MyGmPlayerStats | null;
};

export type MyGmPlayerQueryArgs = {
  playerId: string;
  seasonId: string;
};

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
  recentPerformance: {
    headline: string;
    lastGameSummary: string;
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
