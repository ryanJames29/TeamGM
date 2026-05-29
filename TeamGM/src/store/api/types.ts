import type { MockGame } from '@/mock-data/types/scores';

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
