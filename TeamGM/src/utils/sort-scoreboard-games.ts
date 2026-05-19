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

/** Live games first, then upcoming, then finals. */
export function sortScoreboardGames(games: MockGame[]): MockGame[] {
  return [...games].sort((a, b) => {
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
