import React from 'react';

import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { PROFILE_COPY } from '@/constants/copy';
import { MAIN_TAB_OPTIONS } from '@/navigation/tab-options';

export const options = MAIN_TAB_OPTIONS.profile;

export default function ProfileScreen() {
  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={PROFILE_COPY.title} />
      <VStack className="flex-1 p-6">
        <Text size="md" className="text-teamgm-text-muted">
          {PROFILE_COPY.subtitle}
        </Text>
      </VStack>
    </VStack>
  );
}
