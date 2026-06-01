import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { API_BASE_URL } from '@/constants/api';
import { LEAGUE_LABELS } from '@/constants/game-copy';
import { useAuth } from '@/contexts/auth-provider';
import {
  getRtkErrorMessage,
  homeInsightsApiEnabled,
  useGenerateHomeInsightsMutation,
  useGetFavoriteTeamsQuery,
} from '@/store/api';

import { BriefingCard } from './components/BriefingCard';
import { ConcernMeterCard } from './components/ConcernMeterCard';
import { FavoriteTeamsSection } from './components/FavoriteTeamsSection';
import { NextGameCard } from './components/NextGameCard';
import { RecentPerformanceCard } from './components/RecentPerformanceCard';
import { WhyItMattersCard } from './components/WhyItMattersCard';

export const HOME_COPY = {
  title: 'Home',
  yourTeams: 'Your Teams',
  loadingTeams: 'Loading your teams…',
  noFavoriteTeams: 'Star a team on the Scores tab to pin them here.',
  favoriteLoadError: 'Could not load favorite teams.',
  runAnalysis: 'Run analysis',
  runningAnalysis: 'Running analysis…',
  insightsError: 'Could not run analysis.',
  insightsNeedFavorite: 'Favorite an NHL or MLB team to run analysis.',
  noAnalysisYet: 'Tap Run analysis to generate a briefing for your favorite team.',
} as const;

// Home tab screen (favorites + AI briefing)
export default function HomeScreen() {
  const { userId } = useAuth();
  const canUseInsightsApi = homeInsightsApiEnabled && Boolean(userId);
  const hasLiveApi = Boolean(API_BASE_URL);

  const {
    data: favorites = [],
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useGetFavoriteTeamsQuery(userId ?? '', { skip: !userId });

  const hasInsightEligibleFavorite = favorites.some((team) => team.league === 'nhl' || team.league === 'mlb');
  const canRunAnalysis = canUseInsightsApi && hasInsightEligibleFavorite;

  const [generateInsights, { data: insightsData, error: insightsError, isLoading: isGenerating }] =
    useGenerateHomeInsightsMutation();

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
  const nextGame = insightsData?.nextGame ?? null;
  const showNoAnalysisYet = !insight && canRunAnalysis && !isGenerating;

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={HOME_COPY.title} />
      <ScrollView className="flex-1" contentContainerClassName="gap-3 p-3 pb-24">
        <FavoriteTeamsSection
          favorites={favorites}
          isLoading={favoritesLoading}
          errorMessage={favoritesErrorMessage}
          sectionTitle={HOME_COPY.yourTeams}
          loadingMessage={HOME_COPY.loadingTeams}
          emptyMessage={HOME_COPY.noFavoriteTeams}
        />

        {hasLiveApi && favorites.length > 0 && !hasInsightEligibleFavorite ? (
          <Text size="sm" className="text-teamgm-text-muted">
            {HOME_COPY.insightsNeedFavorite}
          </Text>
        ) : null}

        {canRunAnalysis ? (
          <Button onPress={onRunAnalysis} isDisabled={isGenerating} className="rounded-lg bg-teamgm-accent">
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

        {showNoAnalysisYet ? (
          <Text size="sm" className="text-teamgm-text-muted">
            {HOME_COPY.noAnalysisYet}
          </Text>
        ) : null}

        {insight ? (
          <>
            <NextGameCard teamName={insight.teamName} nextGame={nextGame} />
            <WhyItMattersCard reasons={insight.whyItMatters} />
            <BriefingCard
              titleTeam={insight.briefing.team}
              summary={insight.briefing.summary}
              context={insight.briefing.context}
              footer={`${insight.teamName} · ${LEAGUE_LABELS[insight.league]}`}
            />
            <ConcernMeterCard level={insight.concernLevel.level} description={insight.concernLevel.description} />
            <RecentPerformanceCard
              headline={insight.recentPerformance.headline}
              lastGameSummary={insight.recentPerformance.lastGameSummary}
            />
          </>
        ) : null}
      </ScrollView>
    </VStack>
  );
}
