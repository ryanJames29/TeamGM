import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

import { GameScoreBox } from '@/components/gameScoreBox';
import { LeagueSelector } from '@/components/leagueSelector';
import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { API_BASE_URL } from '@/constants/api';
import { Accent } from '@/constants/theme';
import { getMockScoresByLeague } from '@/mock-data';
import { ScoresTabIcon } from '@/navigation/tab-icons';
import { getRtkErrorMessage } from '@/store/api/get-rtk-error-message';
import { teamgmApi, useGetNhlGamesQuery } from '@/store/api/teamgm-api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedLeague, setSelectedLeague } from '@/store/slices/scores-slice';

export const SCORES_COPY = {
  title: 'Scores',
  subtitle: 'Live scores and game results will appear here.',
  loadingNhl: 'Loading NHL scores…',
  refreshingNhl: 'Updating…',
  emptyNhl: 'No NHL games in the last week.',
  nhlApiMissing:
    'Set EXPO_PUBLIC_API_URL in .env (e.g. http://127.0.0.1:8000) and restart Expo.',
  nhlFetchError: 'Could not load NHL scores.',
} as const;

export const options = {
  title: SCORES_COPY.title,
  tabBarLabel: SCORES_COPY.title,
  tabBarIcon: ScoresTabIcon,
};

const NHL_POLL_INTERVAL_MS = 30_000;

export default function ScoresScreen() {
  const dispatch = useAppDispatch();
  const selectedLeague = useAppSelector(selectSelectedLeague);
  const isNhl = selectedLeague === 'nhl';
  const canReachApi = Boolean(API_BASE_URL);

  const selectNhlGames = teamgmApi.endpoints.getNhlGames.select();
  const cachedNhl = useAppSelector(selectNhlGames);
  const hasLiveNhlGames =
    cachedNhl.data?.games.some((game) => game.status === 'live') ?? false;

  const {
    data: nhlData,
    error: nhlError,
    isLoading: isNhlLoading,
    isFetching: isNhlFetching,
    refetch: refetchNhl,
  } = useGetNhlGamesQuery(undefined, {
    skip: !isNhl || !canReachApi,
    pollingInterval: hasLiveNhlGames ? NHL_POLL_INTERVAL_MS : 0,
  });

  const games = isNhl ? (nhlData?.games ?? []) : getMockScoresByLeague(selectedLeague);

  const showInitialLoader = isNhl && isNhlLoading && games.length === 0;
  const nhlErrorMessage = !canReachApi
    ? SCORES_COPY.nhlApiMissing
    : nhlError
      ? getRtkErrorMessage(nhlError, SCORES_COPY.nhlFetchError)
      : null;

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
            {SCORES_COPY.loadingNhl}
          </Text>
        </VStack>
      ) : (
        <ScrollView
          className="flex-1 bg-teamgm-app"
          contentContainerClassName="gap-3 px-4 pb-6"
          refreshControl={
            isNhl ? (
              <RefreshControl
                refreshing={isNhlFetching && !isNhlLoading}
                onRefresh={() => void refetchNhl()}
                tintColor={Accent}
              />
            ) : undefined
          }>
          {isNhl && isNhlFetching && games.length > 0 ? (
            <Text size="xs" className="text-center text-teamgm-text-muted">
              {SCORES_COPY.refreshingNhl}
            </Text>
          ) : null}

          {isNhl && nhlErrorMessage ? (
            <Text size="sm" className="text-teamgm-accent">
              {nhlErrorMessage}
            </Text>
          ) : null}

          {isNhl && !nhlErrorMessage && !isNhlLoading && games.length === 0 ? (
            <Text size="sm" className="text-teamgm-text-muted">
              {SCORES_COPY.emptyNhl}
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
