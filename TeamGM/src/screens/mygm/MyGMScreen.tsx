import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MYGM_COPY } from '@/constants/mygm-copy';
import { Accent, Info } from '@/constants/theme';
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
import { StaffList } from './components/StaffList';
import {
  findStaffMember,
  formatCompactCurrency,
  groupRoster,
  ROSTER_GROUPS,
} from './mygm-utils';

const PREVIEW_PLAYER_COUNT = 5;

// Portfolio dashboard for the Avalanche myGM experience
export default function MyGMScreen() {
  const router = useRouter();
  const { data, error, isLoading, isFetching, refetch } = useGetMyGmDashboardQuery();
  const capSummary = data?.capSummary ?? null;
  const roster = useMemo(() => data?.roster ?? [], [data?.roster]);
  const staff = data?.staff ?? [];

  // Compute dashboard highlights before rendering
  const groupedRoster = useMemo(() => groupRoster(roster), [roster]);
  const rosterPreview = useMemo(
    () => ROSTER_GROUPS.flatMap((group) => groupedRoster[group]).slice(0, PREVIEW_PLAYER_COUNT),
    [groupedRoster],
  );
  const generalManager = findStaffMember(staff, 'general_manager');
  const headCoach = findStaffMember(staff, 'head_coach');
  const expiringCount = roster.filter(
    (player) => player.years_remaining != null && player.years_remaining <= 1,
  ).length;
  const errorMessage = error
    ? getRtkErrorMessage(error, MYGM_COPY.loadError)
    : null;
  const hasDashboard = Boolean(capSummary);
  const rosterCount = roster.length;
  const maxRosterSize = capSummary?.max_roster_size ?? 0;
  const capSpaceCents = capSummary?.cap_space_cents ?? null;
  const isOverCap = (capSpaceCents ?? 0) < 0;

  // Build position allocation meters from summary values
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

  // Refreshes all myGM dashboard data
  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  // Opens the full roster screen
  const onOpenRoster = useCallback(() => {
    router.push('/mygm/roster');
  }, [router]);

  // Opens the detailed cap sheet
  const onOpenCap = useCallback(() => {
    router.push('/mygm/cap');
  }, [router]);

  // Opens a player profile from a dashboard row
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
      <ScreenHeader title={MYGM_COPY.title} />
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} tintColor={Accent} />}
        contentContainerClassName="gap-3 p-3 pb-24">
        <Box className="relative overflow-hidden rounded-2xl border border-teamgm-border bg-teamgm-secondary p-5">
          <Box className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teamgm-info/10" />
          <Box className="absolute -bottom-12 right-10 h-28 w-28 rounded-full bg-teamgm-accent/10" />
          <HStack className="items-start gap-4">
            <Box className="h-16 w-16 items-center justify-center rounded-2xl border border-teamgm-info/50 bg-teamgm-surface">
              <Text size="xl" bold className="tracking-wider text-teamgm-text-primary">
                {MYGM_COPY.teamAbbreviation}
              </Text>
            </Box>
            <VStack className="flex-1">
              <HStack className="mb-1 items-center gap-2">
                <Text size="xs" bold className="uppercase tracking-widest text-teamgm-info">
                  {MYGM_COPY.dashboardEyebrow}
                </Text>
                <Box className="rounded-full border border-teamgm-border bg-teamgm-surface px-2 py-0.5">
                  <Text size="2xs" bold className="text-teamgm-text-muted">
                    {capSummary?.season_id ?? MYGM_COPY.leagueLabel}
                  </Text>
                </Box>
              </HStack>
              <Text size="2xl" bold className="text-teamgm-text-primary">
                {MYGM_COPY.teamName}
              </Text>
              <Text size="xs" className="mt-1 leading-5 text-teamgm-text-muted">
                {MYGM_COPY.dashboardSubtitle}
              </Text>
            </VStack>
          </HStack>
          {hasDashboard ? (
            <HStack className="mt-5 gap-3 border-t border-teamgm-border/60 pt-4">
              <VStack className="flex-1">
                <Text size="2xs" className="uppercase tracking-wider text-teamgm-text-muted">
                  {MYGM_COPY.generalManager}
                </Text>
                <Text size="sm" bold className="mt-1 text-teamgm-text-primary">
                  {generalManager?.full_name ?? '—'}
                </Text>
              </VStack>
              <Box className="w-px bg-teamgm-border/60" />
              <VStack className="flex-1">
                <Text size="2xs" className="uppercase tracking-wider text-teamgm-text-muted">
                  {MYGM_COPY.headCoach}
                </Text>
                <Text size="sm" bold className="mt-1 text-teamgm-text-primary">
                  {headCoach?.full_name ?? '—'}
                </Text>
              </VStack>
            </HStack>
          ) : null}
        </Box>

        {isLoading ? <MyGmStatePanel kind="loading" message={MYGM_COPY.loading} /> : null}
        {errorMessage ? (
          <MyGmStatePanel kind="error" message={errorMessage} onRetry={onRefresh} />
        ) : null}
        {!isLoading && !errorMessage && !hasDashboard ? (
          <MyGmStatePanel kind="empty" message={MYGM_COPY.noData} />
        ) : null}

        {hasDashboard ? (
          <>
            <GmCard
              title={MYGM_COPY.capManagement}
              icon="speedometer-outline"
              trailing={
                <Button action="default" variant="link" onPress={onOpenCap} className="h-auto px-0">
                  <ButtonText className="text-xs text-teamgm-info">
                    {MYGM_COPY.viewCap}
                  </ButtonText>
                  <Ionicons name="arrow-forward" size={14} color={Info} />
                </Button>
              }>
              <CapMeter
                capHitCents={capSummary?.cap_hit_cents ?? null}
                capCeilingCents={capSummary?.cap_ceiling_cents ?? null}
                capSpaceCents={capSpaceCents}
              />
              <HStack className="mt-4 flex-wrap gap-2">
                <MetricTile
                  label={isOverCap ? MYGM_COPY.projectedOver : MYGM_COPY.capSpace}
                  value={formatCompactCurrency(Math.abs(capSpaceCents ?? 0))}
                  accent={isOverCap}
                  className="w-[48%]"
                />
                <MetricTile
                  label={MYGM_COPY.roster}
                  value={`${rosterCount} / ${maxRosterSize}`}
                  className="w-[48%]"
                />
              </HStack>
            </GmCard>

            <GmCard title={MYGM_COPY.capBreakdown} icon="pie-chart-outline">
              <CapAllocation rows={capAllocationRows} />
            </GmCard>

            <GmCard
              title={MYGM_COPY.rosterPreview}
              icon="people-outline"
              trailing={
                <Button action="default" variant="link" onPress={onOpenRoster} className="h-auto px-0">
                  <ButtonText className="text-xs text-teamgm-info">
                    {MYGM_COPY.viewRoster}
                  </ButtonText>
                  <Ionicons name="arrow-forward" size={14} color={Info} />
                </Button>
              }>
              <VStack className="gap-2">
                {rosterPreview.map((player) => (
                  <PlayerRow
                    key={player.roster_entry_id ?? player.player_id}
                    player={player}
                    onPress={() => onOpenPlayer(player)}
                    compact
                  />
                ))}
              </VStack>
            </GmCard>

            <GmCard title={MYGM_COPY.frontOffice} icon="briefcase-outline">
              <StaffList staff={staff} />
            </GmCard>

            <GmCard title={MYGM_COPY.contractWatch} icon="calendar-outline">
              <HStack className="items-center gap-4">
                <Box className="h-12 w-12 items-center justify-center rounded-xl bg-teamgm-accent/15">
                  <Text size="xl" bold className="tabular-nums text-teamgm-accent">
                    {expiringCount}
                  </Text>
                </Box>
                <Text size="sm" className="flex-1 leading-5 text-teamgm-text-muted">
                  {expiringCount > 0
                    ? MYGM_COPY.expiringContracts
                    : MYGM_COPY.noExpiringContracts}
                </Text>
              </HStack>
            </GmCard>
          </>
        ) : null}
      </ScrollView>
    </VStack>
  );
}
