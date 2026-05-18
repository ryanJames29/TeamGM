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

function getStatusLabel(game: MockGame): string {
  if (game.periodLabel) {
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
