import type { MockGame } from '@/mock-data/types/scores';

export type NhlScoresResponse = {
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
