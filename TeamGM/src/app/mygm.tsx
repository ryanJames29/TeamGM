import React from 'react';

import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MyGMTabIcon } from '@/navigation/tab-icons';

export const MYGM_COPY = {
  title: 'myGM',
  subtitle: 'Manage your roster and lineups here.',
} as const;

export const options = {
  title: MYGM_COPY.title,
  tabBarLabel: MYGM_COPY.title,
  tabBarIcon: MyGMTabIcon,
};

export default function MyGMScreen() {
  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={MYGM_COPY.title} />
      <VStack className="flex-1 p-6">
        <Text size="md" className="text-teamgm-text-muted">
          {MYGM_COPY.subtitle}
        </Text>
      </VStack>
    </VStack>
  );
}
