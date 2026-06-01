import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { API_BASE_URL } from '@/constants/api';
import { HomeTabIcon } from '@/navigation/tab-icons';
import { useAuth } from '@/contexts/auth-provider';
import { LEAGUE_LABELS } from '@/constants/game-copy';
import {
  getRtkErrorMessage,
  homeInsightsApiEnabled,
  useGenerateHomeInsightsMutation,
  useGetFavoriteTeamsQuery,
  type FavoriteTeamRow,
} from '@/store/api';

export const HOME_COPY = {
  title: 'Home',
  yourTeams: 'Your Teams',
  noFavoriteTeams: 'Star a team on the Scores tab to pin them here.',
  favoriteLoadError: 'Could not load favorite teams.',
  runAnalysis: 'Run analysis',
  runningAnalysis: 'Running analysis…',
  insightsError: 'Could not run analysis.',
  insightsNeedFavorite: 'Favorite an NHL or MLB team to run analysis.',
  noAnalysisYet: 'Tap Run analysis to generate a briefing for your favorite team.',
  nextGame: 'Next Game',
  whyTonightMatters: 'Why Tonight Matters',
  fanConcernMeter: 'Fan Concern Meter',
  playerTrends: 'Player Trends',
  stockUp: 'Stock Up',
  stockDown: 'Stock Down',
  recentPerformance: 'Recent Performance',
  whatWentRight: 'What went right',
  whatWentWrong: 'What went wrong',
  briefingSuffix: 'Briefing',
} as const;

export const options = {
  title: HOME_COPY.title,
  tabBarLabel: HOME_COPY.title,
  tabBarIcon: HomeTabIcon,
};

type SectionHeaderProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
};

function SectionHeader({ icon, iconColor, title }: SectionHeaderProps) {
  return (
    <HStack className="mb-3 items-center gap-2">
      <Ionicons name={icon} size={16} color={iconColor} />
      <Text size="sm" bold className="text-teamgm-text-primary">
        {title}
      </Text>
    </HStack>
  );
}

