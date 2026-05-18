import React from 'react';

import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SCORES_COPY } from '@/constants/copy';
import { MAIN_TAB_OPTIONS } from '@/navigation/tab-options';

export const options = MAIN_TAB_OPTIONS.scores;

export default function ScoresScreen() {
  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={SCORES_COPY.title} />
      <VStack className="flex-1 p-6">
        <Text size="md" className="text-teamgm-text-muted">
          {SCORES_COPY.subtitle}
        </Text>
      </VStack>
    </VStack>
  );
}
