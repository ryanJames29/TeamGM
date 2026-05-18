import React from 'react';

import { ApiStatusCard } from '@/components/api-status-card';
import { ScreenHeader } from '@/components/screen-header';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ProfileTabIcon } from '@/navigation/tab-icons';

export const PROFILE_COPY = {
  title: 'Profile',
  subtitle: 'Your account and settings will live here.',
} as const;

export const options = {
  title: PROFILE_COPY.title,
  tabBarLabel: PROFILE_COPY.title,
  tabBarIcon: ProfileTabIcon,
};

export default function ProfileScreen() {
  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={PROFILE_COPY.title} />
      <VStack className="flex-1 gap-4 p-6">
        <Text size="md" className="text-teamgm-text-muted">
          {PROFILE_COPY.subtitle}
        </Text>
        <ApiStatusCard />
      </VStack>
    </VStack>
  );
}
