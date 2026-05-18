import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { MockGame, MockTeamScore } from '@/mock-data/types/scores';

type GameScoreBoxProps = {
  game: MockGame;
};

type TeamRowProps = {
  team: MockTeamScore;
  isWinner: boolean;
};

// Renders a dash when score is not yet available
function formatScore(score: number | null): string {
  return score === null ? '—' : String(score);
}

// Picks period text, final label, or scheduled start time for the footer
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

// Single team abbreviation and score row
function TeamRow({ team, isWinner }: TeamRowProps) {
  return (
    <Box className="flex-row items-center justify-between">
      <Text bold={isWinner} className="text-teamgm-text-primary">
        {team.abbreviation}
      </Text>
      <Text bold={isWinner} className="text-teamgm-text-primary">
        {formatScore(team.score)}
      </Text>
    </Box>
  );
}

// Score card for one game
export function GameScoreBox({ game }: GameScoreBoxProps) {
  const awayScore = game.awayTeam.score;
  const homeScore = game.homeTeam.score;
  const hasScores = awayScore !== null && homeScore !== null;
  const awayWins = hasScores && awayScore > homeScore;
  const homeWins = hasScores && homeScore > awayScore;
  const statusIsLive = game.status === 'live';

  return (
    <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-4">
      <VStack space="sm">
        <Text size="xs" className="uppercase text-teamgm-text-muted">
          {game.league}
        </Text>
        <TeamRow team={game.awayTeam} isWinner={awayWins} />
        <TeamRow team={game.homeTeam} isWinner={homeWins} />
        <Text
          size="xs"
          className={statusIsLive ? 'text-teamgm-accent' : 'text-teamgm-text-muted'}>
          {getStatusLabel(game)}
        </Text>
      </VStack>
    </Box>
  );
}
