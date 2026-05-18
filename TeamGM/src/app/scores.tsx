import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { GameScoreBox } from '@/components/gameScoreBox';
import { LeagueSelector } from '@/components/leagueSelector';
import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useNhlScores } from '@/hooks/use-nhl-scores';
import { getMockScoresByLeague } from '@/mock-data';
import type { MajorLeague } from '@/mock-data/types/scores';
import { ScoresTabIcon } from '@/navigation/tab-icons';

export const SCORES_COPY = {
  title: 'Scores',
  subtitle: 'Live scores and game results will appear here.',
  loadingNhl: 'Loading NHL scores…',
  emptyNhl: 'No NHL games in the last week.',
} as const;

export const options = {
  title: SCORES_COPY.title,
  tabBarLabel: SCORES_COPY.title,
  tabBarIcon: ScoresTabIcon,
};

export default function ScoresScreen() {
  const [selectedLeague, setSelectedLeague] = useState<MajorLeague>('nfl');
  const isNhl = selectedLeague === 'nhl';
  const nhl = useNhlScores(isNhl);
  const mockGames = getMockScoresByLeague(selectedLeague);
  const games = isNhl ? nhl.games : mockGames;

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={SCORES_COPY.title} />
      <View className="py-4">
        <LeagueSelector selectedLeague={selectedLeague} onSelect={setSelectedLeague} />
      </View>
      {isNhl && nhl.isLoading ? (
        <VStack className="flex-1 items-center justify-center gap-3 px-4">
          <ActivityIndicator color="#f97316" />
          <Text size="sm" className="text-teamgm-text-muted">
            {SCORES_COPY.loadingNhl}
          </Text>
        </VStack>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="gap-3 px-4">
          {isNhl && nhl.error ? (
            <Text size="sm" className="text-teamgm-accent">
              {nhl.error}
            </Text>
          ) : null}
          {isNhl && !nhl.isLoading && !nhl.error && games.length === 0 ? (
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
