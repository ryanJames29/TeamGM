import React, { useMemo } from 'react';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { API_BASE_URL } from '@/constants/api';
import { LEAGUE_LABELS } from '@/constants/game-copy';
import type { MockGame } from '@/mock-data/types/scores';
import {
  useGetMlbGamesQuery,
  useGetNhlGamesQuery,
  type FavoriteTeamRow,
} from '@/store/api';

type NextGameInfo = {
  matchup: string;
  when: string;
};

export type FavoriteTeamsSectionProps = {
  favorites: FavoriteTeamRow[];
  isLoading: boolean;
  errorMessage: string | null;
  sectionTitle: string;
  loadingMessage: string;
  emptyMessage: string;
};

// Stable key for favorite team lookups
function favoriteKey(team: FavoriteTeamRow): string {
  return `${team.league}-${team.api_sports_team_id}`;
}

// Timestamp used to sort upcoming games
function scheduledTimestamp(game: MockGame): number {
  if (!game.scheduledAt) {
    return Number.POSITIVE_INFINITY;
  }

  const ms = new Date(game.scheduledAt).getTime();
  return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
}

// Whether a cached game involves the given API-Sports team id
function gameInvolvesTeam(game: MockGame, teamId: number): boolean {
  return game.awayTeam.id === teamId || game.homeTeam.id === teamId;
}

// Next live or scheduled game for a team from a league game list
function pickNextGame(games: MockGame[], teamId: number): MockGame | null {
  const upcoming = games.filter(
    (game) =>
      (game.status === 'live' || game.status === 'scheduled') && gameInvolvesTeam(game, teamId),
  );

  upcoming.sort((a, b) => scheduledTimestamp(a) - scheduledTimestamp(b));
  return upcoming[0] ?? null;
}

// Build matchup + local time strings for a favorite's next game
function buildNextGameInfo(favorite: FavoriteTeamRow, game: MockGame): NextGameInfo {
  const teamId = favorite.api_sports_team_id;
  const isAway = game.awayTeam.id === teamId;
  const opponent = isAway ? game.homeTeam : game.awayTeam;
  const symbol = isAway ? '@' : 'vs';
  const teamLabel = favorite.team_abbreviation || favorite.team_name;
  const opponentLabel = opponent.abbreviation || opponent.name;

  const when = game.scheduledAt
    ? new Date(game.scheduledAt).toLocaleString(undefined, {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return {
    matchup: `${teamLabel} ${symbol} ${opponentLabel}`,
    when,
  };
}

// Map each favorite to its next-game display info
function buildNextGameMap(
  favorites: FavoriteTeamRow[],
  nhlGames: MockGame[] | undefined,
  mlbGames: MockGame[] | undefined,
): Map<string, NextGameInfo> {
  const map = new Map<string, NextGameInfo>();

  for (const favorite of favorites) {
    if (favorite.api_sports_team_id == null) {
      continue;
    }

    const leagueGames = favorite.league === 'nhl' ? nhlGames : favorite.league === 'mlb' ? mlbGames : undefined;
    if (!Array.isArray(leagueGames)) {
      continue;
    }

    const nextGame = pickNextGame(leagueGames, favorite.api_sports_team_id);
    if (!nextGame) {
      continue;
    }

    map.set(favoriteKey(favorite), buildNextGameInfo(favorite, nextGame));
  }

  return map;
}

// Load full game windows and index next games for favorite cards
function useFavoriteNextGames(favorites: FavoriteTeamRow[]): Map<string, NextGameInfo> {
  const hasLiveApi = Boolean(API_BASE_URL);
  const wantsNhlGames = favorites.some((team) => team.league === 'nhl');
  const wantsMlbGames = favorites.some((team) => team.league === 'mlb');

  const { data: nhlData } = useGetNhlGamesQuery(
    { view: 'window' },
    { skip: !hasLiveApi || !wantsNhlGames },
  );
  const { data: mlbData } = useGetMlbGamesQuery(
    { view: 'window' },
    { skip: !hasLiveApi || !wantsMlbGames },
  );

  return useMemo(
    () => buildNextGameMap(favorites, nhlData?.games, mlbData?.games),
    [favorites, mlbData?.games, nhlData?.games],
  );
}

type FavoriteTeamCardProps = {
  team: FavoriteTeamRow;
  nextGame: NextGameInfo | null;
};

// Single favorite team tile with optional next-game block
function FavoriteTeamCard({ team, nextGame }: FavoriteTeamCardProps) {
  return (
    <Box className="w-[48%] rounded-xl border border-teamgm-border bg-teamgm-secondary p-3">
      <Box className="mb-2 self-start rounded bg-teamgm-surface px-2 py-1">
        <Text size="xs" className="text-teamgm-text-primary">
          {LEAGUE_LABELS[team.league]}
        </Text>
      </Box>
      <Text size="sm" bold className="mb-1 text-teamgm-text-primary">
        {team.team_name}
      </Text>
      <Text size="xs" className="text-teamgm-text-muted">
        {team.team_abbreviation}
      </Text>
      {nextGame ? (
        <Box className="mt-3 rounded-lg border border-teamgm-border bg-teamgm-surface p-2">
          <Text size="xs" className="mb-1 text-teamgm-text-primary">
            {nextGame.matchup}
          </Text>
          <Text size="xs" className="text-teamgm-text-muted">
            {nextGame.when}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

// Your Teams grid: favorites list + next-game lookup + card rendering
export function FavoriteTeamsSection({
  favorites,
  isLoading,
  errorMessage,
  sectionTitle,
  loadingMessage,
  emptyMessage,
}: FavoriteTeamsSectionProps) {
  const nextGameByKey = useFavoriteNextGames(favorites);

  return (
    <VStack space="xs">
      <Text size="sm" bold className="text-teamgm-text-primary">
        {sectionTitle}
      </Text>
      <Box className="flex-row flex-wrap gap-2">
        {isLoading ? (
          <Text size="sm" className="text-teamgm-text-muted">
            {loadingMessage}
          </Text>
        ) : errorMessage ? (
          <Text size="sm" className="text-teamgm-accent">
            {errorMessage}
          </Text>
        ) : favorites.length === 0 ? (
          <Text size="sm" className="text-teamgm-text-muted">
            {emptyMessage}
          </Text>
        ) : (
          favorites.map((team) => (
            <FavoriteTeamCard
              key={favoriteKey(team)}
              team={team}
              nextGame={nextGameByKey.get(favoriteKey(team)) ?? null}
            />
          ))
        )}
      </Box>
    </VStack>
  );
}
