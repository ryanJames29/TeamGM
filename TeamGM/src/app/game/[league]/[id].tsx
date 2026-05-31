import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView } from 'react-native';

import { GameScoreBox } from '@/components/gameScoreBox';
import { ScreenHeader } from '@/components/screen-header';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { GAME_COPY, LEAGUE_LABELS } from '@/constants/game-copy';
import { Accent, Info } from '@/constants/theme';
import { getRtkErrorMessage, useGetGameDetailQuery, type GameEvent } from '@/store/api';
import type { MajorLeague } from '@/mock-data/types/scores';

type LiveLeague = 'nhl' | 'mlb';

function isLiveLeague(value: string): value is LiveLeague {
  return value === 'nhl' || value === 'mlb';
}

function StatRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  const display = value == null || value === '' ? '—' : String(value);

  return (
    <HStack className="justify-between py-1">
      <Text size="sm" className="text-teamgm-text-muted">
        {label}
      </Text>
      <Text size="sm" className="text-teamgm-text-primary">
        {display}
      </Text>
    </HStack>
  );
}

function BoxScoreTable({
  league,
  boxScore,
  awayName,
  homeName,
}: {
  league: LiveLeague;
  boxScore: Record<string, unknown>;
  awayName: string;
  homeName: string;
}) {
  const rows =
    league === 'mlb'
      ? (boxScore.innings as Array<{ label: string; away: number | null; home: number | null }> | undefined)
      : (boxScore.periods as Array<{ label: string; away: number | null; home: number | null }> | undefined);

  const awayTotal =
    league === 'mlb'
      ? (boxScore.away as { runs?: number | null } | undefined)?.runs
      : (boxScore.away as { goals?: number | null } | undefined)?.goals;
  const homeTotal =
    league === 'mlb'
      ? (boxScore.home as { runs?: number | null } | undefined)?.runs
      : (boxScore.home as { goals?: number | null } | undefined)?.goals;

  if (!rows?.length) {
    return null;
  }

  return (
    <VStack space="sm">
      <Text size="sm" bold className="text-teamgm-text-primary">
        {GAME_COPY.boxScore}
      </Text>
      <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
        <HStack className="mb-2 justify-between">
          <Text size="xs" className="w-10 text-teamgm-text-muted" />
          <Text size="xs" bold className="flex-1 text-center text-teamgm-text-primary">
            {awayName}
          </Text>
          <Text size="xs" bold className="flex-1 text-center text-teamgm-text-primary">
            {homeName}
          </Text>
        </HStack>
        {rows.map((row) => (
          <HStack key={row.label} className="justify-between py-0.5">
            <Text size="xs" className="w-10 text-teamgm-text-muted">
              {row.label}
            </Text>
            <Text size="xs" className="flex-1 text-center tabular-nums text-teamgm-text-primary">
              {row.away ?? '—'}
            </Text>
            <Text size="xs" className="flex-1 text-center tabular-nums text-teamgm-text-primary">
              {row.home ?? '—'}
            </Text>
          </HStack>
        ))}
        <HStack className="mt-2 justify-between border-t border-teamgm-border pt-2">
          <Text size="xs" bold className="w-10 text-teamgm-text-muted">
            T
          </Text>
          <Text size="xs" bold className="flex-1 text-center tabular-nums text-teamgm-text-primary">
            {awayTotal ?? '—'}
          </Text>
          <Text size="xs" bold className="flex-1 text-center tabular-nums text-teamgm-text-primary">
            {homeTotal ?? '—'}
          </Text>
        </HStack>
        {league === 'mlb' ? (
          <HStack className="mt-2 justify-between">
            <Text size="xs" className="text-teamgm-text-muted">
              {GAME_COPY.hits}
            </Text>
            <Text size="xs" className="text-teamgm-text-primary">
              {(boxScore.away as { hits?: number })?.hits ?? '—'} /{' '}
              {(boxScore.home as { hits?: number })?.hits ?? '—'}
            </Text>
            <Text size="xs" className="text-teamgm-text-muted">
              {GAME_COPY.errors}
            </Text>
            <Text size="xs" className="text-teamgm-text-primary">
              {(boxScore.away as { errors?: number })?.errors ?? '—'} /{' '}
              {(boxScore.home as { errors?: number })?.errors ?? '—'}
            </Text>
          </HStack>
        ) : null}
      </Box>
    </VStack>
  );
}

