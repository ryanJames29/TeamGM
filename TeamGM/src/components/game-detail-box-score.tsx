import React from 'react';
import { ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { GAME_COPY } from '@/constants/game-copy';
import { splitTeamDisplayName } from '@/utils/split-team-display-name';

type LiveLeague = 'nhl' | 'mlb';

type PeriodRow = {
  label: string;
  away: number | null;
  home: number | null;
};

type ScoreColumn = {
  key: string;
  label: string;
  away: number | null | undefined;
  home: number | null | undefined;
};

type Props = {
  league: LiveLeague;
  boxScore: Record<string, unknown>;
  awayTeamName: string;
  homeTeamName: string;
};

// Renders — for periods/innings not yet played.
function formatScoreCell(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return String(value);
}

// Index period rows by label (1st, 2nd, OT, …).
function periodRowMap(periods: PeriodRow[] | undefined): Map<string, PeriodRow> {
  const map = new Map<string, PeriodRow>();
  if (!periods) {
    return map;
  }
  for (const row of periods) {
    map.set(row.label, row);
  }
  return map;
}

// NHL: columns 1 · 2 · 3 · OT? · Final; rows Away / Home.
function buildNhlColumns(
  periods: PeriodRow[] | undefined,
  awayTotal: number | null | undefined,
  homeTotal: number | null | undefined,
): ScoreColumn[] {
  const byLabel = periodRowMap(periods);
  const pick = (label: string) => byLabel.get(label);

  const columns: ScoreColumn[] = [
    {
      key: 'p1',
      label: '1',
      away: pick('1st')?.away,
      home: pick('1st')?.home,
    },
    {
      key: 'p2',
      label: '2',
      away: pick('2nd')?.away,
      home: pick('2nd')?.home,
    },
    {
      key: 'p3',
      label: '3',
      away: pick('3rd')?.away,
      home: pick('3rd')?.home,
    },
  ];

  const ot = pick('OT');
  if (ot) {
    columns.push({
      key: 'ot',
      label: GAME_COPY.boxScoreOt,
      away: ot.away,
      home: ot.home,
    });
  }

  const so = pick('SO');
  if (so) {
    columns.push({
      key: 'so',
      label: GAME_COPY.boxScoreSo,
      away: so.away,
      home: so.home,
    });
  }

  columns.push({
    key: 'final',
    label: GAME_COPY.final,
    away: awayTotal,
    home: homeTotal,
  });

  return columns;
}

// MLB: inning columns through 9, optional Extra, Final.
function buildMlbColumns(
  innings: PeriodRow[] | undefined,
  awayTotal: number | null | undefined,
  homeTotal: number | null | undefined,
): ScoreColumn[] {
  const byLabel = periodRowMap(innings);
  const columns: ScoreColumn[] = [];

  for (let inning = 1; inning <= 9; inning += 1) {
    const label = String(inning);
    const row = byLabel.get(label);
    columns.push({
      key: `inning-${inning}`,
      label,
      away: row?.away,
      home: row?.home,
    });
  }

  const extra = byLabel.get(GAME_COPY.boxScoreExtra);
  if (extra) {
    columns.push({
      key: 'extra',
      label: GAME_COPY.boxScoreExtra,
      away: extra.away,
      home: extra.home,
    });
  }

  columns.push({
    key: 'final',
    label: GAME_COPY.final,
    away: awayTotal,
    home: homeTotal,
  });

  return columns;
}

// One header row + team city rows (e.g. Carolina / Denver).
function BoxScoreGrid({
  columns,
  awayRowLabel,
  homeRowLabel,
  periodHeaderLabel,
}: {
  columns: ScoreColumn[];
  awayRowLabel: string;
  homeRowLabel: string;
  periodHeaderLabel: string;
}) {
  if (!columns.length) {
    return null;
  }

  const labelCellClass = 'min-w-[80px] shrink-0 pr-2 text-sm text-teamgm-text-muted';
  const headerCellClass = 'min-w-[32px] flex-1 text-center text-sm text-teamgm-text-muted';
  const scoreCellClass = 'min-w-[32px] flex-1 text-center text-sm tabular-nums text-teamgm-text-primary';
  const finalHeaderClass =
    'min-w-[40px] flex-1 text-center text-sm font-bold text-teamgm-text-primary';
  const finalScoreClass =
    'min-w-[40px] flex-1 text-center text-sm font-bold tabular-nums text-teamgm-text-primary';

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <VStack className="min-w-full">
        <HStack className="items-center py-1">
          <Text className={labelCellClass}>{periodHeaderLabel}</Text>
          {columns.map((column) => {
            const isFinal = column.key === 'final';
            return (
              <Text
                key={column.key}
                bold={isFinal}
                className={isFinal ? finalHeaderClass : headerCellClass}>
                {column.label}
              </Text>
            );
          })}
        </HStack>
        <HStack className="items-center py-1">
          <Text className={labelCellClass}>{awayRowLabel}</Text>
          {columns.map((column) => {
            const isFinal = column.key === 'final';
            return (
              <Text
                key={`away-${column.key}`}
                bold={isFinal}
                className={isFinal ? finalScoreClass : scoreCellClass}>
                {formatScoreCell(column.away)}
              </Text>
            );
          })}
        </HStack>
        <HStack className="items-center py-1">
          <Text className={labelCellClass}>{homeRowLabel}</Text>
          {columns.map((column) => {
            const isFinal = column.key === 'final';
            return (
              <Text
                key={`home-${column.key}`}
                bold={isFinal}
                className={isFinal ? finalScoreClass : scoreCellClass}>
                {formatScoreCell(column.home)}
              </Text>
            );
          })}
        </HStack>
      </VStack>
    </ScrollView>
  );
}

