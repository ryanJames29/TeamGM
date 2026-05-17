import React from 'react';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { PROFILE_COPY } from '@/constants/copy';

// Profile tab screen
export function ProfileScreen() {
  return (
    <VStack className="flex-1 bg-teamgm-app p-6">
      <Text size="4xl" bold className="text-center text-teamgm-text-primary">
        {PROFILE_COPY.title}
      </Text>
      <Text size="md" className="text-center text-teamgm-text-muted">
        {PROFILE_COPY.subtitle}
      </Text>
    </VStack>
  );
}
