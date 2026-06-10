import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

import { GameScoreBox } from '@/components/gameScoreBox';
import { LeagueSelector } from '@/components/leagueSelector';
import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { API_BASE_URL, LIVE_SCORES_POLL_INTERVAL_MS } from '@/constants/api';
import { GAME_COPY } from '@/constants/game-copy';
import { Accent } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-provider';
import { getMockScoresByLeague } from '@/mock-data';
import type { MajorLeague, MockTeamScore } from '@/mock-data/types/scores';
import { ScoresTabIcon } from '@/navigation/tab-icons';
import {
  getRtkErrorMessage,
  teamgmApi,
  useGetFavoriteTeamsQuery,
  useGetMlbGamesQuery,
  useGetNhlGamesQuery,
  useToggleFavoriteTeamMutation,
} from '@/store/api';
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

function isLiveLeague(league: MajorLeague): league is LiveLeague {
  return LIVE_LEAGUES.includes(league as LiveLeague);
}

export default function ScoresScreen() {
  const dispatch = useAppDispatch();
  const { userId } = useAuth();
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
    pollingInterval: isNhl && hasLiveGames ? LIVE_SCORES_POLL_INTERVAL_MS : 0,
  });

  const {
    data: mlbData,
    error: mlbError,
    isLoading: isMlbLoading,
    refetch: refetchMlb,
  } = useGetMlbGamesQuery(undefined, {
    skip: !isMlb || !canReachApi,
    pollingInterval: isMlb && hasLiveGames ? LIVE_SCORES_POLL_INTERVAL_MS : 0,
  });

  const liveData = isNhl ? nhlData : isMlb ? mlbData : undefined;
  const liveError = isNhl ? nhlError : isMlb ? mlbError : undefined;
  const isLiveLoading = isNhl ? isNhlLoading : isMlb ? isMlbLoading : false;
  const refetchLive = isNhl ? refetchNhl : refetchMlb;

  const { data: favoriteTeams = [], error: favoritesLoadError } = useGetFavoriteTeamsQuery(
    userId ?? '',
    { skip: !userId },
  );
  const [toggleFavoriteTeam, { error: favoriteToggleError }] = useToggleFavoriteTeamMutation();

  const favoritesByLeague = useMemo(() => {
    const map = new Map<MajorLeague, (typeof favoriteTeams)[number]>();
    for (const row of favoriteTeams) {
      map.set(row.league, row);
    }
    return map;
  }, [favoriteTeams]);

  const isFavoriteTeam = useCallback(
    (league: MajorLeague, teamId: number | undefined) => {
      if (teamId == null) {
        return false;
      }
      return favoritesByLeague.get(league)?.api_sports_team_id === teamId;
    },
    [favoritesByLeague],
  );

  const onFavoriteTeam = useCallback(
    (league: MajorLeague, team: MockTeamScore) => {
      if (!userId || team.id == null) {
        return;
      }

      void toggleFavoriteTeam({
        userId,
        league,
        team,
        isFavorite: isFavoriteTeam(league, team.id),
      }).unwrap();
    },
    [userId, toggleFavoriteTeam, isFavoriteTeam],
  );

  const favoriteErrorMessage = favoriteToggleError
    ? getRtkErrorMessage(favoriteToggleError, GAME_COPY.favoriteUpdateError)
    : favoritesLoadError
      ? getRtkErrorMessage(favoritesLoadError, GAME_COPY.favoriteLoadError)
      : null;

  const favoriteTeamIdsForLeague = useMemo(() => {
    const favorite = favoritesByLeague.get(selectedLeague);
    return favorite ? [favorite.api_sports_team_id] : [];
  }, [favoritesByLeague, selectedLeague]);

  const games = useMemo(() => {
    const list = usesLiveApi ? (liveData?.games ?? []) : getMockScoresByLeague(selectedLeague);
    return sortScoreboardGames(filterScoreboardGames(list), favoriteTeamIdsForLeague);
  }, [usesLiveApi, liveData?.games, selectedLeague, favoriteTeamIdsForLeague]);

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

          {favoriteErrorMessage ? (
            <Text size="sm" className="text-teamgm-accent">
              {favoriteErrorMessage}
            </Text>
          ) : null}

          {usesLiveApi && !liveErrorMessage && !isLiveLoading && games.length === 0 ? (
            <Text size="sm" className="text-teamgm-text-muted">
              {emptyCopy}
            </Text>
          ) : null}

          {games.map((game) => (
            <GameScoreBox
              key={game.id}
              game={game}
              onFavoriteTeam={
                usesLiveApi ? (team) => onFavoriteTeam(game.league, team) : undefined
              }
              isFavoriteTeam={
                usesLiveApi ? (teamId) => isFavoriteTeam(game.league, teamId) : undefined
              }
            />
          ))}
        </ScrollView>
      )}
    </VStack>
  );
}
