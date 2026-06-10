import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

import { GameDetailBoxScore } from '@/components/game-detail-box-score';
import { ScreenHeader } from '@/components/screen-header';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { LIVE_SCORES_POLL_INTERVAL_MS } from '@/constants/api';
import { GAME_COPY, LEAGUE_LABELS } from '@/constants/game-copy';
import { Accent } from '@/constants/theme';
import { getRtkErrorMessage, useGetGameDetailQuery, type GameEvent } from '@/store/api';
import type { MajorLeague, MockGame, MockTeamScore } from '@/mock-data/types/scores';
import { splitTeamDisplayName } from '@/utils/split-team-display-name';

type LiveLeague = 'nhl' | 'mlb';

function isLiveLeague(value: string): value is LiveLeague {
  return value === 'nhl' || value === 'mlb';
}

// NHL live clock: "12:34 - 3rd" (matches score list formatting).
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

// Centered status line above the matchup (time, period, or final).
function formatGameDetailTime(game: MockGame): string {
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
  if (game.status === 'live') {
    return GAME_COPY.live;
  }
  return GAME_COPY.final;
}

function formatDetailScore(score: number | null): string {
  return score === null ? '—' : String(score);
}

// City + nickname centered in the outer team column (record below name).
function TeamNamesColumn({ team }: { team: MockTeamScore }) {
  const { city, nickname } = splitTeamDisplayName(team.name);
  const hasRecord = team.record && team.record !== '—';

  return (
    <Box className="flex-1 items-center px-2">
      <VStack className="items-center">
        <Text size="md" bold className="text-center text-teamgm-text-primary">
          {city}
        </Text>
        {nickname ? (
          <Text size="md" bold className="text-center text-teamgm-text-primary">
            {nickname}
          </Text>
        ) : null}
        {hasRecord ? (
          <Text size="sm" className="text-center text-teamgm-text-muted">
            {team.record}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
}

// Time + scores centered vertically between team name and record columns.
function GameDetailMatchupHeader({ game }: { game: MockGame }) {
  const timeLabel = formatGameDetailTime(game);
  const awayScore = formatDetailScore(game.awayTeam.score);
  const homeScore = formatDetailScore(game.homeTeam.score);

  return (
    <HStack className="w-full max-w-md items-center justify-center self-center pt-4">
      <TeamNamesColumn team={game.awayTeam} />
      <VStack className="shrink-0 items-center gap-1 px-3">
        <Text size="md" className="text-center text-teamgm-accent">
          {timeLabel}
        </Text>
        <HStack className="items-center gap-2">
          <Text size="2xl" bold className="tabular-nums text-teamgm-accent">
            {awayScore}
          </Text>
          <Text size="md" bold className="text-teamgm-text-muted">
            {GAME_COPY.versus}
          </Text>
          <Text size="2xl" bold className="tabular-nums text-teamgm-accent">
            {homeScore}
          </Text>
        </HStack>
      </VStack>
      <TeamNamesColumn team={game.homeTeam} />
    </HStack>
  );
}

type StatField = {
  key: string;
  label: string;
};

function formatStatValue(value: unknown): string {
  if (value == null || value === '') {
    return '—';
  }
  return String(value);
}

// Stat rows shared by NHL and MLB team comparison blocks.
function baseStatFields(league: LiveLeague): StatField[] {
  const fields: StatField[] = [
    { key: 'played', label: GAME_COPY.played },
    { key: 'wins', label: GAME_COPY.wins },
    { key: 'losses', label: GAME_COPY.losses },
    { key: 'winPct', label: GAME_COPY.winPct },
  ];

  if (league === 'mlb') {
    fields.push(
      { key: 'runsFor', label: GAME_COPY.runsFor },
      { key: 'runsAgainst', label: GAME_COPY.runsAgainst },
    );
  }

  return fields;
}

// Away vs home team stats in one card (label column + two value columns).
function CombinedTeamStatsBlock({
  league,
  awayTeamName,
  homeTeamName,
  awayStanding,
  homeStanding,
  awayStats,
  homeStats,
}: {
  league: LiveLeague;
  awayTeamName: string;
  homeTeamName: string;
  awayStanding?: string | null;
  homeStanding?: string | null;
  awayStats: Record<string, unknown> | null;
  homeStats: Record<string, unknown> | null;
}) {
  const hasStanding = awayStanding || homeStanding;
  if (!awayStats && !homeStats && !hasStanding) {
    return null;
  }

  const awayLabel = splitTeamDisplayName(awayTeamName).city;
  const homeLabel = splitTeamDisplayName(homeTeamName).city;
  const statFields = baseStatFields(league);
  const labelColumnClass = 'w-28 shrink-0 text-sm text-teamgm-text-muted';
  const teamHeaderClass = 'flex-1 text-center text-teamgm-text-primary';
  const valueCellClass = 'flex-1 text-center tabular-nums text-teamgm-text-primary';

  return (
    <VStack space="sm">
      <Text size="lg" bold className="text-teamgm-text-primary">
        {GAME_COPY.teamStats}
      </Text>
      <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
        <HStack className="mb-2 items-center">
          <Text size="sm" className={labelColumnClass}>{GAME_COPY.teamColumn}</Text>
          <Text size="md" bold className={teamHeaderClass}>{awayLabel}</Text>
          <Text size="md" bold className={teamHeaderClass}>{homeLabel}</Text>
        </HStack>
        {hasStanding ? (
          <HStack className="items-center py-1">
            <Text size="sm" className={labelColumnClass}>{GAME_COPY.standing}</Text>
            <Text size="md" className={valueCellClass}>
              {formatStatValue(awayStanding)}
            </Text>
            <Text size="md" className={valueCellClass}>
              {formatStatValue(homeStanding)}
            </Text>
          </HStack>
        ) : null}
        {statFields.map((field) => (
          <HStack key={field.key} className="items-center py-1">
            <Text size="sm" className={labelColumnClass}>{field.label}</Text>
            <Text size="md" className={valueCellClass}>
              {formatStatValue(awayStats?.[field.key])}
            </Text>
            <Text size="md" className={valueCellClass}>
              {formatStatValue(homeStats?.[field.key])}
            </Text>
          </HStack>
        ))}
      </Box>
    </VStack>
  );
}

function EventsList({ events }: { events: GameEvent[] }) {
  if (!events.length) {
    return null;
  }

  // API returns chronological order — show most recent scoring play first.
  const orderedEvents = [...events].reverse();

  return (
    <VStack space="sm">
      <Text size="md" bold className="text-teamgm-text-primary">
        {GAME_COPY.scoringPlays}
      </Text>
      <VStack space="xs">
        {orderedEvents.map((event, index) => {
          const scorer = event.players?.[0];
          const assistText = event.assists?.length ? ` (${event.assists.join(', ')})` : '';
          const label = [event.period, event.minute ? `${event.minute}'` : null, event.type]
            .filter(Boolean)
            .join(' · ');

          return (
            <Box
              key={`${event.period}-${event.minute}-${index}`}
              className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
              <Text size="sm" className="text-teamgm-text-muted">
                {label}
              </Text>
              <Text size="md" className="text-teamgm-text-primary">
                {event.teamName}: {scorer}
                {assistText}
              </Text>
              {event.comment ? (
                <Text size="sm" className="text-teamgm-text-muted">
                  {event.comment}
                </Text>
              ) : null}
            </Box>
          );
        })}
      </VStack>
    </VStack>
  );
}

export default function GameDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ league: string; id: string }>();
  const leagueParam = params.league ?? '';
  const gameId = params.id ?? '';

  const isSupported = isLiveLeague(leagueParam);
  const gameDetailArgs = { league: leagueParam as LiveLeague, id: gameId };
  const skipGameDetail = !isSupported || !gameId;

  const { data, error, isLoading, refetch } = useGetGameDetailQuery(gameDetailArgs, {
    skip: skipGameDetail,
  });

  const shouldPollGameDetail = data?.game?.status !== 'final';

  // RTK pollingInterval is unreliable with a second hook — refetch on an interval instead.
  useEffect(() => {
    if (skipGameDetail || !shouldPollGameDetail) {
      return;
    }
    const intervalId = setInterval(() => {
      void refetch();
    }, LIVE_SCORES_POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [skipGameDetail, shouldPollGameDetail, refetch]);

  const title = useMemo(() => {
    if (!data?.game) {
      return LEAGUE_LABELS[leagueParam as MajorLeague] ?? 'Game';
    }
    return `${data.game.awayTeam.abbreviation} @ ${data.game.homeTeam.abbreviation}`;
  }, [data?.game, leagueParam]);

  const errorMessage = !isSupported
    ? GAME_COPY.notFound
    : error
      ? getRtkErrorMessage(error, GAME_COPY.loadError)
      : null;

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={title} onBack={onBack} />

      {isLoading ? (
        <VStack className="flex-1 items-center justify-center">
          <ActivityIndicator color={Accent} />
          <Text size="md" className="mt-3 text-teamgm-text-muted">
            {GAME_COPY.loading}
          </Text>
        </VStack>
      ) : errorMessage ? (
        <VStack className="flex-1 px-4">
          <Text size="md" className="text-teamgm-accent">
            {errorMessage}
          </Text>
        </VStack>
      ) : data ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow-0 gap-4 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 0 }}>
          <GameDetailMatchupHeader game={data.game} />

          <GameDetailBoxScore
            league={leagueParam as LiveLeague}
            boxScore={data.boxScore}
            awayTeamName={data.game.awayTeam.name}
            homeTeamName={data.game.homeTeam.name}
          />

          <CombinedTeamStatsBlock
            league={leagueParam as LiveLeague}
            awayTeamName={data.game.awayTeam.name}
            homeTeamName={data.game.homeTeam.name}
            awayStanding={data.game.awayTeam.standing}
            homeStanding={data.game.homeTeam.standing}
            awayStats={data.teamStats.away}
            homeStats={data.teamStats.home}
          />

          {data.events?.length ? <EventsList events={data.events} /> : null}

          {!data.playerStatsAvailable ? (
            <Text size="md" className="text-teamgm-text-muted">
              {data.message ?? GAME_COPY.playerStatsNote}
            </Text>
          ) : null}
        </ScrollView>
      ) : null}
    </VStack>
  );
}
