import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable } from 'react-native';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Info, TextPrimary } from '@/constants/theme';
import type { GameStatus, MockGame, MockTeamScore } from '@/mock-data/types/scores';
import { HStack } from '@/components/ui/hstack';

type GameScoreBoxProps = {
  game: MockGame;
  onFavoriteTeam?: (team: MockTeamScore) => void;
  isFavoriteTeam?: (teamId: number | undefined) => boolean;
  isInteractive?: boolean;
};

function formatScore(score: number | null): string {
  return score === null ? '—' : String(score);
}

function formatTeamRecord(team: MockTeamScore): string {
  return team.record || '—';
}

/** NHL live clock: "12:34 - 3rd". Also normalizes legacy mock "3rd 12:34". */
function formatHockeyPeriodLabel(periodLabel: string): string {
  const trimmed = periodLabel.trim();
  if (trimmed === 'Final' || trimmed === 'Cancelled') {
    return trimmed;
  }

  if (trimmed === 'Intermission' || /break\s*time/i.test(trimmed)) {
    return 'Intermission';
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
    awayRecordLabel: formatTeamRecord(game.awayTeam),
    homeRecordLabel: formatTeamRecord(game.homeTeam),
    statusLabel: getStatusLabel(game),
    statusTextClass: getStatusTextClass(game.status),
  };
}

type TeamScoreRowProps = {
  teamName: string;
  scoreLabel: string;
  recordLabel: string;
  isWinner: boolean;
  showFavorite: boolean;
  isFavorite: boolean;
  onFavoritePress?: () => void;
};

function TeamScoreRow({
  teamName,
  scoreLabel,
  recordLabel,
  isWinner,
  showFavorite,
  isFavorite,
  onFavoritePress,
}: TeamScoreRowProps) {
  return (
    <HStack className="items-center gap-2">
      {showFavorite ? (
        <Pressable
          onPress={onFavoritePress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove favorite team' : 'Favorite team'}
          className="w-6 shrink-0">
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={18}
            color={isFavorite ? TextPrimary : Info}
          />
        </Pressable>
      ) : (
        <Box className="w-6 shrink-0" />
      )}
      <Text bold={isWinner} isTruncated className="min-w-0 flex-1 text-teamgm-text-primary">
        {teamName}
      </Text>
      <HStack className="shrink-0 items-center gap-3">
        <Text
          bold={isWinner}
          className="w-6 text-right tabular-nums text-teamgm-text-primary">
          {scoreLabel}
        </Text>
        <Text
          size="sm"
          className="min-w-[72px] text-left tabular-nums text-teamgm-text-muted">
          {recordLabel}
        </Text>
      </HStack>
    </HStack>
  );
}

export function GameScoreBox({
  game,
  onFavoriteTeam,
  isFavoriteTeam,
  isInteractive = true,
}: GameScoreBoxProps) {
  const router = useRouter();
  const display = getGameScoreDisplay(game);

  const canOpenDetail = isInteractive && (game.league === 'nhl' || game.league === 'mlb');
  const showFavorite = Boolean(onFavoriteTeam && isFavoriteTeam);

  const onOpenGame = useCallback(() => {
    if (!canOpenDetail) {
      return;
    }
    router.push(`/game/${game.league}/${game.id}`);
  }, [canOpenDetail, game.id, game.league, router]);

  const card = (
    <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-4">
      <VStack space="sm" className="items-stretch">
        <TeamScoreRow
          teamName={display.awayTeamName}
          scoreLabel={display.awayScoreLabel}
          recordLabel={display.awayRecordLabel}
          isWinner={display.awayWins}
          showFavorite={showFavorite}
          isFavorite={isFavoriteTeam?.(game.awayTeam.id) ?? false}
          onFavoritePress={() => onFavoriteTeam?.(game.awayTeam)}
        />
        <TeamScoreRow
          teamName={display.homeTeamName}
          scoreLabel={display.homeScoreLabel}
          recordLabel={display.homeRecordLabel}
          isWinner={display.homeWins}
          showFavorite={showFavorite}
          isFavorite={isFavoriteTeam?.(game.homeTeam.id) ?? false}
          onFavoritePress={() => onFavoriteTeam?.(game.homeTeam)}
        />
        <Text size="sm" bold className={`self-start pl-0.5 ${display.statusTextClass}`}>
          {display.statusLabel}
        </Text>
      </VStack>
    </Box>
  );

  if (!canOpenDetail) {
    return card;
  }

  return (
    <Pressable onPress={onOpenGame} accessibilityRole="button">
      {card}
    </Pressable>
  );
}
