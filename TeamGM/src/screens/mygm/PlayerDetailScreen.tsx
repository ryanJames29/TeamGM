import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MYGM_COPY } from '@/constants/mygm-copy';
import {
  getRtkErrorMessage,
  useGetMyGmPlayerQuery,
} from '@/store/api';

import { GmCard } from './components/GmCard';
import { MetricTile } from './components/MetricTile';
import { MyGmStatePanel } from './components/MyGmStatePanel';
import { StatusPill } from './components/StatusPill';
import {
  formatCurrency,
  formatPositions,
  formatYearsRemaining,
} from './mygm-utils';

// Formats an ISO contract date for display
function formatDate(value: string | null): string {
  if (!value) {
    return MYGM_COPY.notAvailable;
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Formats goalie save percentage as a traditional three-digit value
function formatSavePercentage(value: number | null): string {
  if (value == null) {
    return MYGM_COPY.notAvailable;
  }

  return value.toFixed(3).replace(/^0/, '');
}

// Detailed player contract and season-stat profile
export default function PlayerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; seasonId?: string }>();
  const playerId = typeof params.id === 'string' ? params.id : '';
  const seasonId = typeof params.seasonId === 'string' ? params.seasonId : '';
  const shouldSkip = !playerId || !seasonId;
  const { data, error, isLoading, refetch } = useGetMyGmPlayerQuery(
    { playerId, seasonId },
    { skip: shouldSkip },
  );
  const player = data?.player ?? null;
  const stats = data?.stats ?? null;

  // Derive contract and state labels before rendering
  const playerName = player?.full_name ?? MYGM_COPY.unknownPlayer;
  const errorMessage = error
    ? getRtkErrorMessage(error, MYGM_COPY.loadError)
    : null;
  const hasPlayer = Boolean(player);
  const isGoalie = player?.position_group === 'G';
  const hasTradeProtection = Boolean(player?.has_nmc || player?.has_ntc);
  const contractExpiry = player?.expiry_year
    ? `${player.expiry_status ?? ''} ${player.expiry_year}`.trim()
    : player?.expiry_status ?? MYGM_COPY.notAvailable;

  // Builds player stat tiles for skaters or goalies
  const statTiles = isGoalie
    ? [
        { label: MYGM_COPY.gamesPlayed, value: stats?.games_played?.toString() ?? MYGM_COPY.notAvailable },
        { label: MYGM_COPY.savePercentage, value: formatSavePercentage(stats?.save_pct ?? null) },
        { label: MYGM_COPY.goalsAgainstAverage, value: stats?.gaa?.toFixed(2) ?? MYGM_COPY.notAvailable },
      ]
    : [
        { label: MYGM_COPY.gamesPlayed, value: stats?.games_played?.toString() ?? MYGM_COPY.notAvailable },
        { label: MYGM_COPY.goals, value: stats?.goals?.toString() ?? MYGM_COPY.notAvailable },
        { label: MYGM_COPY.assists, value: stats?.assists?.toString() ?? MYGM_COPY.notAvailable },
        { label: MYGM_COPY.points, value: stats?.points?.toString() ?? MYGM_COPY.notAvailable },
        { label: MYGM_COPY.plusMinus, value: stats?.plus_minus?.toString() ?? MYGM_COPY.notAvailable },
        { label: MYGM_COPY.penaltyMinutes, value: stats?.pim?.toString() ?? MYGM_COPY.notAvailable },
        { label: MYGM_COPY.shots, value: stats?.shots?.toString() ?? MYGM_COPY.notAvailable },
      ];

  // Returns to the previous myGM screen
  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  // Retries the player query
  const onRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={playerName} onBack={onBack} />
      <ScrollView className="flex-1" contentContainerClassName="gap-3 p-3 pb-10">
        {isLoading ? <MyGmStatePanel kind="loading" message={MYGM_COPY.loading} /> : null}
        {errorMessage ? (
          <MyGmStatePanel kind="error" message={errorMessage} onRetry={onRetry} />
        ) : null}
        {!isLoading && !errorMessage && !hasPlayer ? (
          <MyGmStatePanel kind="empty" message={MYGM_COPY.noData} />
        ) : null}

        {player ? (
          <>
            <Box className="overflow-hidden rounded-2xl border border-teamgm-border bg-teamgm-secondary p-5">
              <HStack className="items-center gap-4">
                <Box className="h-16 w-16 items-center justify-center rounded-2xl border border-teamgm-info/50 bg-teamgm-surface">
                  <Text size="xl" bold className="text-teamgm-text-primary">
                    {player.primary_position ?? MYGM_COPY.notAvailable}
                  </Text>
                </Box>
                <VStack className="flex-1">
                  <HStack className="mb-1 flex-wrap items-center gap-2">
                    <Text size="xl" bold className="text-teamgm-text-primary">
                      {playerName}
                    </Text>
                    {player.captaincy ? <StatusPill label={player.captaincy} tone="accent" /> : null}
                  </HStack>
                  <Text size="sm" className="text-teamgm-text-muted">
                    {formatPositions(player)} · {MYGM_COPY.teamName}
                  </Text>
                  <HStack className="mt-3 flex-wrap gap-2">
                    {player.is_ltir ? <StatusPill label={MYGM_COPY.ltir} tone="info" /> : null}
                    <StatusPill label={contractExpiry} />
                  </HStack>
                </VStack>
              </HStack>
            </Box>

            <GmCard title={MYGM_COPY.contract} icon="document-text-outline">
              <HStack className="flex-wrap gap-2">
                <MetricTile
                  label={MYGM_COPY.capHit}
                  value={formatCurrency(player.cap_hit_cents)}
                  className="w-[48%]"
                />
                <MetricTile
                  label={MYGM_COPY.aav}
                  value={formatCurrency(player.aav_cents)}
                  className="w-[48%]"
                />
                <MetricTile
                  label={MYGM_COPY.totalCash}
                  value={formatCurrency(player.season_total_salary_cents)}
                  className="w-[48%]"
                />
                <MetricTile
                  label={MYGM_COPY.expires}
                  value={formatDate(player.contract_end)}
                  className="w-[48%]"
                />
              </HStack>
              <HStack className="mt-4 items-center justify-between rounded-xl border border-teamgm-border/70 bg-teamgm-surface p-3">
                <Text size="xs" className="text-teamgm-text-muted">
                  {MYGM_COPY.contract}
                </Text>
                <Text size="sm" bold className="text-teamgm-text-primary">
                  {formatYearsRemaining(player.years_remaining)}
                </Text>
              </HStack>
              <Box className="mt-3">
                <Text size="xs" className="mb-2 text-teamgm-text-muted">
                  {MYGM_COPY.clauses}
                </Text>
                {hasTradeProtection ? (
                  <HStack className="gap-2">
                    {player.has_nmc ? <StatusPill label={MYGM_COPY.nmc} tone="accent" /> : null}
                    {player.has_ntc ? <StatusPill label={MYGM_COPY.ntc} tone="info" /> : null}
                  </HStack>
                ) : (
                  <Text size="sm" className="text-teamgm-text-primary">
                    {MYGM_COPY.noClauses}
                  </Text>
                )}
              </Box>
            </GmCard>

            <GmCard title={MYGM_COPY.playerStats} icon="stats-chart-outline">
              {stats ? (
                <HStack className="flex-wrap gap-2">
                  {statTiles.map((stat) => (
                    <MetricTile
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      className="w-[31%]"
                    />
                  ))}
                </HStack>
              ) : (
                <Text size="sm" className="leading-5 text-teamgm-text-muted">
                  {MYGM_COPY.noPlayerStats}
                </Text>
              )}
            </GmCard>
          </>
        ) : null}
      </ScrollView>
    </VStack>
  );
}
