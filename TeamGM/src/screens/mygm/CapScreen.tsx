import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MYGM_COPY } from '@/constants/mygm-copy';
import { Accent } from '@/constants/theme';
import {
  getRtkErrorMessage,
  type MyGmRosterPlayer,
  useGetMyGmDashboardQuery,
} from '@/store/api';

import { CapAllocation } from './components/CapAllocation';
import { CapMeter } from './components/CapMeter';
import { GmCard } from './components/GmCard';
import { MetricTile } from './components/MetricTile';
import { MyGmStatePanel } from './components/MyGmStatePanel';
import { PlayerRow } from './components/PlayerRow';
import { formatCurrency } from './mygm-utils';

// Detailed Avalanche cap sheet and contract outlook
export default function CapScreen() {
  const router = useRouter();
  const { data, error, isLoading, isFetching, refetch } = useGetMyGmDashboardQuery();
  const capSummary = data?.capSummary ?? null;
  const roster = useMemo(() => data?.roster ?? [], [data?.roster]);

  // Derive cap allocations and expiring contracts before rendering
  const expiringPlayers = useMemo(
    () =>
      roster
        .filter((player) => player.years_remaining != null && player.years_remaining <= 1)
        .sort((left, right) => (right.cap_hit_cents ?? 0) - (left.cap_hit_cents ?? 0)),
    [roster],
  );
  const errorMessage = error
    ? getRtkErrorMessage(error, MYGM_COPY.loadError)
    : null;
  const hasCapSheet = Boolean(capSummary);
  const capSpaceCents = capSummary?.cap_space_cents ?? null;
  const isOverCap = (capSpaceCents ?? 0) < 0;

  // Build detailed position allocation rows
  const capAllocationRows = [
    {
      label: MYGM_COPY.forwards,
      valueCents: capSummary?.forwards_cap_hit_cents ?? null,
      totalCents: capSummary?.cap_hit_cents ?? null,
      fillClassName: 'bg-teamgm-accent',
    },
    {
      label: MYGM_COPY.defence,
      valueCents: capSummary?.defence_cap_hit_cents ?? null,
      totalCents: capSummary?.cap_hit_cents ?? null,
      fillClassName: 'bg-teamgm-info',
    },
    {
      label: MYGM_COPY.goalies,
      valueCents: capSummary?.goalies_cap_hit_cents ?? null,
      totalCents: capSummary?.cap_hit_cents ?? null,
      fillClassName: 'bg-teamgm-text-muted',
    },
  ];

  // Returns to the myGM dashboard
  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  // Refreshes cap and contract data
  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  // Opens an expiring player's profile
  const onOpenPlayer = useCallback(
    (player: MyGmRosterPlayer) => {
      if (!player.player_id || !player.season_id) {
        return;
      }

      router.push({
        pathname: '/mygm/player/[id]',
        params: { id: player.player_id, seasonId: player.season_id },
      });
    },
    [router],
  );

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={MYGM_COPY.capManagement} onBack={onBack} />
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} tintColor={Accent} />}
        contentContainerClassName="gap-3 p-3 pb-10">
        {isLoading ? <MyGmStatePanel kind="loading" message={MYGM_COPY.loading} /> : null}
        {errorMessage ? (
          <MyGmStatePanel kind="error" message={errorMessage} onRetry={onRefresh} />
        ) : null}
        {!isLoading && !errorMessage && !hasCapSheet ? (
          <MyGmStatePanel kind="empty" message={MYGM_COPY.noData} />
        ) : null}

        {hasCapSheet ? (
          <>
            <GmCard
              title={`${MYGM_COPY.season} ${capSummary?.season_id ?? ''}`}
              icon="speedometer-outline">
              <CapMeter
                capHitCents={capSummary?.cap_hit_cents ?? null}
                capCeilingCents={capSummary?.cap_ceiling_cents ?? null}
                capSpaceCents={capSpaceCents}
              />
              <HStack className="mt-4 flex-wrap gap-2">
                <MetricTile
                  label={MYGM_COPY.capCeiling}
                  value={formatCurrency(capSummary?.cap_ceiling_cents)}
                  className="w-[48%]"
                />
                <MetricTile
                  label={isOverCap ? MYGM_COPY.projectedOver : MYGM_COPY.capSpace}
                  value={formatCurrency(Math.abs(capSpaceCents ?? 0))}
                  accent={isOverCap}
                  className="w-[48%]"
                />
              </HStack>
            </GmCard>

            <GmCard title={MYGM_COPY.capBreakdown} icon="pie-chart-outline">
              <CapAllocation rows={capAllocationRows} />
            </GmCard>

            <GmCard title={MYGM_COPY.commitments} icon="receipt-outline">
              <HStack className="flex-wrap gap-2">
                <MetricTile
                  label={MYGM_COPY.bonusOverages}
                  value={formatCurrency(capSummary?.bonus_overages_cents)}
                  className="w-[48%]"
                />
                <MetricTile
                  label={MYGM_COPY.potentialBonuses}
                  value={formatCurrency(capSummary?.potential_bonuses_cents)}
                  className="w-[48%]"
                />
                <MetricTile
                  label={MYGM_COPY.ltirPool}
                  value={formatCurrency(capSummary?.ltir_pool_cents)}
                  className="w-[48%]"
                />
                <MetricTile
                  label={MYGM_COPY.rosterCount}
                  value={`${roster.length} / ${capSummary?.max_roster_size ?? 0}`}
                  className="w-[48%]"
                />
              </HStack>
            </GmCard>

            <GmCard
              title={MYGM_COPY.contractWatch}
              icon="calendar-outline"
              trailing={
                <Text size="xs" bold className="tabular-nums text-teamgm-accent">
                  {expiringPlayers.length}
                </Text>
              }>
              {expiringPlayers.length > 0 ? (
                <VStack className="gap-2">
                  {expiringPlayers.map((player) => (
                    <PlayerRow
                      key={player.roster_entry_id ?? player.player_id}
                      player={player}
                      onPress={() => onOpenPlayer(player)}
                    />
                  ))}
                </VStack>
              ) : (
                <Text size="sm" className="text-teamgm-text-muted">
                  {MYGM_COPY.noExpiringContracts}
                </Text>
              )}
            </GmCard>
          </>
        ) : null}
      </ScrollView>
    </VStack>
  );
}