function TeamStatsBlock({
  teamName,
  stats,
  league,
}: {
  teamName: string;
  stats: Record<string, unknown> | null;
  league: LiveLeague;
}) {
  if (!stats) {
    return null;
  }

  return (
    <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
      <Text size="sm" bold className="mb-2 text-teamgm-text-primary">
        {teamName}
      </Text>
      <StatRow label={GAME_COPY.played} value={stats.played as number | undefined} />
      <StatRow label={GAME_COPY.wins} value={stats.wins as number | undefined} />
      <StatRow label={GAME_COPY.losses} value={stats.losses as number | undefined} />
      <StatRow label={GAME_COPY.winPct} value={stats.winPct as string | undefined} />
      {league === 'mlb' ? (
        <>
          <StatRow label={GAME_COPY.runsFor} value={stats.runsFor as number | undefined} />
          <StatRow label={GAME_COPY.runsAgainst} value={stats.runsAgainst as number | undefined} />
        </>
      ) : (
        <>
          <StatRow label={GAME_COPY.goalsFor} value={stats.goalsFor as number | undefined} />
          <StatRow label={GAME_COPY.goalsAgainst} value={stats.goalsAgainst as number | undefined} />
        </>
      )}
    </Box>
  );
}

function EventsList({ events }: { events: GameEvent[] }) {
  if (!events.length) {
    return null;
  }

  return (
    <VStack space="sm">
      <Text size="sm" bold className="text-teamgm-text-primary">
        {GAME_COPY.scoringPlays}
      </Text>
      <VStack space="xs">
        {events.map((event, index) => {
          const scorer = event.players?.[0];
          const assistText = event.assists?.length ? ` (${event.assists.join(', ')})` : '';
          const label = [event.period, event.minute ? `${event.minute}'` : null, event.type]
            .filter(Boolean)
            .join(' · ');

          return (
            <Box
              key={`${event.period}-${event.minute}-${index}`}
              className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
              <Text size="xs" className="text-teamgm-text-muted">
                {label}
              </Text>
              <Text size="sm" className="text-teamgm-text-primary">
                {event.teamName}: {scorer}
                {assistText}
              </Text>
              {event.comment ? (
                <Text size="xs" className="text-teamgm-text-muted">
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
  const { data, error, isLoading } = useGetGameDetailQuery(
    { league: leagueParam as LiveLeague, id: gameId },
    { skip: !isSupported || !gameId },
  );

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

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={title} />
      <HStack className="items-center px-4 py-2">
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={Info} />
        </Pressable>
        <Text size="sm" className="ml-2 text-teamgm-text-muted">
          Back to scores
        </Text>
      </HStack>

      {isLoading ? (
        <VStack className="flex-1 items-center justify-center">
          <ActivityIndicator color={Accent} />
          <Text size="sm" className="mt-3 text-teamgm-text-muted">
            {GAME_COPY.loading}
          </Text>
        </VStack>
      ) : errorMessage ? (
        <VStack className="flex-1 px-4">
          <Text size="sm" className="text-teamgm-accent">
            {errorMessage}
          </Text>
        </VStack>
      ) : data ? (
        <ScrollView className="flex-1" contentContainerClassName="gap-4 px-4 pb-8">
          <GameScoreBox game={data.game} isInteractive={false} />

          <BoxScoreTable
            league={leagueParam as LiveLeague}
            boxScore={data.boxScore}
            awayName={data.game.awayTeam.abbreviation}
            homeName={data.game.homeTeam.abbreviation}
          />

          <VStack space="sm">
            <Text size="sm" bold className="text-teamgm-text-primary">
              {GAME_COPY.teamStats}
            </Text>
            <TeamStatsBlock
              teamName={data.game.awayTeam.name}
              stats={data.teamStats.away}
              league={leagueParam as LiveLeague}
            />
            <TeamStatsBlock
              teamName={data.game.homeTeam.name}
              stats={data.teamStats.home}
              league={leagueParam as LiveLeague}
            />
          </VStack>

          {data.events?.length ? <EventsList events={data.events} /> : null}

          {!data.playerStatsAvailable ? (
            <Text size="sm" className="text-teamgm-text-muted">
              {data.message ?? GAME_COPY.playerStatsNote}
            </Text>
          ) : null}
        </ScrollView>
      ) : null}
    </VStack>
  );
}
