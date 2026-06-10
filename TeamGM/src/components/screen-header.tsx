import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { NAV_COPY } from '@/constants/copy';
import { Info } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
};

function formatTitle(title: string) {
  if (!title) return title;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

// App shell header — optional back chevron on the left when onBack is set.
export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const { top } = useSafeAreaInsets();
  const displayTitle = formatTitle(title);
  const showBack = Boolean(onBack);

  return (
    <Box className="bg-teamgm-secondary" style={{ paddingTop: top }}>
      <Box className="h-10 flex-row items-center px-4">
        <Box className="w-10 items-start justify-center">
          {showBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={NAV_COPY.back}>
              <Ionicons name="chevron-back" size={24} color={Info} />
            </Pressable>
          ) : null}
        </Box>
        <Box className="flex-1 items-center justify-center">
          <Text size="2xl" bold className="pb-4 text-teamgm-text-primary">
            {displayTitle}
          </Text>
        </Box>
        <Box className="w-10" />
      </Box>
    </Box>
  );
}
