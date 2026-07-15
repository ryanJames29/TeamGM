import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MYGM_COPY } from '@/constants/mygm-copy';
import { Accent, Info } from '@/constants/theme';

type MyGmStatePanelProps = {
  kind: 'loading' | 'error' | 'empty';
  message: string;
  onRetry?: () => void;
};

// Full-width loading, error, or empty state for myGM screens
export function MyGmStatePanel({ kind, message, onRetry }: MyGmStatePanelProps) {
  const iconName = kind === 'error' ? 'warning-outline' : 'clipboard-outline';
  const iconColor = kind === 'error' ? Accent : Info;
  const showRetry = kind === 'error' && Boolean(onRetry);

  return (
    <Box className="rounded-2xl border border-teamgm-border bg-teamgm-secondary p-6">
      <VStack className="items-center gap-3">
        {kind === 'loading' ? (
          <ActivityIndicator color={Accent} size="large" />
        ) : (
          <Box className="h-12 w-12 items-center justify-center rounded-full bg-teamgm-surface">
            <Ionicons name={iconName} size={24} color={iconColor} />
          </Box>
        )}
        <Text size="sm" className="text-center leading-5 text-teamgm-text-muted">
          {message}
        </Text>
        {showRetry ? (
          <Button onPress={onRetry} className="rounded-lg bg-teamgm-accent px-5">
            <ButtonText className="font-semibold text-teamgm-app">
              {MYGM_COPY.retry}
            </ButtonText>
          </Button>
        ) : null}
      </VStack>
    </Box>
  );
}
