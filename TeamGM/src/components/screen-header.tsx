import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type ScreenHeaderProps = {
  title: string;
};

function formatTitle(title: string) {
  if (!title) return title;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const { top } = useSafeAreaInsets();
  const displayTitle = formatTitle(title);

  return (
    <Box className="bg-teamgm-secondary" style={{ paddingTop: top }}>
      <Box className="h-12 flex-row justify-center px-4">
        <Text size="lg" bold className="text-teamgm-text-primary">
          {displayTitle}
        </Text>
      </Box>
    </Box>
  );
}
