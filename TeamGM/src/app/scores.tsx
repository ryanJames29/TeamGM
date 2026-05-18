import React from 'react';

import { GameScoreBox } from '@/components/gameScoreBox';
import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
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
  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={SCORES_COPY.title} />
      <VStack className="flex-1 p-6">
        <Text size="md" className="text-teamgm-text-muted">
          {SCORES_COPY.subtitle}
        </Text>
        <GameScoreBox />
      </VStack>
    </VStack>
  );
}
