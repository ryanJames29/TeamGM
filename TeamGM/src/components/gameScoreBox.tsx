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
    awayAbbreviation: game.awayTeam.abbreviation,
    homeAbbreviation: game.homeTeam.abbreviation,
    awayScoreLabel: formatScore(awayScore),
    homeScoreLabel: formatScore(homeScore),
    statusLabel: getStatusLabel(game),
    statusTextClass: getStatusTextClass(game.status),
  };
}

export function GameScoreBox({ game }: GameScoreBoxProps) {
  const display = getGameScoreDisplay(game);

  return (
    <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-4">
      <VStack space="sm">
        <HStack className="items-center justify-between">
          <Text bold={display.awayWins} className="text-teamgm-text-primary">
            {display.awayAbbreviation}
          </Text>
          <Text bold={display.awayWins} className="text-teamgm-text-primary">
            {display.awayScoreLabel}
          </Text>
        </HStack>
        <HStack className="items-center justify-between">
          <Text bold={display.homeWins} className="text-teamgm-text-primary">
            {display.homeAbbreviation}
          </Text>
          <Text bold={display.homeWins} className="text-teamgm-text-primary">
            {display.homeScoreLabel}
          </Text>
        </HStack>
        <Text size="sm" bold className={display.statusTextClass}>
          {display.statusLabel}
        </Text>
      </VStack>
    </Box>
  );
}
