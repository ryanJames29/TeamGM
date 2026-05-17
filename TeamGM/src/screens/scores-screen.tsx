import React from 'react';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SCORES_COPY } from '@/constants/copy';

// Scores tab screen
export function ScoresScreen() {
  return (
    <VStack className="flex-1 bg-teamgm-app p-6">
      <Text size="4xl" bold className="text-center text-teamgm-text-primary">
        {SCORES_COPY.title}
      </Text>
      <Text size="md" className="text-center text-teamgm-text-muted">
        {SCORES_COPY.subtitle}
      </Text>
    </VStack>
  );
}
