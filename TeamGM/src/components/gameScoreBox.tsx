import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { GameStatus, MockGame } from '@/mock-data/types/scores';
import { HStack } from '@/components/ui/hstack';

type GameScoreBoxProps = {
  game: MockGame;
};

function formatScore(score: number | null): string {
  return score === null ? '—' : String(score);
}

/** NHL live clock: "12:34 - 3rd". Also normalizes legacy mock "3rd 12:34". */
function formatHockeyPeriodLabel(periodLabel: string): string {
  const trimmed = periodLabel.trim();
  if (trimmed === 'Final' || trimmed === 'Cancelled') {
    return trimmed;
  }

  if (/^\d{1,2}:\d{2}\s*-\s*(1st|2nd|3rd|OT|SO)$/i.test(trimmed)) {
    return trimmed;
  }

  const legacy = trimmed.match(/^((?:\d{1,2}(?:st|nd|rd|th))|OT|SO)\s+(\d{1,2}:\d{2})$/i);
  if (legacy) {
    return `${legacy[2]} - ${legacy[1]}`;
  }

  const periodOnly = trimmed.match(/^(First|Second|Third)\s+Period$/i);
  if (periodOnly) {
    const map: Record<string, string> = { first: '1st', second: '2nd', third: '3rd' };
    return map[periodOnly[1].toLowerCase()] ?? trimmed;
  }

  return trimmed;
}

function getStatusLabel(game: MockGame): string {
  if (game.periodLabel) {
    if (game.league === 'nhl') {
      return formatHockeyPeriodLabel(game.periodLabel);
    }
    return game.periodLabel;
  }

  if (game.status === 'scheduled' && game.scheduledAt) {
    return new Date(game.scheduledAt).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return game.status === 'live' ? 'Live' : 'Final';
}

function getStatusTextClass(status: GameStatus): string {
  if (status === 'scheduled') {
    return 'text-teamgm-info';
  }

  return 'text-teamgm-accent';
}

function getGameScoreDisplay(game: MockGame) {
  const awayScore = game.awayTeam.score;
  const homeScore = game.homeTeam.score;
  const hasScores = awayScore !== null && homeScore !== null;

  return {
    awayWins: hasScores && awayScore > homeScore,
    homeWins: hasScores && homeScore > awayScore,
    awayTeamName: game.awayTeam.name,
    homeTeamName: game.homeTeam.name,
    awayScoreLabel: formatScore(awayScore),
    homeScoreLabel: formatScore(homeScore),
    awayRecordLabel: game.awayTeam.record,
    homeRecordLabel: game.homeTeam.record,
    statusLabel: getStatusLabel(game),
    statusTextClass: getStatusTextClass(game.status),
  };
}

export function GameScoreBox({ game }: GameScoreBoxProps) {
  const display = getGameScoreDisplay(game);

  return (
    <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-4">
      <VStack space="sm">
        <HStack className="items-center justify-between gap-3">
          <Text
            bold={display.awayWins}
            isTruncated
            className="min-w-0 flex-1 text-teamgm-text-primary">
            {display.awayTeamName}
          </Text>
          <HStack className="shrink-0 items-center gap-2">
            <Text bold={display.awayWins} className="text-teamgm-text-primary">
              {display.awayScoreLabel}
            </Text>
            <Text size="sm" className="text-teamgm-text-muted">
              {display.awayRecordLabel}
            </Text>
          </HStack>
        </HStack>
        <HStack className="items-center justify-between gap-3">
          <Text
            bold={display.homeWins}
            isTruncated
            className="min-w-0 flex-1 text-teamgm-text-primary">
            {display.homeTeamName}
          </Text>
          <HStack className="shrink-0 items-center gap-2">
            <Text bold={display.homeWins} className="text-teamgm-text-primary">
              {display.homeScoreLabel}
            </Text>
            <Text size="sm" className="text-teamgm-text-muted">
              {display.homeRecordLabel}
            </Text>
          </HStack>
        </HStack>
        <Text size="sm" bold className={display.statusTextClass}>
          {display.statusLabel}
        </Text>
      </VStack>
    </Box>
  );
}