export default function HomeScreen() {
  const { userId } = useAuth();
  const canUseInsightsApi = homeInsightsApiEnabled && Boolean(userId);
  const hasLiveApi = Boolean(API_BASE_URL);

  const {
    data: favorites = [],
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useGetFavoriteTeamsQuery(userId ?? '', { skip: !userId });

  const hasInsightEligibleFavorite = favorites.some(
    (team) => team.league === 'nhl' || team.league === 'mlb',
  );

  const canRunAnalysis = canUseInsightsApi && hasInsightEligibleFavorite;

  const [
    generateInsights,
    { data: insightsData, error: insightsError, isLoading: isGenerating },
  ] = useGenerateHomeInsightsMutation();

  const onRunAnalysis = useCallback(() => {
    if (!userId) {
      return;
    }

    void generateInsights(userId);
  }, [generateInsights, userId]);

  const favoritesErrorMessage = favoritesError
    ? getRtkErrorMessage(favoritesError, HOME_COPY.favoriteLoadError)
    : null;

  const insightsErrorMessage = insightsError
    ? getRtkErrorMessage(insightsError, HOME_COPY.insightsError)
    : null;

  const insight = insightsData?.insight;
  const concernWidthPercent = insight ? insight.concernLevel.level * 10 : 0;

  const upcomingLocation =
    insight &&
    (insight.upcomingGame.location === '@' || insight.upcomingGame.location === 'vs')
      ? insight.upcomingGame.location
      : insight
        ? `${insight.upcomingGame.location} `
        : '';

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={HOME_COPY.title} />
      <ScrollView className="flex-1" contentContainerClassName="gap-3 p-3 pb-24">
        <VStack space="xs">
          <Text size="sm" bold className="text-teamgm-text-primary">
            {HOME_COPY.yourTeams}
          </Text>
          <Box className="flex-row flex-wrap gap-2">
            {favoritesLoading ? (
              <Text size="sm" className="text-teamgm-text-muted">
                {HOME_COPY.yourTeams}
              </Text>
            ) : favoritesErrorMessage ? (
              <Text size="sm" className="text-teamgm-accent">
                {favoritesErrorMessage}
              </Text>
            ) : favorites.length === 0 ? (
              <Text size="sm" className="text-teamgm-text-muted">
                {HOME_COPY.noFavoriteTeams}
              </Text>
            ) : (
              favorites.map((team: FavoriteTeamRow) => (
                <Box
                  key={`${team.league}-${team.api_sports_team_id}`}
                  className="w-[48%] rounded-xl border border-teamgm-border bg-teamgm-secondary p-3">
                  <Box className="mb-2 self-start rounded bg-teamgm-surface px-2 py-1">
                    <Text size="xs" className="text-teamgm-text-primary">
                      {LEAGUE_LABELS[team.league]}
                    </Text>
                  </Box>
                  <Text size="sm" bold className="mb-1 text-teamgm-text-primary">
                    {team.team_name}
                  </Text>
                  <Text size="xs" className="text-teamgm-text-muted">
                    {team.team_abbreviation}
                  </Text>
                </Box>
              ))
            )}
          </Box>
        </VStack>

        {hasLiveApi && favorites.length > 0 && !hasInsightEligibleFavorite ? (
          <Text size="sm" className="text-teamgm-text-muted">
            {HOME_COPY.insightsNeedFavorite}
          </Text>
        ) : null}

        {canRunAnalysis ? (
          <Button
            onPress={onRunAnalysis}
            isDisabled={isGenerating}
            className="rounded-lg bg-teamgm-accent">
            {isGenerating ? <ButtonSpinner color="#001824" /> : null}
            <ButtonText className="font-semibold text-teamgm-app">
              {isGenerating ? HOME_COPY.runningAnalysis : HOME_COPY.runAnalysis}
            </ButtonText>
          </Button>
        ) : null}

        {insightsErrorMessage ? (
          <Text size="sm" className="text-teamgm-accent">
            {insightsErrorMessage}
          </Text>
        ) : null}

        {!insight && canRunAnalysis && !isGenerating ? (
          <Text size="sm" className="text-teamgm-text-muted">
            {HOME_COPY.noAnalysisYet}
          </Text>
        ) : null}

        {insight ? (
          <>
        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader icon="calendar-outline" iconColor="#669bbc" title={HOME_COPY.nextGame} />
          <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
            <Text size="sm" className="mb-1 text-teamgm-text-primary">
              {insight.upcomingGame.team} {upcomingLocation} {insight.upcomingGame.opponent}
            </Text>
            <Text size="xs" className="text-teamgm-text-muted">
              {insight.upcomingGame.time}
            </Text>
          </Box>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader
            icon="alert-circle-outline"
            iconColor="#fbbf24"
            title={HOME_COPY.whyTonightMatters}
          />
          <VStack space="sm">
            {insight.whyItMatters.map((reason) => (
              <HStack key={reason} className="items-start gap-2">
                <Text size="xs" className="text-teamgm-accent">
                  •
                </Text>
                <Text size="xs" className="flex-1 text-teamgm-text-muted">
                  {reason}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader
            icon="bar-chart-outline"
            iconColor="#4ade80"
            title={`${insight.briefing.team} ${HOME_COPY.briefingSuffix}`}
          />
          <Text size="xs" className="mb-3 leading-5 text-teamgm-text-muted">
            {insight.briefing.summary}
          </Text>
          <Text size="xs" className="leading-5 text-teamgm-text-muted">
            {insight.briefing.context}
          </Text>
          <Text size="xs" className="mt-2 text-teamgm-text-muted">
            {insight.teamName} · {LEAGUE_LABELS[insight.league]}
          </Text>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader
            icon="alert-circle-outline"
            iconColor="#fb923c"
            title={HOME_COPY.fanConcernMeter}
          />
          <HStack className="mb-3 items-center gap-3">
            <Box className="h-2 flex-1 overflow-hidden rounded-full bg-teamgm-surface">
              <Box
                className="h-full bg-teamgm-accent"
                style={{ width: `${concernWidthPercent}%` }}
              />
            </Box>
            <Text size="sm" bold className="text-teamgm-text-primary">
              {insight.concernLevel.level}/10
            </Text>
          </HStack>
          <Text size="xs" className="leading-5 text-teamgm-text-muted">
            {insight.concernLevel.description}
          </Text>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader icon="flame-outline" iconColor="#f87171" title={HOME_COPY.playerTrends} />
          <VStack space="md">
            <VStack space="sm">
              <Text size="xs" bold className="text-green-400">
                {HOME_COPY.stockUp}
              </Text>
              {insight.playerTrends.stockUp.map((player) => (
                <Box
                  key={player.name}
                  className="rounded-lg border border-teamgm-border bg-teamgm-surface p-2">
                  <Text size="xs" className="text-teamgm-text-primary">
                    {player.name}
                  </Text>
                  <Text size="xs" className="text-teamgm-text-muted">
                    {player.stat}
                  </Text>
                </Box>
              ))}
            </VStack>
            <VStack space="sm">
              <Text size="xs" bold className="text-red-400">
                {HOME_COPY.stockDown}
              </Text>
              {insight.playerTrends.stockDown.map((player) => (
                <Box
                  key={player.name}
                  className="rounded-lg border border-teamgm-border bg-teamgm-surface p-2">
                  <Text size="xs" className="text-teamgm-text-primary">
                    {player.name}
                  </Text>
                  <Text size="xs" className="text-teamgm-text-muted">
                    {player.stat}
                  </Text>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader
            icon="trophy-outline"
            iconColor="#c084fc"
            title={HOME_COPY.recentPerformance}
          />
          <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
            <Text size="xs" bold className="mb-2 text-teamgm-text-primary">
              {insight.recentPerformance.headline}
            </Text>
            <Text size="xs" className="mb-3 leading-5 text-teamgm-text-muted">
              {insight.recentPerformance.summary}
            </Text>
            <HStack className="gap-2">
              <VStack className="flex-1" space="xs">
                <Text size="xs" className="text-green-400">
                  {HOME_COPY.whatWentRight}
                </Text>
                <Text size="xs" className="text-teamgm-text-muted">
                  {insight.recentPerformance.wentRight}
                </Text>
              </VStack>
              <VStack className="flex-1" space="xs">
                <Text size="xs" className="text-teamgm-accent">
                  {HOME_COPY.whatWentWrong}
                </Text>
                <Text size="xs" className="text-teamgm-text-muted">
                  {insight.recentPerformance.wentWrong}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Box>
          </>
        ) : null}
      </ScrollView>
    </VStack>
  );
}
