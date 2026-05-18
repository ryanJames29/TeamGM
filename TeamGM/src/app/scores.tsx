import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { GameScoreBox } from '@/components/gameScoreBox';
import { LeagueSelector } from '@/components/leagueSelector';
import { ScreenHeader } from '@/components/screen-header';
import { VStack } from '@/components/ui/vstack';
import { getMockScoresByLeague } from '@/mock-data';
import type { MajorLeague } from '@/mock-data/types/scores';
import { ScoresTabIcon } from '@/navigation/tab-icons';

export const SCORES_COPY = {
  title: 'Scores',
  subtitle: 'Live scores and game results will appear here.',
} as const;

export const options = {
  title: SCORES_COPY.title,
  tabBarLabel: SCORES_COPY.title,
  tabBarIcon: ScoresTabIcon,
};

export default function ScoresScreen() {
  const [selectedLeague, setSelectedLeague] = useState<MajorLeague>('nfl');
  const games = getMockScoresByLeague(selectedLeague);

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={SCORES_COPY.title} />
      <View className="py-4">
        <LeagueSelector selectedLeague={selectedLeague} onSelect={setSelectedLeague} />
      </View>
      <ScrollView className="flex-1" contentContainerClassName="gap-3 px-4">
        {games.map((game) => (
          <GameScoreBox key={game.id} game={game} />
        ))}
      </ScrollView>
    </VStack>
  );
}
