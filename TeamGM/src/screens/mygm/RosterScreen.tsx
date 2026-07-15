import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Box } from '@/components/ui/box';
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

import { GmCard } from './components/GmCard';
import { MyGmStatePanel } from './components/MyGmStatePanel';
import { PlayerRow } from './components/PlayerRow';
import { groupRoster, getRosterGroupLabel, ROSTER_GROUPS } from './mygm-utils';

const GROUP_ICONS = {
  F: 'flash-outline',
  D: 'shield-outline',
  G: 'hand-left-outline',
} as const;

// Full Avalanche roster grouped by position
export default function RosterScreen() {
  const router = useRouter();
  const { data, error, isLoading, isFetching, refetch } = useGetMyGmDashboardQuery();
  const roster = useMemo(() => data?.roster ?? [], [data?.roster]);
  const capSummary = data?.capSummary ?? null;

  // Group roster rows and derive state flags before rendering
  const groupedRoster = useMemo(() => groupRoster(roster), [roster]);
  const errorMessage = error
    ? getRtkErrorMessage(error, MYGM_COPY.loadError)
    : null;
  const hasRoster = roster.length > 0;
  const rosterLimit = capSummary?.max_roster_size ?? 0;

  // Returns to the myGM dashboard
  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  // Refreshes all roster and cap data
  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  // Opens a player profile from the roster
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
      <ScreenHeader title={MYGM_COPY.roster} onBack={onBack} />
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} tintColor={Accent} />}
        contentContainerClassName="gap-3 p-3 pb-10">
        <Box className="rounded-2xl border border-teamgm-border bg-teamgm-secondary p-4">
          <HStack className="items-center justify-between">
            <VStack>
              <Text size="xs" className="uppercase tracking-wider text-teamgm-info">
                {MYGM_COPY.teamName}
              </Text>
              <Text size="xl" bold className="mt-1 text-teamgm-text-primary">
                {MYGM_COPY.activeRoster}
              </Text>
            </VStack>
            <Box className="rounded-xl border border-teamgm-border bg-teamgm-surface px-4 py-2">
              <Text size="lg" bold className="tabular-nums text-teamgm-text-primary">
                {roster.length} / {rosterLimit}
              </Text>
              <Text size="2xs" className="text-center text-teamgm-text-muted">
                {MYGM_COPY.rosterSlots}
              </Text>
            </Box>
          </HStack>
        </Box>

        {isLoading ? <MyGmStatePanel kind="loading" message={MYGM_COPY.loading} /> : null}
        {errorMessage ? (
          <MyGmStatePanel kind="error" message={errorMessage} onRetry={onRefresh} />
        ) : null}
        {!isLoading && !errorMessage && !hasRoster ? (
          <MyGmStatePanel kind="empty" message={MYGM_COPY.noData} />
        ) : null}

        {hasRoster
          ? ROSTER_GROUPS.map((group) => {
              const players = groupedRoster[group];
              const groupTitle = getRosterGroupLabel(group);

              return (
                <GmCard
                  key={group}
                  title={groupTitle}
                  icon={GROUP_ICONS[group]}
                  trailing={
                    <Box className="rounded-full bg-teamgm-surface px-2.5 py-1">
                      <Text size="xs" bold className="tabular-nums text-teamgm-text-muted">
                        {players.length}
                      </Text>
                    </Box>
                  }>
                  <VStack className="gap-2">
                    {players.map((player) => (
                      <PlayerRow
                        key={player.roster_entry_id ?? player.player_id}
                        player={player}
                        onPress={() => onOpenPlayer(player)}
                      />
                    ))}
                  </VStack>
                </GmCard>
              );
            })
          : null}
      </ScrollView>
    </VStack>
  );
}
