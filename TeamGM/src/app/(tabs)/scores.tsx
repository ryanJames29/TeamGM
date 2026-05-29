import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

import { GameScoreBox } from '@/components/gameScoreBox';
import { LeagueSelector } from '@/components/leagueSelector';
import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { API_BASE_URL } from '@/constants/api';
import { Accent } from '@/constants/theme';
import { getMockScoresByLeague } from '@/mock-data';
import type { MajorLeague } from '@/mock-data/types/scores';
import { ScoresTabIcon } from '@/navigation/tab-icons';
import { getRtkErrorMessage } from '@/store/api/get-rtk-error-message';
import { teamgmApi, useGetMlbGamesQuery, useGetNhlGamesQuery } from '@/store/api/teamgm-api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedLeague, setSelectedLeague } from '@/store/slices/scores-slice';
import { filterScoreboardGames } from '@/utils/filter-scoreboard-games';
import { sortScoreboardGames } from '@/utils/sort-scoreboard-games';

export const SCORES_COPY = {
  title: 'Scores',
  subtitle: 'Live scores and game results will appear here.',
  loadingNhl: 'Loading NHL scores…',
  loadingMlb: 'Loading MLB scores…',
  emptyNhl: 'No NHL games on today’s scoreboard.',
  emptyMlb: 'No MLB games on today’s scoreboard.',
  apiMissing:
    'Set EXPO_PUBLIC_API_URL in .env (e.g. http://127.0.0.1:8000) and restart Expo.',
  nhlFetchError: 'Could not load NHL scores.',
  mlbFetchError: 'Could not load MLB scores.',
} as const;

export const options = {
  title: SCORES_COPY.title,
  tabBarLabel: SCORES_COPY.title,
  tabBarIcon: ScoresTabIcon,
};

const LIVE_LEAGUES = ['nhl', 'mlb'] as const satisfies readonly MajorLeague[];

type LiveLeague = (typeof LIVE_LEAGUES)[number];

// Backend refreshes live scores every 60s via Redis jobs — match that cadence.
const LIVE_POLL_INTERVAL_MS = 60_000;

function isLiveLeague(league: MajorLeague): league is LiveLeague {
  return LIVE_LEAGUES.includes(league as LiveLeague);
}

export default function ScoresScreen() {
  const dispatch = useAppDispatch();
  const selectedLeague = useAppSelector(selectSelectedLeague);
  const isNhl = selectedLeague === 'nhl';
  const isMlb = selectedLeague === 'mlb';
  const usesLiveApi = isLiveLeague(selectedLeague);
  const canReachApi = Boolean(API_BASE_URL);

  const selectNhlGames = teamgmApi.endpoints.getNhlGames.select();
  const selectMlbGames = teamgmApi.endpoints.getMlbGames.select();
  const cachedNhl = useAppSelector(selectNhlGames);
  const cachedMlb = useAppSelector(selectMlbGames);
  const hasLiveGames =
    (isNhl && cachedNhl.data?.games.some((game) => game.status === 'live')) ||
    (isMlb && cachedMlb.data?.games.some((game) => game.status === 'live'));

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const {
    data: nhlData,
    error: nhlError,
    isLoading: isNhlLoading,
    refetch: refetchNhl,
  } = useGetNhlGamesQuery(undefined, {
    skip: !isNhl || !canReachApi,
    pollingInterval: isNhl && hasLiveGames ? LIVE_POLL_INTERVAL_MS : 0,
  });

  const {
    data: mlbData,
    error: mlbError,
    isLoading: isMlbLoading,
    refetch: refetchMlb,
  } = useGetMlbGamesQuery(undefined, {
    skip: !isMlb || !canReachApi,
    pollingInterval: isMlb && hasLiveGames ? LIVE_POLL_INTERVAL_MS : 0,
  });

  const liveData = isNhl ? nhlData : isMlb ? mlbData : undefined;
  const liveError = isNhl ? nhlError : isMlb ? mlbError : undefined;
  const isLiveLoading = isNhl ? isNhlLoading : isMlb ? isMlbLoading : false;
  const refetchLive = isNhl ? refetchNhl : refetchMlb;

  const games = useMemo(() => {
    const list = usesLiveApi ? (liveData?.games ?? []) : getMockScoresByLeague(selectedLeague);
    return sortScoreboardGames(filterScoreboardGames(list));
  }, [usesLiveApi, liveData?.games, selectedLeague]);

  const loadingCopy = isNhl ? SCORES_COPY.loadingNhl : SCORES_COPY.loadingMlb;
  const emptyCopy = isNhl ? SCORES_COPY.emptyNhl : SCORES_COPY.emptyMlb;
  const fetchErrorCopy = isNhl ? SCORES_COPY.nhlFetchError : SCORES_COPY.mlbFetchError;

  const showInitialLoader = usesLiveApi && isLiveLoading && games.length === 0;
  const liveErrorMessage = !canReachApi
    ? SCORES_COPY.apiMissing
    : liveError
      ? getRtkErrorMessage(liveError, fetchErrorCopy)
      : null;

  const onLivePullRefresh = useCallback(() => {
    setIsPullRefreshing(true);
    void refetchLive().finally(() => setIsPullRefreshing(false));
  }, [refetchLive]);

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={SCORES_COPY.title} />
      <View className="py-4">
        <LeagueSelector
          selectedLeague={selectedLeague}
          onSelect={(league) => dispatch(setSelectedLeague(league))}
        />
      </View>

      {showInitialLoader ? (
        <VStack className="flex-1 items-center justify-center gap-3 px-4">
          <ActivityIndicator color={Accent} />
          <Text size="sm" className="text-teamgm-text-muted">
            {loadingCopy}
          </Text>
        </VStack>
      ) : (
        <ScrollView
          className="flex-1 bg-teamgm-app"
          contentContainerClassName="gap-3 px-4 pb-6"
          refreshControl={
            usesLiveApi ? (
              <RefreshControl
                refreshing={isPullRefreshing}
                onRefresh={onLivePullRefresh}
                tintColor={Accent}
              />
            ) : undefined
          }>
          {usesLiveApi && liveErrorMessage ? (
            <Text size="sm" className="text-teamgm-accent">
              {liveErrorMessage}
            </Text>
          ) : null}

          {usesLiveApi && !liveErrorMessage && !isLiveLoading && games.length === 0 ? (
            <Text size="sm" className="text-teamgm-text-muted">
              {emptyCopy}
            </Text>
          ) : null}

          {games.map((game) => (
            <GameScoreBox key={game.id} game={game} />
          ))}
        </ScrollView>
      )}
    </VStack>
  );
}