// Period / inning grid for game detail (team city rows, period columns).
export function GameDetailBoxScore({ league, boxScore, awayTeamName, homeTeamName }: Props) {
  const awayRowLabel = splitTeamDisplayName(awayTeamName).city;
  const homeRowLabel = splitTeamDisplayName(homeTeamName).city;
  const periodRows =
    league === 'mlb'
      ? (boxScore.innings as PeriodRow[] | undefined)
      : (boxScore.periods as PeriodRow[] | undefined);

  const awayTotal =
    league === 'mlb'
      ? (boxScore.away as { runs?: number | null } | undefined)?.runs
      : (boxScore.away as { goals?: number | null } | undefined)?.goals;
  const homeTotal =
    league === 'mlb'
      ? (boxScore.home as { runs?: number | null } | undefined)?.runs
      : (boxScore.home as { goals?: number | null } | undefined)?.goals;

  const columns =
    league === 'mlb'
      ? buildMlbColumns(periodRows, awayTotal, homeTotal)
      : buildNhlColumns(periodRows, awayTotal, homeTotal);

  if (!periodRows?.length && awayTotal == null && homeTotal == null) {
    return null;
  }

  return (
    <VStack space="sm">
      <Text size="lg" bold className="text-teamgm-text-primary">
        {GAME_COPY.boxScore}
      </Text>
      <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
        <BoxScoreGrid
          columns={columns}
          awayRowLabel={awayRowLabel}
          homeRowLabel={homeRowLabel}
          periodHeaderLabel={
            league === 'mlb' ? GAME_COPY.boxScoreInning : GAME_COPY.boxScorePeriod
          }
        />
        {league === 'mlb' ? (
          <HStack className="mt-3 justify-between border-t border-teamgm-border pt-2">
            <Text size="sm" className="text-teamgm-text-muted">
              {GAME_COPY.hits}
            </Text>
            <Text size="sm" className="text-teamgm-text-primary">
              {(boxScore.away as { hits?: number })?.hits ?? '—'} /{' '}
              {(boxScore.home as { hits?: number })?.hits ?? '—'}
            </Text>
            <Text size="sm" className="text-teamgm-text-muted">
              {GAME_COPY.errors}
            </Text>
            <Text size="sm" className="text-teamgm-text-primary">
              {(boxScore.away as { errors?: number })?.errors ?? '—'} /{' '}
              {(boxScore.home as { errors?: number })?.errors ?? '—'}
            </Text>
          </HStack>
        ) : null}
      </Box>
    </VStack>
  );
}
