export const MAJOR_LEAGUES = ['nfl', 'nba', 'mlb', 'nhl'] as const;

export type MajorLeague = (typeof MAJOR_LEAGUES)[number];

export type GameStatus = 'scheduled' | 'live' | 'final';

export type MockTeamScore = {
  name: string;
  abbreviation: string;
  score: number | null;
};

export type MockGame = {
  id: string;
  league: MajorLeague;
  status: GameStatus;
  periodLabel: string | null;
  scheduledAt: string | null;
  venue: string;
  awayTeam: MockTeamScore;
  homeTeam: MockTeamScore;
};

export type MockGamesByLeague = Record<MajorLeague, MockGame[]>;
