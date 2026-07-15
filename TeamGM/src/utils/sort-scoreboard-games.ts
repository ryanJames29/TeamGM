import type { GameStatus, MockGame } from '@/mock-data/types/scores';

const STATUS_SORT_ORDER: Record<GameStatus, number> = {
  live: 0,
  scheduled: 1,
  final: 2,
};

function scheduledTimestamp(game: MockGame): number {
  if (!game.scheduledAt) {
    return 0;
  }
  const ms = new Date(game.scheduledAt).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

// Whether either side of the game is a user favorite.
function involvesFavoriteTeam(game: MockGame, favoriteTeamIds: Set<number>): boolean {
  const awayId = game.awayTeam.id;
  const homeId = game.homeTeam.id;
  return (
    (awayId != null && favoriteTeamIds.has(awayId)) ||
    (homeId != null && favoriteTeamIds.has(homeId))
  );
}

/** Favorite teams first, then live → upcoming → finals within each group. */
export function sortScoreboardGames(
  games: MockGame[],
  favoriteTeamIds?: Iterable<number>,
): MockGame[] {
  const favorites = new Set(favoriteTeamIds ?? []);

  return [...games].sort((a, b) => {
    if (favorites.size > 0) {
      const aIsFavorite = involvesFavoriteTeam(a, favorites);
      const bIsFavorite = involvesFavoriteTeam(b, favorites);
      if (aIsFavorite !== bIsFavorite) {
        return aIsFavorite ? -1 : 1;
      }
    }

    const priorityA = STATUS_SORT_ORDER[a.status] ?? 3;
    const priorityB = STATUS_SORT_ORDER[b.status] ?? 3;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const timeA = scheduledTimestamp(a);
    const timeB = scheduledTimestamp(b);

    if (a.status === 'scheduled') {
      return timeA - timeB;
    }

    return timeB - timeA;
  });
}
