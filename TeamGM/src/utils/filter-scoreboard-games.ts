import type { MockGame } from '@/mock-data/types/scores';

function utcDayStartMs(value: Date): number {
  return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}

function gameDayMs(game: MockGame): number | null {
  if (!game.scheduledAt) {
    return null;
  }
  const ms = new Date(game.scheduledAt).getTime();
  return Number.isNaN(ms) ? null : utcDayStartMs(new Date(game.scheduledAt));
}

function teamNames(game: MockGame): string[] {
  return [game.awayTeam.name, game.homeTeam.name];
}

/**
 * 1. Today's games (live, final, scheduled) + any still-live from earlier.
 * 2. Tomorrow's scheduled games where neither team plays today.
 */
export function filterScoreboardGames(games: MockGame[]): MockGame[] {
  const todayMs = utcDayStartMs(new Date());
  const tomorrowMs = todayMs + 24 * 60 * 60 * 1000;

  const playingToday = new Set<string>();
  const todayGames: MockGame[] = [];

  for (const game of games) {
    if (game.status === 'live') {
      todayGames.push(game);
      teamNames(game).forEach((name) => playingToday.add(name));
      continue;
    }

    if (gameDayMs(game) === todayMs) {
      todayGames.push(game);
      teamNames(game).forEach((name) => playingToday.add(name));
    }
  }

  const todayIds = new Set(todayGames.map((game) => game.id));
  const tomorrowRest: MockGame[] = [];

  for (const game of games) {
    if (todayIds.has(game.id)) {
      continue;
    }
    if (game.status !== 'scheduled' || gameDayMs(game) !== tomorrowMs) {
      continue;
    }
    if (teamNames(game).every((name) => !playingToday.has(name))) {
      tomorrowRest.push(game);
    }
  }

  return [...todayGames, ...tomorrowRest];
}
